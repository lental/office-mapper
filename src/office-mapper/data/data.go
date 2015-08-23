package data

import (
	"encoding/json"
	"errors"
	"github.com/gorilla/mux"
	"io"
	"net/http"
	"office-mapper/config"
	"strconv"
)

type Position struct {
	X int `json:"x" sql:"xpos"`
	Y int `json:"y" sql:"ypos"`
	W int `json:"w" sql:"width"`
	H int `json:"h" sql:"height"`
}

type XyPosition struct {
	X int `json:"x" sql:"xpos"`
	Y int `json:"y" sql:"ypos"`
}

type Map struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type FullMap struct {
	Map
	Sections []FullSection `json:"sections"`
}

type Section struct {
	Id       int      `json:"id"`
	MapId    int      `json:"map_id"`
	Name     string   `json:"name"`
	Position Position `json:"position"`
}

type FullSection struct {
	Section
	Rooms      []Room          `json:"rooms"`
	Places     []Place         `json:"places"`
	DeskGroups []FullDeskGroup `json:"deskGroups"`
}

type User struct {
	Id           int    `json:"id"`
	Name         string `json:"name"`
	DeskId       int    `json:"deskId"`
	Email        string `json:"email"`
	ThumbnailUrl string `json:"thumbnailUrl"`
	GplusId      string `json:"gplusId"`
	Admin        bool   `json:"admin"`
}

type Features struct {
	Chromecast bool `json:"chromecast"`
	Phone      bool `json:"phone"`
	Tv         bool `json:"tv"`
	Seats      int  `json:"seats"`
}

type Room struct {
	Id        int      `json:"id"`
	Name      string   `json:"name"`
	SectionId int      `json:"sectionId"`
	Position  Position `json:"position"`
	Features  Features `json:"features"`
}

type Place struct {
	Id          int      `json:"id"`
	Name        string   `json:"name"`
	SectionId   int      `json:"sectionId"`
	Description string   `json:"description"`
	Position    Position `json:"position"`
}

type DeskGroup struct {
	Id         int        `json:"id"`
	Name       *string    `json:"name"`
	SectionId  int        `json:"sectionId"`
	XyPosition XyPosition `json:"xyPosition"`
}

type FullDeskGroup struct {
	DeskGroup
	Desks []Desk `json:"desks"`
}

type Desk struct {
	Id          int      `json:"id"`
	Name        *string  `json:"name"`
	DeskGroupId int      `json:"deskGroupId"`
	Position    Position `json:"position"`
	Rotation    int      `json:"rotation"`
}

func Maps() ([]Map, error) {
	maps := []Map{}
	err := loadAll(&maps)
	if err != nil {
		return nil, err
	}

	return maps, nil
}

func GetFullMap(id int) (*FullMap, error) {
	m := &FullMap{}
	err := loadOne(id, &m)
	if err != nil {
		return nil, err
	}
	if m == nil {
		return nil, nil
	}

	m.Sections = []FullSection{}

	rows, err := config.DB.Query(`SELECT id, name, xpos, ypos, width, height FROM sections WHERE map_id = ?`, id)
	if err != nil {
		return nil, err
	}

	sections := map[int]*FullSection{}

	for rows.Next() {
		s := FullSection{}
		rows.Scan(&s.Id, &s.Name, &s.Position.X, &s.Position.Y, &s.Position.W, &s.Position.H)
		s.Rooms = []Room{}
		s.Places = []Place{}
		s.DeskGroups = []FullDeskGroup{}
		s.MapId = id
		sections[s.Id] = &s
	}

	rooms := []*Room{}
	err = loadChain([]string{"sections"}, "map_id", id, &rooms)
	if err != nil {
		return nil, err
	}

	for _, room := range rooms {
		if section, ok := sections[room.SectionId]; ok {
			section.Rooms = append(section.Rooms, *room)
		}
	}

	places := []*Place{}
	err = loadChain([]string{"sections"}, "map_id", id, &places)
	if err != nil {
		return nil, err
	}

	for _, place := range places {
		if section, ok := sections[place.SectionId]; ok {
			section.Places = append(section.Places, *place)
		}
	}

	deskGroups := []*FullDeskGroup{}
	err = loadChain([]string{"sections"}, "map_id", id, &deskGroups)
	if err != nil {
		return nil, err
	}

	deskGroupsMap := map[int]*FullDeskGroup{}
	for _, deskGroup := range deskGroups {
		deskGroupsMap[deskGroup.Id] = deskGroup
	}

	desks := []*Desk{}
	err = loadChain([]string{"desk_groups", "sections"}, "map_id", id, &desks)
	if err != nil {
		return nil, err
	}

	for _, desk := range desks {
		if deskGroup, ok := deskGroupsMap[desk.DeskGroupId]; ok {
			deskGroup.Desks = append(deskGroup.Desks, *desk)
		}
	}

	for _, d := range deskGroupsMap {
		if section, ok := sections[d.SectionId]; ok {
			section.DeskGroups = append(section.DeskGroups, *d)
		}
	}

	for _, s := range sections {
		m.Sections = append(m.Sections, *s)
	}

	return m, nil
}

