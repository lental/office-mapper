User = Backbone.Model.extend({
    searchMatches: function(query) {
        if(query == '') {
            return true;
        } else if (this.get("name") && this.get("name").toUpperCase().indexOf(query.toUpperCase()) > -1) {
            return true;
        } else if (this.get("email") && this.get("email").toUpperCase().indexOf(query.toUpperCase()) > -1 ) {
            return true;
        }
        return false;
    }
});

Map = Backbone.Model.extend({
    parse : function (response) {
        // Can come in from either maps:[{}] or map:{}
        if (response.map) {
            response = response.map;
        }
        response.sections = new Sections(response.sections, {parse: true});
        return response;
    }
});

Section = Backbone.Model.extend({
    parse : function (response) {
        response.deskGroups = new DeskGroups(response.deskGroups, {parse: true});
        response.places = new Places(response.places, {parse: true});
        response.rooms = new DeskGroups(response.rooms, {parse: true});
        return response;
    }
});
DeskGroup = Backbone.Model.extend({
    parse : function (response) {
        response.desks =  new Desks(response.desks, {parse: true});
        return response;
    }
});

Desk = Backbone.Model.extend({});

Room = Backbone.Model.extend({
    searchMatches: function(query) {
        if(query == '') {
            return true;
        } else if (this.get("name") && this.get("name").toUpperCase().indexOf(query.toUpperCase()) > -1) {
            return true;
        }
        return false;
    }
});

Place = Backbone.Model.extend({
    searchMatches: function(query) {
        if(query == '') {
            return true;
        } else if (this.get("name") && this.get("name").toUpperCase().indexOf(query.toUpperCase()) > -1) {
            return true;
        }
        return false;
    }
});

Users = Backbone.Collection.extend({
    model: User,
    getUser : function(id) {
        return this.get({"id":id});
    },
    parse : function(response){
        return response.users;
    }
});

Places = Backbone.Collection.extend({
    model: Place,
    getPlace : function(id) {
        return this.get({"id":id});
    },
    parse : function(response){
      //TODO(Dustin): figure out why it's sometimes
      //in an object and sometimes not
      if (response.places)
        return response.places;
      else
        return response;
    }
});

Rooms = Backbone.Collection.extend({
    model: Room,
    getRoom : function(id) {
        return this.get({"id":id});
    },
    parse : function(response){
        return response.rooms;
    }
});

Maps = Backbone.Collection.extend({
    model: Map,
    getMap : function(id) {
        return this.get({"id":id});
    },
    parse : function(response){
        return response.maps;
    }
});

Sections = Backbone.Collection.extend({
    model: Section
});

DeskGroups = Backbone.Collection.extend({
    model: DeskGroup
});

Desks = Backbone.Collection.extend({
    model: Desk
});

PageState =  Backbone.Model.extend({
    defaults: {
      currentMapId: 0,
      selectedObject: null,
      searchQuery: ''
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
        this.set({currentMapId: mapId});
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