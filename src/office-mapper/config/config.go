package config

import (
	"encoding/json"
	"fmt"
	_ "github.com/ziutek/mymysql/godrv"
	"io/ioutil"
	"log"
	"office-mapper/db"
	"os"
	"strconv"
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
			Address  string `json:"address"`
			Username string   `json:"username"`
			Password string   `json:"password"`
		} `json:"mysql"`
		OfficeMapperDeps struct {
			GoogleApiId     string `json:"google_api_id"`
			GoogleApiSecret string `json:"google_api_secret"`
		} `json:"office-mapper-deps"`
	} `json:"dependencies"`

	StatusInfoDir string
}

// Atlantis exposes environment configs in a json file
// http_port is the port the service should listen on
func loadConfig() *settings {
	var path string
	s := &settings{}
	if p := os.Getenv("ATLANTIS"); p == "true" {
		path = atlantisConfigFilePath
	} else if p := os.Getenv("HEROKU"); p == "true" {
		path = ""
	} else {
		path = localConfigFilePath
	}

	if path != "" {
		data, err := ioutil.ReadFile(path)
		if err != nil {
			log.Fatalf("Error reading configuration from %s\n. Error: %s\n", path, err.Error())
		}

		err = json.Unmarshal(data, s)
		if err != nil {
			log.Fatalf("Error unmarshalling json from config file. Error: %s\nRaw data: %v\n", err.Error(),
				string(data))
		}
	} else {
		getSettingsFromEnvironment(s)
	}

	//s.DatadogAddr = datadogAddr
	if p := os.Getenv("ATLANTIS"); p == "true" {
		s.StatusInfoDir = atlantisStatusDir
	} else {
		s.StatusInfoDir = localStatusDir
	}

	if v := os.Getenv("GOOGLE_API_ID"); v != "" {
		s.Dependencies.OfficeMapperDeps.GoogleApiId = v
	}
	if v := os.Getenv("GOOGLE_API_SECRET"); v != "" {
		s.Dependencies.OfficeMapperDeps.GoogleApiSecret = v
	}

	return s
}

// func getSettingsFromEnvironment({}) {
func getSettingsFromEnvironment(s *settings) {
	port, err := strconv.ParseUint(os.Getenv("PORT"), 0, 16)
	if err != nil {
		log.Fatalf("Error converting PORT value from environment: %s\n", err.Error())
	}
	s.HTTPPort = uint16(port)
	s.Container.ID = os.Getenv("OM_CONTAINER_ID")
	s.Container.Host = os.Getenv("OM_CONTAINER_HOST")
	s.Container.Env = os.Getenv("OM_CONTAINER_ENV")

	s.Dependencies.MySQL.Address = os.Getenv("OM_DB_ADDRESS")
	s.Dependencies.MySQL.Username = os.Getenv("OM_DB_USERNAME")
	s.Dependencies.MySQL.Password = os.Getenv("OM_DB_PASSWORD")
}

func initDatabaseConn() *dbwrapper.DB {
	connString := fmt.Sprintf("tcp:%s*%s/%s/%s", Settings.Dependencies.MySQL.Address, "officemapper", Settings.Dependencies.MySQL.Username, Settings.Dependencies.MySQL.Password)

	db, err := dbwrapper.GetDB("OfficeMapper:", connString, "mymysql", os.Stderr, []string{`SELECT 1 FROM DUAL`})
	db.SetMaxIdleConns(30)
	db.SetMaxOpenConns(30)
	if err != nil {
		log.Fatalf("Error creating database connection. DB Urls: %v. \nError: %v\n",
			connString, err.Error())
	}
	return db
}
// Other package inits may use Settings. So do this during var initialization
// so that it happens before init()s are run.
var Settings = loadConfig()

//var DatadogClient = initDatadogClient()
var DB = initDatabaseConn()
