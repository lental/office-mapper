User = Backbone.Model.extend({});

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

Room = Backbone.Model.extend({});

Place = Backbone.Model.extend({});

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
        return response.places;
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
      selectedObject: null
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
    }
});