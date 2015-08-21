package data

import (
)

type Map struct {
  Id int `json:"id"`
  Name string `json:"name"`
  Url string `json:"url"`
}

func Maps() ([]Map, error) {
  mapsData := []Map{
    Map{Id:0, Name:"Santa Clara", Url:"json/map-sc.json"},
    Map{Id:1, Name:"Guadalajara", Url:"json/map-gdl.json"},
    Map{Id:2, Name:"London", Url:"json/mapld.json"},
    Map{Id:3, Name:"Stockholm", Url:"json/map-sthm.json"}}

  return mapsData, nil
}
