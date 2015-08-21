package data

type Map struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
	Url  string `json:"url"`
}

type User struct {
	Id           int    `json:"id"`
	Name         string `json:"string"`
	DeskId       int    `json:"deskId"`
	Email        string `json:"email"`
	ThumbnailUrl string `json:"thumbnailUrl"`
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
