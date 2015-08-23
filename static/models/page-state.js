PageState =  Backbone.Model.extend({
    defaults: {
      currentMapId: 0,
      selectedObject: null,
      searchQuery: '',

      currentMapLoaded:false,
      mapsLoaded:false,
      usersLoaded:false,
      roomsLoaded:false,
      placesLoaded:false,
      gplusLoaded:false,

    },
    isDataModelLoaded: function() {
        return this.get('gplusLoaded') &&
               this.get('placesLoaded') &&
               this.get('roomsLoaded') && this.get('usersLoaded') && this.get('mapsLoaded');
    },
    selectObject: function(obj) {
        if(obj instanceof User) {
            console.log("User selected");
        } else if(obj instanceof Room) {
            console.log("Room selected");
        } else if(obj instanceof Place) {
            console.log("Place selected");
        } else {
            console.log("something else selected");
        }
        this.set({selectedObject: obj});
    },
    selectMapId: function(mapId) {
        console.log("map selected: " + mapId);
        //If mapId == currentMapId, don't clear selectedObject

        var selectedMap = maps.get(mapId)
        if(!selectedMap.isFullyLoaded()) {
            console.log("map not loaded. fetching..");
            this.set("currentMapLoaded", false);
            selectedMap.url = "/v1/maps/" + mapId;
            selectedMap.fetch({success:_.bind(function(){
              this.set("currentMapLoaded", true);
            },this)});
        }
        
        this.set({currentMapId: mapId});
    },
    getCurrentMap: function(){
        return maps.get(this.get("currentMapId"));
    },
    changeSearch: function(search) {
        console.log("searchChanged: " + search);
        this.set({searchQuery: search});
    },
    setOnSelectedObject: function(key, val) {
        this.get("selectedObject").set(key, val);
        this.trigger('change', this);
    }
});