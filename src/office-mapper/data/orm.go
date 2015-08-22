package data

import (
	"fmt"
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
		columnMaps := map[string]interface{}{}
		rv := reflect.New(elemType).Elem()
		for i := 0; i < rv.NumField(); i++ {
			fieldName := rv.Type().Field(i).Name
			columnName := sqlCase(fieldName)
			if rv.Field(i).CanAddr() {
				columnMaps[columnName] = rv.Field(i).Addr().Interface()
			} else {
				fmt.Printf("Can't addr: ")
			}
			fmt.Printf("%v => %v: %v\n", fieldName, columnName, rv.Field(i).Type())
		}
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
