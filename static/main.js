var users, plases, rooms, maps, pageState;

gplus = new GPlus();
gplusList = new GPlusUserList();
pageState = new PageState();
listState = new ListState();
$( document ).ready(function(){
    users = new Users();
    users.fetch({success:function(){
      pageState.set("usersLoaded", true);
      if (pageState.get("mapsLoaded")) {
        renderUsers();
      }
    }});

    places = new Places();
    places.fetch({success:function(){
      pageState.set("placesLoaded", true);
      if (pageState.get("mapsLoaded")) {
        renderPlaces();
      }
    }});

    rooms = new Rooms();
    rooms.fetch({success:function(){
      pageState.set("roomsLoaded", true);
      renderRooms();
    }});


    maps = new Maps();
    maps.fetch({success:function(){
      pageState.set("mapsLoaded", true);

      renderMapSelecton();
      firstMap = maps.first();
      pageState.selectMapId(firstMap.get("id"));

      if (pageState.get("usersLoaded")) {
        renderUsers();
      }
      if (pageState.get("placesLoaded")) {
        renderPlaces();
      }

    }});

    connectGPlusView();

    renderPageView(pageState);
    renderLoadingOverlayView();
    renderEditForm();
    renderSearchBar();
    renderListBarSquishView();
    renderEditBarSquishView();
    renderModifiedObjectsView();
});