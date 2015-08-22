package handlers

import (
	//"github.com/gorilla/context"
	"encoding/json"
	"github.com/gorilla/mux"
	_ "github.com/ziutek/mymysql/godrv"
	"net/http"
	"office-mapper/data"
	"strconv"
)

func AppHandlers() http.Handler {
	r := mux.NewRouter()

	// The Ooyalalog handler logs variables stored in the request context, so don't clear them after the
	// request has been handled. Instead, use context.ClearHandler to clear the context after all the handlers
	// have run
	r.KeepContext = true

	// App routes
	r.HandleFunc("/v1/maps", MapsHandler).Methods("GET")         // Sparse
	r.HandleFunc("/v1/sections", SectionsHandler).Methods("GET") // Sparse
	r.HandleFunc("/v1/users", UsersHandler).Methods("GET")       // All data
	r.HandleFunc("/v1/users", NewUserHandler).Methods("POST")
	r.HandleFunc("/v1/users/{id}", UserHandler).Methods("GET")
	r.HandleFunc("/v1/rooms", RoomsHandler).Methods("GET")   // All data
	r.HandleFunc("/v1/places", PlacesHandler).Methods("GET") // All data

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

func SectionsHandler(w http.ResponseWriter, r *http.Request) {
	sections, err := data.Sections()
	if err != nil {
		panic("Error getting sections data")
	}
	resp, err := json.Marshal(map[string][]data.Section{"sections": sections})
	if err != nil {
		panic("Error converting to JSON")
	}
	w.Write(resp)
}

func UsersHandler(w http.ResponseWriter, r *http.Request) {
	users, err := data.Users()
	if err != nil {
		panic("Error getting user data")
	}
	resp, err := json.Marshal(map[string][]data.User{"users": users})
	if err != nil {
		panic("Error converting to JSON")
	}
	w.Write(resp)
}

func NewUserHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var u data.User
	err := decoder.Decode(&u)
	if err != nil {
		http.Error(w, `{"error": "bad user data: `+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	id, err := data.NewUser(u)
	if err != nil {
		http.Error(w, `{"error": "error creating user: `+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	user, err := data.GetUser(id)
	if err != nil {
		panic("Error getting user data")
	}
	resp, err := json.Marshal(map[string]interface{}{"user": user})
	if err != nil {
		panic("Error converting to JSON")
	}
	w.Write(resp)
}

func UserHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad user id"}`, http.StatusBadRequest)
		return
	}
	user, err := data.GetUser(id)

	if err != nil {
		panic("Error getting user data")
	}
	if user == nil {
		http.Error(w, `{"error": "user not found"}`, http.StatusNotFound)
		return
	}
	resp, err := json.Marshal(map[string]interface{}{"user": user})
	if err != nil {
		panic("Error converting to JSON")
	}
	w.Write(resp)
}

func RoomsHandler(w http.ResponseWriter, r *http.Request) {
	rooms, err := data.Rooms()
	if err != nil {
		panic("Error getting rooms data")
	}
	resp, err := json.Marshal(map[string][]data.Room{"rooms": rooms})
	if err != nil {
		panic("Error converting to JSON")
	}
	w.Write(resp)
}

func PlacesHandler(w http.ResponseWriter, r *http.Request) {
	places, err := data.Places()
	if err != nil {
		panic("Error getting places data")
	}
	resp, err := json.Marshal(map[string][]data.Place{"places": places})
	if err != nil {
		panic("Error converting to JSON")
	}
	w.Write(resp)
}
