package handlers

import (
	"encoding/json"
	"github.com/gorilla/mux"
	_ "github.com/ziutek/mymysql/godrv"
	"net/http"
	"net/url"
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
	r.HandleFunc("/v1/maps", NewMapHandler).Methods("POST")
	r.HandleFunc("/v1/maps/{id}", MapHandler).Methods("GET")
	r.HandleFunc("/v1/maps/{id}", DeleteMapHandler).Methods("DELETE")
	r.HandleFunc("/v1/maps/{id}", UpdateMapHandler).Methods("PUT")
	r.HandleFunc("/v1/maps/{id}", UpdateMapHandler).Methods("PATCH")
	r.HandleFunc("/v1/sections", SectionsHandler).Methods("GET") // Sparse
	r.HandleFunc("/v1/sections", NewSectionHandler).Methods("POST")
	r.HandleFunc("/v1/sections/{id}", SectionHandler).Methods("GET")
	r.HandleFunc("/v1/sections/{id}", DeleteSectionHandler).Methods("DELETE")
	r.HandleFunc("/v1/sections/{id}", UpdateSectionHandler).Methods("PUT")
	r.HandleFunc("/v1/sections/{id}", UpdateSectionHandler).Methods("PATCH")
	r.HandleFunc("/v1/users", UsersHandler).Methods("GET") // All data
	r.HandleFunc("/v1/users", NewUserHandler).Methods("POST")
	r.HandleFunc("/v1/users/{id}", UserHandler).Methods("GET")
	r.HandleFunc("/v1/users/{id}", DeleteUserHandler).Methods("DELETE")
	r.HandleFunc("/v1/users/{id}", UpdateUserHandler).Methods("PUT")
	r.HandleFunc("/v1/users/{id}", UpdateUserHandler).Methods("PATCH")
	r.HandleFunc("/v1/rooms", RoomsHandler).Methods("GET") // All data
	r.HandleFunc("/v1/rooms", NewRoomHandler).Methods("POST")
	r.HandleFunc("/v1/rooms/{id}", RoomHandler).Methods("GET")
	r.HandleFunc("/v1/rooms/{id}", DeleteRoomHandler).Methods("DELETE")
	r.HandleFunc("/v1/rooms/{id}", UpdateRoomHandler).Methods("PUT")
	r.HandleFunc("/v1/rooms/{id}", UpdateRoomHandler).Methods("PATCH")
	r.HandleFunc("/v1/places", PlacesHandler).Methods("GET") // All data
	r.HandleFunc("/v1/places", NewPlaceHandler).Methods("POST")
	r.HandleFunc("/v1/places/{id}", PlaceHandler).Methods("GET")
	r.HandleFunc("/v1/places/{id}", DeletePlaceHandler).Methods("DELETE")
	r.HandleFunc("/v1/places/{id}", UpdatePlaceHandler).Methods("PUT")
	r.HandleFunc("/v1/places/{id}", UpdatePlaceHandler).Methods("PATCH")
	r.HandleFunc("/v1/desk_groups", DeskGroupsHandler).Methods("GET") // All data
	r.HandleFunc("/v1/desk_groups", NewDeskGroupHandler).Methods("POST")
	r.HandleFunc("/v1/desk_groups/{id}", DeskGroupHandler).Methods("GET")
	r.HandleFunc("/v1/desk_groups/{id}", DeleteDeskGroupHandler).Methods("DELETE")
	r.HandleFunc("/v1/desk_groups/{id}", UpdateDeskGroupHandler).Methods("PUT")
	r.HandleFunc("/v1/desk_groups/{id}", UpdateDeskGroupHandler).Methods("PATCH")
	r.HandleFunc("/v1/desks", DesksHandler).Methods("GET") // All data
	r.HandleFunc("/v1/desks", NewDeskHandler).Methods("POST")
	r.HandleFunc("/v1/desks/{id}", DeskHandler).Methods("GET")
	r.HandleFunc("/v1/desks/{id}", DeleteDeskHandler).Methods("DELETE")
	r.HandleFunc("/v1/desks/{id}", UpdateDeskHandler).Methods("PUT")
	r.HandleFunc("/v1/desks/{id}", UpdateDeskHandler).Methods("PATCH")

	// Batch data routes
	r.HandleFunc("/v1/batch/gplus_users", BatchUsersHandler).Methods("PUT")

	r.HandleFunc("/healthz", HealthzHandler).Methods("GET")
	r.HandleFunc("/statusz", StatuszHandler).Methods("GET")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./static/")))
	return r
}

