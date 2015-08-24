package data

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gorilla/mux"
	"io"
	"net/http"
	"office-mapper/config"
	"office-mapper/oauth"
	"strconv"
	"strings"
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
	DeskId       *int   `json:"deskId"`
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
	Color       *string  `json:"color"`
}

type Place struct {
	Id          int      `json:"id"`
	Name        string   `json:"name"`
	SectionId   int      `json:"sectionId"`
	Description string   `json:"description"`
	Position    Position `json:"position"`
	Color       *string  `json:"color"`
}

type DeskGroup struct {
	Id         int        `json:"id"`
	Name       *string    `json:"name"`
	SectionId  int        `json:"sectionId"`
	XyPosition XyPosition `json:"xyPosition"`
	Rotation   int        `json:"rotation"`
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

func Users() ([]map[string]interface{}, error) {
	var users []User
	err := loadAll(&users)
	if err != nil {
		return nil, err
	}

	userMap := []map[string]interface{}{}
	for _, u := range users {
		userMap = append(userMap, structToMap(u))
	}
	addMapId(userMap, []string{"users", "desks", "desk_groups", "sections"})
	return userMap, nil
}

func GetUser(id int) (map[string]interface{}, error) {
	user := &User{}
	err := loadOne(id, &user)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, nil
	}
	userMap := structToMap(user)
	addMapId([]map[string]interface{}{userMap}, []string{"users", "desks", "desk_groups", "sections"})
	return userMap, nil
}

func GetUserByToken(token string) (map[string]interface{}, error) {
	gplusId, err := oauth.GetMe(token)
	if err != nil {
		return nil, errors.New("error getting user from Google: " + err.Error())
	}

	user, err := GetUserByGplusId(gplusId)
	if err != nil {
		panic("Error getting user data")
	}
	return user, nil
}

func GetUserByGplusId(id string) (map[string]interface{}, error) {
	user := &User{}
	err := loadOneBy(id, "gplus_id", &user)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, nil
	}
	userMap := structToMap(user)
	addMapId([]map[string]interface{}{userMap}, []string{"users", "desks", "desk_groups", "sections"})
	return userMap, nil
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

func Rooms() ([]map[string]interface{}, error) {
	rooms := []Room{}
	err := loadAll(&rooms)
	if err != nil {
		return nil, err
	}

	roomMap := []map[string]interface{}{}
	for _, r := range rooms {
		roomMap = append(roomMap, structToMap(r))
	}
	addMapId(roomMap, []string{"rooms", "sections"})
	return roomMap, nil
}

func GetRoom(id int) (map[string]interface{}, error) {
	room := &Room{}
	err := loadOne(id, &room)
	if err != nil {
		return nil, err
	}
	if room == nil {
		return nil, nil
	}
	roomMap := structToMap(room)
	addMapId([]map[string]interface{}{roomMap}, []string{"rooms", "sections"})
	return roomMap, nil
}

func Places() ([]map[string]interface{}, error) {
	places := []Place{}
	err := loadAll(&places)
	if err != nil {
		return nil, err
	}

	placeMap := []map[string]interface{}{}
	for _, r := range places {
		placeMap = append(placeMap, structToMap(r))
	}
	addMapId(placeMap, []string{"places", "sections"})
	return placeMap, nil
}

func GetPlace(id int) (map[string]interface{}, error) {
	place := &Place{}
	err := loadOne(id, &place)
	if err != nil {
		return nil, err
	}
	if place == nil {
		return nil, nil
	}
	placeMap := structToMap(place)
	addMapId([]map[string]interface{}{placeMap}, []string{"places", "sections"})
	return placeMap, nil
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

func Desks() ([]map[string]interface{}, error) {
	desks := []Desk{}
	err := loadAll(&desks)
	if err != nil {
		return nil, err
	}

	deskMap := []map[string]interface{}{}
	for _, r := range desks {
		deskMap = append(deskMap, structToMap(r))
	}
	addMapId(deskMap, []string{"desks", "desk_groups", "sections"})
	return deskMap, nil
}

func GetDesk(id int) (map[string]interface{}, error) {
	desk := &Desk{}
	err := loadOne(id, &desk)
	if err != nil {
		return nil, err
	}
	if desk == nil {
		return nil, nil
	}
	deskMap := structToMap(desk)
	addMapId([]map[string]interface{}{deskMap}, []string{"desks", "desk_groups", "sections"})
	return deskMap, nil
}

type BatchUser struct {
	PrimaryEmail      string `json:"primaryEmail"`
	ThumbnailPhotoUrl string `json:"thumbnailPhotoUrl"`
	Id                string `json:"id"`
	Name              struct {
		GivenName  string `json:"givenName"`
		FamilyName string `json:"familyName"`
		FullName   string `json:"fullName"`
	} `json:"name"`
}

func validateBatchUser(user BatchUser) string {
	if len(user.Id) != 21 {
		return "id isn't 21 digits"
	}

	if user.PrimaryEmail == "" {
		return "Missing primaryEmail"
	}

	if user.Name.FullName == "" {
		return "Missing fullName"
	}

	return ""
}

func BatchLoadUsers(userData []BatchUser) error {
	var errorStrings = []string{}

	for i, user := range userData {
		if err := validateBatchUser(user); err != "" {
			errorStrings = append(errorStrings, fmt.Sprintf("Bad user at position %d: %v", i, err))
		}
	}

	if len(errorStrings) > 0 {
		return errors.New(strings.Join(errorStrings, "; "))
	}

	tx, err := config.DB.Begin()
	if err != nil {
		return err
	}

	var validGplusIds = []string{}
	stmt, err := tx.Prepare(`INSERT INTO users (name, email, thumbnail_url, gplus_id) VALUES (?, ?, ?, ?) ON
  DUPLICATE KEY UPDATE name=VALUES(name), email=VALUES(email), thumbnail_url=VALUES(thumbnail_url)`)
	if err != nil {
		tx.Rollback()
		return err
	}

	for _, user := range userData {
		_, err := stmt.Exec(user.Name.FullName, user.PrimaryEmail, user.ThumbnailPhotoUrl, user.Id)
		if err != nil {
			stmt.Close()
			tx.Rollback()
			return err
		}
		validGplusIds = append(validGplusIds, user.Id)
	}

	tx.Exec(`DELETE FROM users WHERE gplus_id NOT IN (` + strings.Join(validGplusIds, ",") + `)`)

	stmt.Close()
	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}
