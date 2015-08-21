package data

type Position struct {
  X int `json:"x"`
  Y int `json:"y"`
  W int `json:"w"`
  H int `json:"h"`
}

type Map struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
	Url  string `json:"url"`
}

type User struct {
	Id           int    `json:"id"`
	Name         string `json:"name"`
	DeskId       int    `json:"deskId"`
	Email        string `json:"email"`
	ThumbnailUrl string `json:"thumbnailUrl"`
}

type Features struct {
  Chromecast bool `json:"chromecast"`
  Phone bool `json:"phone"`
  Tv bool `json:"tv"`
  Seats int `json:"seats"`
}

type Room struct {
	Id           int    `json:"id"`
	Name         string `json:"name"`
	SectionId    int    `json:"sectionId"`
  Position Position `json:"position"`
  Features Features `json:"features"`
}

type Place struct {
	Id           int    `json:"id"`
	Name         string `json:"name"`
	SectionId    int    `json:"sectionId"`
	Description         string `json:"description"`
  Position Position `json:"position"`
}


func Maps() ([]Map, error) {
	mapsData := []Map{
		{Id: 0, Name: "Santa Clara", Url: "json/map-sc.json"},
		{Id: 1, Name: "Guadalajara", Url: "json/map-gdl.json"},
		{Id: 2, Name: "London", Url: "json/mapld.json"},
		{Id: 3, Name: "Stockholm", Url: "json/map-sthm.json"}}

	return mapsData, nil
}

func Users() ([]User, error) {
	userData := []User{
		{Name: "Michael", Id: 0, DeskId: 0, Email: "michael.len@ooyala.com", ThumbnailUrl: "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABECNn4_9WI4pz-nwEiC3ZjYXJkX3Bob3RvKigwMWJlMmFjZjk2YWFlMzkyODQ1MmZmYzc4OTQ1ZTQ0Y2UzMDM1MWRjMAHNy1tiC-4vJNOiL2aadmRRetRhNw"},
		{Name: "Evan", Id: 1, DeskId: 10, Email: "edanaher@ooyala.com", ThumbnailUrl: "https://plus.google.com/_/focus/photos/public/AIbEiAIAAABECK_gsp7dy8m9rgEiC3ZjYXJkX3Bob3RvKig1NDg4OWY0MGRhMmVhY2JlMWQxYjIzZDhhODEwYmRiYjRlOWY0YTE2MAHOrq89PJK7IN_axRHXyfdI2l9EYw"},
		{Name: "Dustin", Id: 3, DeskId: 1, Email: "dustin@ooyala.com", ThumbnailUrl: "https://plus.google.com/_/focus/photos/private/AIbEiAIAAABDCOflwJPz89jUCiILdmNhcmRfcGhvdG8qKDJiODcxOWU0OWRjYzNkODBlYzQ3OWE0ZjA3ZGZhNmVlYThjMjY1NzQwAVbjtYb5KNg9HaM3FMlxZtTKGtkm"}}

	return userData, nil
}

func Rooms() ([]Room, error) {
  roomData := []Room{
   Room{Name:"Shawshank Redemption", Features:Features{Chromecast:true, Phone:true, Tv:true, Seats:4}, Id:0, SectionId:0, Position:Position{X:10, Y:110, W:20, H:40}},
  Room{Name:"Zamba", Features:Features{Chromecast:true, Phone:true, Tv:true, Seats:4}, Id:1, SectionId:1, Position:Position{X:10, Y:110, W:20, H:40}}}

  return roomData, nil
}

func Places() ([]Place, error) {
  placesData := []Place{
    Place{Name:"Kitchen Area", Description:"We eat here", Id:0, SectionId:0, Position:Position{X:10, Y:10, W:100, H:100}},
  Place{Name:"Electrical Room", Description:"Electricity is here", Id:1, SectionId:0, Position:Position{X:110, Y:10, W:100, H:100}},
  Place{Name:"Bathroom", Description:"baths are here", Id:3, SectionId:1, Position:Position{X:110, Y:110, W:50, H:50}}}

  return placesData, nil
}