func getIdToken(w http.ResponseWriter, r *http.Request) string {
	params, err := url.ParseQuery(r.URL.RawQuery)
	if err != nil {
		http.Error(w, `{"error": "Error parsing query params: `+err.Error()+`"}`, http.StatusBadRequest)
		return ""
	}
	id_tokens := params["id_token"]
	if len(id_tokens) < 1 {
		http.Error(w, `{"error": "No id_token provided"}`, http.StatusBadRequest)
		return ""
	}
	return id_tokens[0]
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

func NewMapHandler(w http.ResponseWriter, r *http.Request) {
	var m data.Map

	err := data.InsertFromJson(r.Body, &m)
	if err != nil {
		http.Error(w, `{"error": "error creating map: `+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	respond(w, "map", m)
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
		panic("Error getting maps data " + err.Error())
	}
	if mp == nil {
		http.Error(w, `{"error": "map not found"}`, http.StatusNotFound)
		return
	}

	resp, err := json.Marshal(map[string]*data.FullMap{"map": mp})
	if err != nil {
		panic("Error converting to JSON")
	}
	w.Write(resp)
}

func DeleteMapHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad map id"}`, http.StatusBadRequest)
		return
	}

	rowsAffected, err := data.DeleteRow("maps", id)
	if err != nil {
		panic("Error deleting map")
	}
	if rowsAffected == 0 {
		http.Error(w, `{"error": "map not found"}`, http.StatusNotFound)
		return
	}
	http.Error(w, "", http.StatusNoContent)
}

func UpdateMapHandler(w http.ResponseWriter, r *http.Request) {
	mp := &data.Map{}
	if data.UpdateRowFromJson(w, r, &mp) {
		respond(w, "mp", mp)
	}
}

func SectionsHandler(w http.ResponseWriter, r *http.Request) {
	sections, err := data.Sections()
	if err != nil {
		panic("Error getting sections data")
	}
	respond(w, "sections", sections)
}

func NewSectionHandler(w http.ResponseWriter, r *http.Request) {
	var m data.Section

	err := data.InsertFromJson(r.Body, &m)
	if err != nil {
		http.Error(w, `{"error": "error creating section: `+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	respond(w, "section", m)
}

func SectionHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad section id"}`, http.StatusBadRequest)
		return
	}

	mp, err := data.GetSection(id)
	if err != nil {
		panic("Error getting sections data " + err.Error())
	}
	if mp == nil {
		http.Error(w, `{"error": "section not found"}`, http.StatusNotFound)
		return
	}

	resp, err := json.Marshal(map[string]*data.Section{"section": mp})
	if err != nil {
		panic("Error converting to JSON")
	}
	w.Write(resp)
}

func DeleteSectionHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad section id"}`, http.StatusBadRequest)
		return
	}

	rowsAffected, err := data.DeleteRow("sections", id)
	if err != nil {
		panic("Error deleting section")
	}
	if rowsAffected == 0 {
		http.Error(w, `{"error": "section not found"}`, http.StatusNotFound)
		return
	}
	http.Error(w, "", http.StatusNoContent)
}

func UpdateSectionHandler(w http.ResponseWriter, r *http.Request) {
	mp := &data.Section{}
	if data.UpdateRowFromJson(w, r, &mp) {
		respond(w, "mp", mp)
	}
}

func UsersHandler(w http.ResponseWriter, r *http.Request) {
	users, err := data.Users()
	if err != nil {
		panic("Error getting user data")
	}
	respond(w, "users", users)
}

func NewUserHandler(w http.ResponseWriter, r *http.Request) {
	var u data.User

	err := data.InsertFromJson(r.Body, &u)
	if err != nil {
		http.Error(w, `{"error": "error creating user: `+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	respond(w, "user", u)
}

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	user := &data.User{}
	if data.UpdateRowFromJson(w, r, &user) {
		respond(w, "user", user)
	}
}

func UserHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var user map[string]interface{}
	if vars["id"] == "me" {
		id_token := getIdToken(w, r)
		if id_token == "" {
			return
		}

		var err error
		user, err = data.GetUserByToken(id_token)
		if err != nil {
			http.Error(w, `{"error": "`+err.Error()+`"}`, http.StatusNotFound)
			return
		}
	} else {
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			http.Error(w, `{"error": "bad user id"}`, http.StatusBadRequest)
			return
		}
		user, err = data.GetUser(id)
		if err != nil {
			panic("Error getting user data")
		}
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

	rowsAffected, err := data.DeleteRow("users", id)
	if err != nil {
		panic("Error deleting user")
	}
	if rowsAffected == 0 {
		http.Error(w, `{"error": "user not found"}`, http.StatusNotFound)
		return
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

func NewRoomHandler(w http.ResponseWriter, r *http.Request) {
	var room data.Room

	err := data.InsertFromJson(r.Body, &room)
	if err != nil {
		http.Error(w, `{"error": "error creating room: `+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	respond(w, "room", room)
}

func DeleteRoomHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad room id"}`, http.StatusBadRequest)
		return
	}

	rowsAffected, err := data.DeleteRow("rooms", id)
	if err != nil {
		panic("Error deleting room")
	}
	if rowsAffected == 0 {
		http.Error(w, `{"error": "room not found"}`, http.StatusNotFound)
		return
	}
	http.Error(w, "", http.StatusNoContent)
}

func UpdateRoomHandler(w http.ResponseWriter, r *http.Request) {
	room := &data.Room{}
	if data.UpdateRowFromJson(w, r, &room) {
		respond(w, "room", room)
	}
}

func RoomHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad room id"}`, http.StatusBadRequest)
		return
	}
	room, err := data.GetRoom(id)

	if err != nil {
		panic("Error getting room data")
	}
	if room == nil {
		http.Error(w, `{"error": "room not found"}`, http.StatusNotFound)
		return
	}
	respond(w, "room", room)
}

