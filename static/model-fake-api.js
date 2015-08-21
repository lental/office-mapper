var users = new Users();
users.fetch({success:function(){
    renderUsers();
  }});

var places = new Places();
places.fetch({success:function(){
    renderPlaces();
  }});

var rooms = new Rooms();
rooms.fetch({success:function(){
    renderRooms();
  }});

var maps = new Maps();
maps.fetch({success:function(){
  firstMap = maps.findWhere({"id":0});
  firstMap.url = firstMap.get("url");
  firstMap.fetch({success:function(){
    onMapsReady();
  }});
}});
