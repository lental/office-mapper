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
	r.HandleFunc("/v1/maps", MapsHandler).Methods("GET")   // Sparse
	r.HandleFunc("/v1/users", UsersHandler).Methods("GET") // All data
	r.HandleFunc("/v1/rooms", MapsHandler).Methods("GET")  // All data
	r.HandleFunc("/v1/places", MapsHandler).Methods("GET") // All data

	r.HandleFunc("/healthz", HealthzHandler).Methods("GET")
	r.HandleFunc("/statusz", StatuszHandler).Methods("GET")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./static/")))
	return r
}

func MapsHandler(w http.ResponseWriter, r *http.Request) {
	maps, err := data.Maps()
	if err != nil {
		panic("Error getting maps data")
	}
	resp, err := json.Marshal(map[string][]data.Map{"maps": maps})
	if err != nil {
		panic("Error converting to JSON")
	}
	w.Write(resp)
}

func UsersHandler(w http.ResponseWriter, r *http.Request) {
	users, err := data.Users()
	if err != nil {
		panic("Error getting maps data")
	}
	resp, err := json.Marshal(map[string][]data.User{"users": users})
	if err != nil {
		panic("Error converting to JSON")
	}
	w.Write(resp)
}
