package handlers

import (
	//"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"
	"office-mapper/config"
	"ooyala/go-ooyalalog"
	"os"
	"strings"
)

func HealthzHandler(w http.ResponseWriter, r *http.Request) {
	// Log the server status and additional error information if healthz fails
	logger := ooyalalog.NewLogger(r)

	if _, err := os.Stat("/etc/maint"); !os.IsNotExist(err) {
		logger.Set("Server-Status", "MAINTENANCE")
		w.Header().Add("Server-Status", "MAINTENANCE")
		http.Error(w, "Service is under maintenance", http.StatusNotFound)
		return
	}

	//if err := validateDBConnection(); err == nil {
	w.Header().Add("Server-Status", "OK")
	fmt.Fprintln(w, "office-mapper knows where you live")
	/*} else {
		// Skeletor can still serve some requests from the cache if the DB is down
		w.Header().Add("Server-Status", "DEGRADED")
		logger.Set("Server-Status", "Degraded due to DB connection error")
		logger.Set("Error", err.Error())
		msg := map[string]string{
			"message": "Error connecting to the DB",
			"error":   err.Error(),
		}
		resp, _ := json.Marshal(msg)
		http.Error(w, string(resp), http.StatusInternalServerError)
	}*/
}

/*func validateDBConnection() error {
	row, err := config.DB.QueryRow(`SELECT 1 FROM DUAL`)
	defer row.Close()
	return err
}*/

// This route raises a panic and is only intended for tests
func PanicRouteHandler(w http.ResponseWriter, r *http.Request) {
	panic("/panic always causes a panic")
}

type StatuszInfo struct {
	ReleaseTime   string
	ReleaseBranch string
	Commits       []string
}

func StatuszHandler(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("templates/statusz.template")
	if err != nil {
		e := fmt.Sprintf("Error parsing template file. Error: %s", err.Error())
		http.Error(w, e, http.StatusInternalServerError)
		return
	}

	branch, err := ioutil.ReadFile(config.Settings.StatusInfoDir + "/branch")
	if err != nil {
		e := fmt.Sprintf("Error reading branch file. Error: %s", err.Error())
		http.Error(w, e, http.StatusInternalServerError)
		return
	}

	time, err := ioutil.ReadFile(config.Settings.StatusInfoDir + "/time")
	if err != nil {
		e := fmt.Sprintf("Error reading time file. Error: %s", err.Error())
		http.Error(w, e, http.StatusInternalServerError)
		return
	}

	commits, err := ioutil.ReadFile(config.Settings.StatusInfoDir + "/revlist")
	if err != nil {
		e := fmt.Sprintf("Error reading commits file. Error: %s", err.Error())
		http.Error(w, e, http.StatusInternalServerError)
		return
	}

	commitList := strings.Split(string(commits), "\n")
	info := &StatuszInfo{string(time), string(branch), commitList}

	t.Execute(w, info)
}
