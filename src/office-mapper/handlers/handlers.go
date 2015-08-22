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
	r.HandleFunc("/v1/maps", MapsHandler).Methods("GET") // Sparse
	r.HandleFunc("/v1/maps/{id}", MapHandler).Methods("GET")
	r.HandleFunc("/v1/sections", SectionsHandler).Methods("GET") // Sparse
	r.HandleFunc("/v1/users", UsersHandler).Methods("GET")       // All data
	r.HandleFunc("/v1/users", NewUserHandler).Methods("POST")
	r.HandleFunc("/v1/users/{id}", UserHandler).Methods("GET")
	r.HandleFunc("/v1/users/{id}", DeleteUserHandler).Methods("DELETE")
	r.HandleFunc("/v1/users/{id}", UpdateUserHandler).Methods("PUT")
	r.HandleFunc("/v1/rooms", RoomsHandler).Methods("GET")            // All data
	r.HandleFunc("/v1/places", PlacesHandler).Methods("GET")          // All data
	r.HandleFunc("/v1/desk_groups", DeskGroupsHandler).Methods("GET") // All data
	r.HandleFunc("/v1/desks", DesksHandler).Methods("GET")            // All data

	r.HandleFunc("/healthz", HealthzHandler).Methods("GET")
	r.HandleFunc("/statusz", StatuszHandler).Methods("GET")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./static/")))
	return r
}

func respond(w http.ResponseWriter, name string, data interface{}) {
	resp, err := json.Marshal(map[string]interface{}{name: data})
	if err != nil {
		panic("Error converting to JSON")
	}
	w.Write(resp)
}

func MapsHandler(w http.ResponseWriter, r *http.Request) {
	maps, err := data.Maps()
	if err != nil {
		panic("Error getting maps data")
	}
	respond(w, "maps", maps)
}

func MapHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad map id"}`, http.StatusBadRequest)
		return
	}

	mp, err := data.GetFullMap(id)
	if err != nil {
		panic("Error getting maps data")
	}
	if mp == nil {
		http.Error(w, `{"error": "map not found"}`, http.StatusNotFound)
	}

	resp, err := json.Marshal(map[string]*data.FullMap{"map": mp})
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
	respond(w, "sections", sections)
}

func UsersHandler(w http.ResponseWriter, r *http.Request) {
	users, err := data.Users()
	if err != nil {
		panic("Error getting user data")
	}
	respond(w, "users", users)
}

func NewUserHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var u data.User
	err := decoder.Decode(&u)
	if err != nil {
		http.Error(w, `{"error": "bad user data: `+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	err = data.NewUser(&u)
	if err != nil {
		http.Error(w, `{"error": "error creating user: `+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	respond(w, "user", u)
}

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad user id"}`, http.StatusBadRequest)
		return
	}

	decoder := json.NewDecoder(r.Body)
	var u data.User
	err = decoder.Decode(&u)
	if err != nil {
		http.Error(w, `{"error": "bad user data: `+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	err = data.UpdateUser(id, u)
	if err != nil {
		panic("Error updating user")
	}
	user, err := data.GetUser(id)
	if err != nil {
		panic("Error getting user")
	}
	respond(w, "user", user)
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
	respond(w, "user", user)
}

func DeleteUserHandler(w http.ResponseWriter, r *http.Request) {
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
	err = data.DeleteUser(id)
	if err != nil {
		panic("Error deleting user")
	}
	http.Error(w, "", http.StatusNoContent)
}

func RoomsHandler(w http.ResponseWriter, r *http.Request) {
	rooms, err := data.Rooms()
	if err != nil {
		panic("Error getting rooms data")
	}
	respond(w, "rooms", rooms)
}

func PlacesHandler(w http.ResponseWriter, r *http.Request) {
	places, err := data.Places()
	if err != nil {
		panic("Error getting places data")
	}
	respond(w, "places", places)
}

func DeskGroupsHandler(w http.ResponseWriter, r *http.Request) {
	deskGroups, err := data.DeskGroups()
	if err != nil {
		panic("Error getting desk groups data")
	}
	respond(w, "desk_groups", deskGroups)
}

func DesksHandler(w http.ResponseWriter, r *http.Request) {
	desks, err := data.Desks()
	if err != nil {
		panic("Error getting desks data")
	}
	respond(w, "desk", desks)
}