func PlacesHandler(w http.ResponseWriter, r *http.Request) {
	places, err := data.Places()
	if err != nil {
		panic("Error getting places data")
	}
	respond(w, "places", places)
}

func NewPlaceHandler(w http.ResponseWriter, r *http.Request) {
	var place data.Place

	err := data.InsertFromJson(r.Body, &place)
	if err != nil {
		http.Error(w, `{"error": "error creating place: `+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	respond(w, "place", place)
}

func DeletePlaceHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad place id"}`, http.StatusBadRequest)
		return
	}

	rowsAffected, err := data.DeleteRow("places", id)
	if err != nil {
		panic("Error deleting place")
	}
	if rowsAffected == 0 {
		http.Error(w, `{"error": "place not found"}`, http.StatusNotFound)
		return
	}
	http.Error(w, "", http.StatusNoContent)
}

func UpdatePlaceHandler(w http.ResponseWriter, r *http.Request) {
	place := &data.Place{}
	if data.UpdateRowFromJson(w, r, &place) {
		respond(w, "place", place)
	}
}

func PlaceHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad place id"}`, http.StatusBadRequest)
		return
	}
	place, err := data.GetPlace(id)

	if err != nil {
		panic("Error getting place data")
	}
	if place == nil {
		http.Error(w, `{"error": "place not found"}`, http.StatusNotFound)
		return
	}
	respond(w, "place", place)
}

func DeskGroupsHandler(w http.ResponseWriter, r *http.Request) {
	deskGroups, err := data.DeskGroups()
	if err != nil {
		panic("Error getting desk groups data")
	}
	respond(w, "desk_groups", deskGroups)
}

func NewDeskGroupHandler(w http.ResponseWriter, r *http.Request) {
	var deskGroup data.DeskGroup

	err := data.InsertFromJson(r.Body, &deskGroup)
	if err != nil {
		http.Error(w, `{"error": "error creating deskGroup: `+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	respond(w, "deskGroup", deskGroup)
}

func DeleteDeskGroupHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad deskGroup id"}`, http.StatusBadRequest)
		return
	}

	rowsAffected, err := data.DeleteRow("desk_groups", id)
	if err != nil {
		panic("Error deleting deskGroup")
	}
	if rowsAffected == 0 {
		http.Error(w, `{"error": "deskGroup not found"}`, http.StatusNotFound)
		return
	}
	http.Error(w, "", http.StatusNoContent)
}

func UpdateDeskGroupHandler(w http.ResponseWriter, r *http.Request) {
	deskGroup := &data.DeskGroup{}
	if data.UpdateRowFromJson(w, r, &deskGroup) {
		respond(w, "deskGroup", deskGroup)
	}
}

func DeskGroupHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad deskGroup id"}`, http.StatusBadRequest)
		return
	}
	deskGroup, err := data.GetDeskGroup(id)

	if err != nil {
		panic("Error getting deskGroup data")
	}
	if deskGroup == nil {
		http.Error(w, `{"error": "deskGroup not found"}`, http.StatusNotFound)
		return
	}
	respond(w, "deskGroup", deskGroup)
}

func DesksHandler(w http.ResponseWriter, r *http.Request) {
	desks, err := data.Desks()
	if err != nil {
		panic("Error getting desks data")
	}
	respond(w, "desk", desks)
}

func NewDeskHandler(w http.ResponseWriter, r *http.Request) {
	var desk data.Desk

	err := data.InsertFromJson(r.Body, &desk)
	if err != nil {
		http.Error(w, `{"error": "error creating desk: `+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	respond(w, "desk", desk)
}

func DeleteDeskHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad desk id"}`, http.StatusBadRequest)
		return
	}

	rowsAffected, err := data.DeleteRow("desks", id)
	if err != nil {
		panic("Error deleting desk")
	}
	if rowsAffected == 0 {
		http.Error(w, `{"error": "desk not found"}`, http.StatusNotFound)
		return
	}
	http.Error(w, "", http.StatusNoContent)
}

func UpdateDeskHandler(w http.ResponseWriter, r *http.Request) {
	desk := &data.Desk{}
	if data.UpdateRowFromJson(w, r, &desk) {
		respond(w, "desk", desk)
	}
}

func DeskHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad desk id"}`, http.StatusBadRequest)
		return
	}
	desk, err := data.GetDesk(id)

	if err != nil {
		panic("Error getting desk data")
	}
	if desk == nil {
		http.Error(w, `{"error": "desk not found"}`, http.StatusNotFound)
		return
	}
	respond(w, "desk", desk)
}

func BatchUsersHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	userData := []data.BatchUser{}
	err := decoder.Decode(&userData)
	if err != nil {
		http.Error(w, `{"error": "Error parsing JSON: `+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	err = data.BatchLoadUsers(userData)
	if err != nil {
		http.Error(w, `{"error": "Error updating users: `+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}
	http.Error(w, "", http.StatusNoContent)
}
