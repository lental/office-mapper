package data

type Map struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
	Url  string `json:"url"`
}

func Maps() ([]Map, error) {
	mapsData := []Map{
		{Id: 0, Name: "Santa Clara", Url: "json/map-sc.json"},
		{Id: 1, Name: "Guadalajara", Url: "json/map-gdl.json"},
		{Id: 2, Name: "London", Url: "json/mapld.json"},
		{Id: 3, Name: "Stockholm", Url: "json/map-sthm.json"}}

	return mapsData, nil
}
