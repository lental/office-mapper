var users = new Users();
users.fetch();

var pointsOfInterest = new PointsOfInterest();
pointsOfInterest.fetch();

var rooms = new Rooms();
rooms.fetch();

var maps = new Maps();
maps.fetch({success:function(){
  firstMap = maps.findWhere({"id":0});
  firstMap.url = firstMap.get("url");
  firstMap.fetch({success:function(){
    onMapsReady();
  }});
}});
