package data

import (
	"database/sql"
	"office-mapper/config"
)

type Position struct {
	X int `json:"x"`
	Y int `json:"y"`
	W int `json:"w"`
	H int `json:"h"`
}

type XyPosition struct {
	X int `json:"x"`
	Y int `json:"y"`
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
	Rooms      []Room  `json:"rooms"`
	Places     []Place `json:"places"`
	DeskGroups []FullDeskGroup
}

type User struct {
	Id           int    `json:"id"`
	Name         string `json:"name"`
	DeskId       int    `json:"deskId"`
	Email        string `json:"email"`
	ThumbnailUrl string `json:"thumbnailUrl"`
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
	XyPosition XyPosition `json:"xy_position`
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
	rows, err := config.DB.Query(`SELECT id, name FROM maps`)
	if err != nil {
		return nil, err
	}

	maps := []Map{}
	for rows.Next() {
		m := Map{}
		rows.Scan(&m.Id, &m.Name)
		maps = append(maps, m)
	}

	return maps, nil
}

func GetFullMap(id int) (*FullMap, error) {
	row := config.DB.QueryRow(`SELECT id, name FROM maps WHERE id = ?`, id)

	m := FullMap{}
	err := row.Scan(&m.Id, &m.Name)
	m.Sections = []FullSection{}

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

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

	rows, err = config.DB.Query(`SELECT sections.id, rooms.id, rooms.name, rooms.xpos, rooms.ypos, rooms.width,
  rooms.height, rooms.tv, rooms.phone, rooms.chromecast, rooms.seats FROM sections JOIN rooms ON
  (rooms.section_id = sections.id) WHERE sections.map_id = ?`, id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		r := Room{}
		var s int
		rows.Scan(&s, &r.Id, &r.Name, &r.Position.X, &r.Position.Y, &r.Position.W, &r.Position.H, &r.Features.Tv, &r.Features.Phone, &r.Features.Chromecast, &r.Features.Seats)
		if section, ok := sections[s]; ok {
			section.Rooms = append(section.Rooms, r)
		}
	}

	rows, err = config.DB.Query(`SELECT sections.id, places.id, places.name, places.description, places.xpos,
  places.ypos, places.width, places.height FROM sections JOIN places ON (places.section_id = sections.id)
  WHERE sections.map_id = ?`, id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		p := Place{}
		var s int
		rows.Scan(&s, &p.Id, &p.Name, &p.Description, &p.Position.X, &p.Position.Y, &p.Position.W, &p.Position.H)
		if section, ok := sections[s]; ok {
			section.Places = append(section.Places, p)
		}
	}

	rows, err = config.DB.Query(`SELECT desk_groups.id, desk_groups.name, desk_groups.section_id,
  desk_groups.xpos, desk_groups.ypos FROM sections JOIN desk_groups ON (desk_groups.section_id = sections.id)
  WHERE sections.map_id = ?`, id)
	if err != nil {
		return nil, err
	}

	deskGroups := map[int]*FullDeskGroup{}
	for rows.Next() {
		d := &FullDeskGroup{}
		rows.Scan(&d.Id, &d.Name, &d.SectionId, &d.XyPosition.X, &d.XyPosition.Y)
		d.Desks = []Desk{}
		deskGroups[d.Id] = d
	}

	rows, err = config.DB.Query(`SELECT desks.id, desks.name, desks.desk_group_id, desks.xpos, desks.ypos,
  desks.length, desks.depth, desks.rotation FROM sections JOIN desk_groups ON (desk_groups.section_id =
  sections.id) JOIN desks ON (desks.desk_group_id = desk_groups.id) WHERE sections.map_id = ?`, id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		d := Desk{}
		rows.Scan(&d.Id, &d.Name, &d.DeskGroupId, &d.Position.X, &d.Position.Y, &d.Position.W, &d.Position.H,
			&d.Rotation)
		if deskGroup, ok := deskGroups[d.DeskGroupId]; ok {
			deskGroup.Desks = append(deskGroup.Desks, d)
		}
	}

	for _, d := range deskGroups {
		if section, ok := sections[d.SectionId]; ok {
			section.DeskGroups = append(section.DeskGroups, *d)
		}
	}

	for _, s := range sections {
		m.Sections = append(m.Sections, *s)
	}

	return &m, nil
}

func Sections() ([]Section, error) {
	rows, err := config.DB.Query(`SELECT id, name, map_id, xpos, ypos, width, height FROM sections`)
	if err != nil {
		return nil, err
	}

	sections := []Section{}
	for rows.Next() {
		s := Section{}
		rows.Scan(&s.Id, &s.Name, &s.MapId, &s.Position.X, &s.Position.Y, &s.Position.W, &s.Position.H)
		sections = append(sections, s)
	}

	return sections, nil
}

func Users() ([]User, error) {
	rows, err := config.DB.Query(`SELECT id, name, desk_id, email, thumbnail FROM users`)
	if err != nil {
		return nil, err
	}

	users := []User{}
	for rows.Next() {
		u := User{}
		rows.Scan(&u.Id, &u.Name, &u.DeskId, &u.Email, &u.ThumbnailUrl)
		users = append(users, u)
	}

	return users, nil
}

func GetUser(id int) (*User, error) {
	row := config.DB.QueryRow(`SELECT id, name, desk_id, email, thumbnail FROM users WHERE id = ?`, id)
	u := User{}
	err := row.Scan(&u.Id, &u.Name, &u.DeskId, &u.Email, &u.ThumbnailUrl)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &u, nil
}

func NewUser(u User) (int, error) {
	result, err := config.DB.Exec(`INSERT INTO users (name, desk_id, email, thumbnail, admin) VALUES (?, ?, ?, ?, ?)`,
		u.Name, u.DeskId, u.Email, u.ThumbnailUrl, u.Admin)
	if err != nil {
		return 0, err
	}
	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	return int(id), nil
}

func DeleteUser(id int) error {
	_, err := config.DB.Exec(`DELETE FROM users WHERE id = ?`, id)
	return err
}

func UpdateUser(id int, u User) error {
	_, err := config.DB.Exec(`UPDATE users SET name = ?, desk_id = ?, email = ?, thumbnail = ?, admin = ?  WHERE id = ?`,
		u.Name, u.DeskId, u.Email, u.ThumbnailUrl, u.Admin, id)
	return err
}

func Rooms() ([]Room, error) {
	rows, err := config.DB.Query(`SELECT id, name, section_id, xpos, ypos, width, height, chromecast, phone, tv,
 seats FROM rooms`)
	if err != nil {
		return nil, err
	}

	rooms := []Room{}
	for rows.Next() {
		r := Room{}
		rows.Scan(&r.Id, &r.Name, &r.SectionId, &r.Position.X, &r.Position.Y, &r.Position.W, &r.Position.H, &r.Features.Chromecast, &r.Features.Phone, &r.Features.Tv, &r.Features.Seats)
		rooms = append(rooms, r)
	}

	return rooms, nil
}

func Places() ([]Place, error) {
	rows, err := config.DB.Query(`SELECT id, name, section_id, description, xpos, ypos, width, height FROM places`)
	if err != nil {
		return nil, err
	}

	places := []Place{}
	for rows.Next() {
		p := Place{}
		rows.Scan(&p.Id, &p.Name, &p.SectionId, &p.Description, &p.Position.X, &p.Position.Y, &p.Position.W, &p.Position.H)
		places = append(places, p)
	}

	return places, nil
}
