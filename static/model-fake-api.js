var users, plases, rooms, maps, pageState;
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

    maps = new Maps();
    maps.fetch({success:function(){
      renderMapSelecton();
      firstMap = maps.findWhere({"id":0});
      firstMap.url = firstMap.get("url");
      firstMap.fetch({success:function(){
        onMapsReady();
        renderInitialMap();
      }});
    }});

pageState = new PageState();
});