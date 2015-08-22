package data

import (
	"database/sql"
	"office-mapper/config"
	"reflect"
	"strings"
	"unicode"
)

func sqlCase(s string) string {
	s = strings.ToLower(s[0:1]) + s[1:]
	for i := 0; i < len(s); i++ {
		if unicode.IsUpper(rune(s[i])) {
			s = s[:i] + "_" + strings.ToLower(s[i:i+1]) + s[i+1:]
		}
	}

	return s
}

func tableName(s string) string {
	return sqlCase(s) + "s"
}

func extractStructureFieldAddress(v reflect.Value, columnMaps map[string]interface{}) {
	for i := 0; i < v.NumField(); i++ {
		if v.Type().Field(i).Type.Kind() == reflect.Struct {
			extractStructureFieldAddress(v.Field(i), columnMaps)
			continue
		}

		fieldName := v.Type().Field(i).Name
		columnName := sqlCase(fieldName)
		if tag := v.Type().Field(i).Tag.Get("sql"); tag != "" {
			columnName = tag
		}
		columnMaps[columnName] = v.Field(i).Addr().Interface()
	}

}

func extractRow(rv reflect.Value, rows *sql.Rows) {
	columns, err := rows.Columns()
	if err != nil {
		panic("Error extracing column names")
	}

	columnMaps := map[string]interface{}{}
	extractStructureFieldAddress(rv, columnMaps)

	scanInto := make([]interface{}, len(columns))
	for i, column := range columns {
		if addr, ok := columnMaps[column]; ok {
			scanInto[i] = addr
		}
	}
	rows.Scan(scanInto...)
}

func loadAll(result interface{}) error {
	v := reflect.ValueOf(result)
	if v.Kind() != reflect.Ptr {
		panic("loadAll passed a non-pointer")
	}
	v = reflect.Indirect(v)
	if v.Kind() != reflect.Slice {
		panic("loadAll passed a pointer to a non-slice type " + v.Kind().String())
	}
	if v.Type().Elem().Kind() != reflect.Struct {
		panic("loadAll passed an slice of non-structs")
	}

	elemType := v.Type().Elem()
	table := tableName(elemType.Name())
	rows, err := config.DB.Query(`SELECT * FROM ` + table)
	if err != nil {
		return err
	}

	for rows.Next() {
		rv := reflect.New(elemType).Elem()
		extractRow(rv, rows)
		v.Set(reflect.Append(v, rv))
	}

	return nil
}

func loadOne(id int, result interface{}) error {
	v := reflect.ValueOf(result)
	if v.Kind() != reflect.Ptr {
		panic("loadAll passed a non-pointer")
	}
	v = reflect.Indirect(v)
	if v.Kind() != reflect.Ptr {
		panic("loadAll passed a pointer to a non-pointer")
	}
	v = reflect.Indirect(v)
	if v.Kind() != reflect.Struct {
		panic("loadAll passed a pointer to a non-structure type " + v.Kind().String())
	}

	elemType := v.Type()
	table := tableName(elemType.Name())
	rows, err := config.DB.Query(`SELECT * FROM `+table+` WHERE id = ?`, id)
	if err != nil {
		return err
	}

	found := false

	for rows.Next() {
		extractRow(v, rows)
		found = true
	}

	if !found {
		v := reflect.ValueOf(result).Elem()
		v.Set(reflect.Zero(v.Type()))
	}

	return nil
}

func extractStructureFieldValues(v reflect.Value, columnMaps map[string]interface{}) {
	for i := 0; i < v.NumField(); i++ {
		if v.Type().Field(i).Type.Kind() == reflect.Struct {
			extractStructureFieldValues(v.Field(i), columnMaps)
			continue
		}

		fieldName := v.Type().Field(i).Name
		columnName := sqlCase(fieldName)
		if tag := v.Type().Field(i).Tag.Get("sql"); tag != "" {
			columnName = tag
		}
		columnMaps[columnName] = v.Field(i).Interface()
	}
}

func insertOne(input interface{}) error {
	v := reflect.ValueOf(input)
	if v.Kind() != reflect.Ptr {
		panic("loadAll passed a non-pointer")
	}
	v = reflect.Indirect(v)
	if v.Kind() != reflect.Struct {
		panic("loadAll passed a pointer to a non-structure")
	}

	elemType := v.Type()
	table := tableName(elemType.Name())

	columnMaps := map[string]interface{}{}
	extractStructureFieldValues(v, columnMaps)
	setFields := []string{}
	setValues := []interface{}{}
	for f, v := range columnMaps {
		setFields = append(setFields, f+" = ?")
		setValues = append(setValues, v)
	}
	result, err := config.DB.Exec(`INSERT INTO `+table+` SET `+strings.Join(setFields, ", "), setValues...)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	field := v.FieldByName("Id")
	if field.IsValid() {
		field.SetInt(id)
	}

	return nil
}