func DeleteRow(table string, id int) (int64, error) {
	result, err := config.DB.Exec(`DELETE FROM `+table+` WHERE id = ?`, id)
	if err != nil {
		return 0, err
	}
	return result.RowsAffected()
}

func Sections() ([]Section, error) {
	var sections []Section
	err := loadAll(&sections)
	if err != nil {
		return nil, err
	}

	return sections, nil
}

func GetSection(id int) (*Section, error) {
	section := &Section{}
	err := loadOne(id, &section)
	if err != nil {
		return nil, err
	}
	return section, nil
}

func Users() ([]User, error) {
	var users []User
	err := loadAll(&users)
	if err != nil {
		return nil, err
	}

	return users, nil
}

func GetUser(id int) (*User, error) {
	user := &User{}
	err := loadOne(id, &user)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func InsertFromJson(body io.Reader, obj interface{}) error {
	decoder := json.NewDecoder(body)
	err := decoder.Decode(&obj)
	if err != nil {
		return errors.New("bad JSON data: " + err.Error())
	}

	return insertOne(obj)
}

func UpdateRowFromJson(w http.ResponseWriter, r *http.Request, obj interface{}) bool {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error": "bad object id"}`, http.StatusBadRequest)
		return false
	}

	decoder := json.NewDecoder(r.Body)
	updateData := map[string]interface{}{}
	err = decoder.Decode(&updateData)
	if err != nil {
		http.Error(w, `{"error": "Error parsing JSON: `+err.Error()+`"}`, http.StatusBadRequest)
		return false
	}

	err = updateOne(id, updateData, obj)
	if err != nil {
		http.Error(w, `{"error": "error updating object"}`, http.StatusBadRequest)
		return false
	}
	if isNil(obj) {
		http.Error(w, `{"error": "object not found"}`, http.StatusNotFound)
		return false
	}
	return true
}

func NewUser(u *User) error {
	err := insertOne(u)
	return err
}

func Rooms() ([]Room, error) {
	rooms := []Room{}
	err := loadAll(&rooms)
	if err != nil {
		return nil, err
	}

	return rooms, nil
}

func GetRoom(id int) (*Room, error) {
	room := &Room{}
	err := loadOne(id, &room)
	if err != nil {
		return nil, err
	}
	return room, nil
}

func Places() ([]Place, error) {
	places := []Place{}
	err := loadAll(&places)
	if err != nil {
		return nil, err
	}

	return places, nil
}

func GetPlace(id int) (*Place, error) {
	place := &Place{}
	err := loadOne(id, &place)
	if err != nil {
		return nil, err
	}
	return place, nil
}

func DeskGroups() ([]DeskGroup, error) {
	deskGroups := []DeskGroup{}
	err := loadAll(&deskGroups)
	if err != nil {
		return nil, err
	}
	return deskGroups, nil
}

func GetDeskGroup(id int) (*DeskGroup, error) {
	deskGroup := &DeskGroup{}
	err := loadOne(id, &deskGroup)
	if err != nil {
		return nil, err
	}
	return deskGroup, nil
}

func Desks() ([]Desk, error) {
	desks := []Desk{}
	err := loadAll(&desks)
	if err != nil {
		return nil, err
	}
	return desks, nil
}

func GetDesk(id int) (*Desk, error) {
	desk := &Desk{}
	err := loadOne(id, &desk)
	if err != nil {
		return nil, err
	}
	return desk, nil
}
