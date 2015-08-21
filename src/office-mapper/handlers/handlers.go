package handlers

import (
	//"github.com/gorilla/context"
	"encoding/json"
	"github.com/gorilla/mux"
	_ "github.com/ziutek/mymysql/godrv"
	"net/http"
	"office-mapper/data"
)

func AppHandlers() http.Handler {
	r := mux.NewRouter()

	// The Ooyalalog handler logs variables stored in the request context, so don't clear them after the
	// request has been handled. Instead, use context.ClearHandler to clear the context after all the handlers
	// have run
	r.KeepContext = true

	// App routes
	r.HandleFunc("/maps", MapsHandler).Methods("GET")
	r.HandleFunc("/healthz", HealthzHandler).Methods("GET")
	r.HandleFunc("/statusz", StatuszHandler).Methods("GET")
	return r
}

func MapsHandler(w http.ResponseWriter, r *http.Request) {
	maps, err := data.Maps()
	if err != nil {
		panic("Error getting maps data")
	}
	resp, err := json.Marshal(maps)
	if err != nil {
		panic("Error converting to JSON")
	}
	w.Write(resp)
}
