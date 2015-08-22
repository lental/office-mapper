package data

import (
	"office-mapper/config"
	"reflect"
	"strings"
	"unicode"
)

func sqlCase(s string) string {
	s = strings.ToLower(s[0:1]) + s[1:]
	for i, r := range s {
		if unicode.IsUpper(r) {
			s = s[:i] + "_" + strings.ToLower(string(r)) + s[i+1:]
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

	columns, err := rows.Columns()
	if err != nil {
		return err
	}

	for rows.Next() {
		rv := reflect.New(elemType).Elem()
		columnMaps := map[string]interface{}{}
		extractStructureFieldAddress(rv, columnMaps)

		scanInto := make([]interface{}, len(columns))
		for i, column := range columns {
			if addr, ok := columnMaps[column]; ok {
				scanInto[i] = addr
			}
		}
		rows.Scan(scanInto...)
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

	columns, err := rows.Columns()
	if err != nil {
		return err
	}

	found := false

	for rows.Next() {
		columnMaps := map[string]interface{}{}
		extractStructureFieldAddress(v, columnMaps)

		scanInto := make([]interface{}, len(columns))
		for i, column := range columns {
			if addr, ok := columnMaps[column]; ok {
				scanInto[i] = addr
			}
		}
		rows.Scan(scanInto...)
		found = true
	}

	if !found {
		v := reflect.ValueOf(result).Elem()
		v.Set(reflect.Zero(v.Type()))
	}

	return nil
}
