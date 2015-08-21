package config

import (
	"encoding/json"
	"fmt"
	_ "github.com/ziutek/mymysql/godrv"
	"io/ioutil"
	"log"
	"ooyala/go-ooyaladb"
	"os"
)

const (
	atlantisConfigFilePath = "/etc/atlantis/config/config.json"
	localConfigFilePath    = "dev_config.json"
	atlantisStatusDir      = "/etc/atlantis/build"
	localStatusDir         = "build"
	datadogAddr            = "localhost:8125"
)

// Atlantis exposes configurations in a specific structure based on apps this depends on
type settings struct {
	HTTPPort  uint16 `json:"http_port"`
	Container struct {
		ID   string `json:"id"`
		Host string `json:"host"`
		Env  string `json:"env"`
	} `json:"container"`
	Dependencies struct {
		MySQL struct {
			Address  []string `json:"address"`
			Username string   `json:"username"`
			Password string   `json:"password"`
		} `json:"mysql"`
	} `json:"dependencies"`

	StatusInfoDir string
}

// Atlantis exposes environment configs in a json file
// http_port is the port the service should listen on
func loadConfig() *settings {
	var path string
	if p := os.Getenv("ATLANTIS"); p == "true" {
		path = atlantisConfigFilePath
	} else {
		path = localConfigFilePath
	}

	data, err := ioutil.ReadFile(path)
	if err != nil {
		log.Fatalf("Error reading configuration from %s\n. Error: %s\n", path, err.Error())
	}

	s := &settings{}
	err = json.Unmarshal(data, s)
	if err != nil {
		log.Fatalf("Error unmarshalling json from config file. Error: %s\nRaw data: %v\n", err.Error(),
			string(data))
	}

	//s.DatadogAddr = datadogAddr
	if p := os.Getenv("ATLANTIS"); p == "true" {
		s.StatusInfoDir = atlantisStatusDir
	} else {
		s.StatusInfoDir = localStatusDir
	}

	return s
}

func initDatabaseConn() *oodb.DB {
	dbs := []string{}
	for _, h := range Settings.Dependencies.MySQL.Address {
		connString := fmt.Sprintf("tcp:%s*%s/%s/%s", h, "officemapper", Settings.Dependencies.MySQL.Username, Settings.Dependencies.MySQL.Password)
		dbs = append(dbs, connString)
	}

	db, err := oodb.GetDB("OfficeMapper:", dbs, "mymysql", os.Stderr, []string{`SELECT 1 FROM DUAL`})
	db.SetMaxIdleConns(30)
	db.SetMaxOpenConns(30)
	if err != nil {
		log.Fatalf("Error creating database connection. DB Urls: %v. \nError: %v\n",
			dbs, err.Error())
	}
	return db
}

// Other package inits may use Settings. So do this during var initialization
// so that it happens before init()s are run.
var Settings = loadConfig()

//var DatadogClient = initDatadogClient()
var DB = initDatabaseConn()
