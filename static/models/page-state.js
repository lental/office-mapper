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
      mapSelectionClick:false,

      modifiedObjects: new ModifiedObjects()
    },
    modelType: "PageState",
    isDataModelLoaded: function() {
        return this.get('gplusLoaded') &&
               this.get('placesLoaded') &&
               this.get('roomsLoaded') && this.get('usersLoaded') && this.get('mapsLoaded');
    },
    selectObject: function(obj) {
        if(obj instanceof User) {
            console.log("User selected");
            this.selectMapId(obj.get('mapId'));
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
        if(selectedMap) {
          if(!selectedMap.isFullyLoaded()) {
              console.log("map not loaded. fetching..");
              this.set("currentMapLoaded", false);
              selectedMap.url = "/v1/maps/" + mapId;
              selectedMap.fetch({success:_.bind(function(){
                this.set("currentMapLoaded", true);
              },this)});
          }

          this.set({currentMapId: mapId});

          // update URL without refreshing page
          if(window.history && window.history.pushState) {
            window.history.pushState(window.history.state, "", "?map=" + mapId);
          }
        }
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
        this.get("modifiedObjects").add(this.get("selectedObject"));
        this.trigger('change', this);
    },
    setDeskOnUserSelectedObject: function(deskId,errorCallback) {
      if (this.get("selectedObject") instanceof User) {
        $.get( "v1/desks/" + deskId, _.bind(function( data ) {
          console.log(JSON.stringify(data));
          data = JSON.parse(data);
          var occupant = users.getUserByDeskId(data.desk.id);
          if(occupant != null ){
            console.log("Error: This desk is already occupied by " + occupant.get('name') + ". Please select another desk");
            errorCallback(occupant);
            return;
          }
          this.get("modifiedObjects").add(this.get("selectedObject"));

          var markChangeInDesk = function(deskId, mapId) {;
            var nextMap = maps.findWhere({"id":mapId});
            if (nextMap.isFullyLoaded()) {
              var oldDesk = nextMap.get('allMapDesks').findWhere({id:deskId})
              oldDesk.trigger('change',oldDesk);
            }
          }
          var selectedObject = this.get("selectedObject");
          var oldDeskId = selectedObject.get("deskId");
          var oldMapId= selectedObject.get("mapId");

          selectedObject.set("deskId", data.desk.id);
          selectedObject.set("mapId", data.desk.mapId)
          this.selectMapId(data.desk.mapId);

          markChangeInDesk(oldDeskId, oldMapId);
          markChangeInDesk(data.desk.id, data.desk.mapId);

          this.trigger('change', this);
        },this));
      }
    }
});