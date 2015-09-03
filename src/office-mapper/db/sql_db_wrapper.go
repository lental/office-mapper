package dbwrapper

import (
  "database/sql"
  "encoding/json"
  "errors"
  "fmt"
  "io"
  "log"
  "regexp"
  "strings"
  "time"
)

type dbLog struct {
  Timestamp int64  `json:"timestamp"`
  Host      string `json:"host"`
  Query     string `json:"query"`
  Error     string `json:"error"`
}

var hostRegexp = regexp.MustCompile(`^([^/]*)/(.*)`)

type DB struct {
  db            *sql.DB
  connection string
  logger         *log.Logger
}

func GetDB(name string, connectionURL string, adapter string, w io.Writer, dontlog []string) (*DB, error) {
  if adapter == "" {
    return nil, errors.New("Missing adapter")
  }

  db := &DB{
    logger:       log.New(w, "\n"+name, log.LstdFlags),
    connection: connectionURL,
  }

  sqldb, err := sql.Open(adapter, connectionURL)
  if err != nil {
    db.logWithHost(connectionURL, "", err)
  }
  db.db = sqldb
  return db, nil
}

func (db *DB) Query(query string, args ...interface{}) (result *sql.Rows, err error) {
  result, err = db.db.Query(query, args...)
  db.logWithHost(db.connection, query, err, args...)
  return
}

func (db *DB) QueryRow(query string, args ...interface{}) (result *sql.Rows,err error) {
  result, err = db.db.Query(query, args...)
  db.logWithHost(db.connection, query, err, args...)
  return 
}

func (db *DB) Exec(query string, args ...interface{}) (result sql.Result, err error) {
  result, err = db.db.Exec(query, args...)
  db.logWithHost(db.connection, query, err, args...)
  return
}

func (db *DB) Prepare(query string) (result *sql.Stmt, err error) {
  result, err = db.db.Prepare(query)
  db.logWithHost(db.connection, query, err)
  return
}
func (db *DB) Begin() (transaction *sql.Tx, err error) {
  transaction, err = db.db.Begin()
  // db.logWithHost(db.connections[0], "Begin", err)
  return
}

func (db *DB) SetMaxIdleConns(n int) {
    db.db.SetMaxIdleConns(n)
}
func (db *DB) SetMaxOpenConns(n int) {
    db.db.SetMaxOpenConns(n)
}

func (db *DB) logWithHost(conn string, query string, err error, args ...interface{}) {

  dl := dbLog{time.Now().Unix(), hostRegexp.ReplaceAllString(conn, "$1"), "", ""}
  if query != "" {
    dl.Query = formatQuery(query, args...)
  }
  if err != nil {
    dl.Error = err.Error()
  }

  dblogJson, _ := json.Marshal(dl)
  db.logger.Print("DBLOG_START\n", string(dblogJson))
}

func formatQuery(query string, args ...interface{}) string {
  arr := strings.Split(query, "\n")
  for i, term := range arr {
    arr[i] = strings.TrimSpace(term)
  }
  formattedString := strings.Join(arr, " ")
  return fmt.Sprintf(strings.Replace(formattedString, "?", "%v", -1), args...)
}