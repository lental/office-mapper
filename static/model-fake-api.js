var users, plases, rooms, maps, pageState;

gplus = new GPlus();

$( document ).ready(function(){
    users = new Users();
    users.fetch({success:function(){
        renderUsers();
      }});

    places = new Places();
    places.fetch({success:function(){
        renderPlaces();
      }});

    rooms = new Rooms();
    rooms.fetch({success:function(){
        renderRooms();
      }});

    pageState = new PageState();

    maps = new Maps();
    maps.fetch({success:function(){
      renderMapSelecton();
      firstMap = maps.first();
      pageState.selectMapId(firstMap.get("id"));
      // firstMap.url = "json/map-sc.json"; // Use to get hard-coded map.  should use hard-coded apis in classes-fake-api
      firstMap.url = "/v1/maps/" + firstMap.get("id");
      firstMap.fetch({success:function(){
        renderInitialMap(firstMap);
      }});
    }});

    connectGPlusView();

    renderEditForm();
    renderSearchBar();
    renderListBarSquishView();
    renderEditBarSquishView();
});