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
        response.desk_groups = new DeskGroups(response.desk_groups, {parse: true});
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

PointOfInterest = Backbone.Model.extend({});

Users = Backbone.Collection.extend({
    model: User,
    parse : function(response){
        return response.users;  
    }
});

PointsOfInterest = Backbone.Collection.extend({
    model: PointOfInterest,
    parse : function(response){
        return response.points_of_interest;  
    }
});

Rooms = Backbone.Collection.extend({
    model: Room,
    parse : function(response){
        return response.rooms;  
    }
});

Maps = Backbone.Collection.extend({
    model: Map,
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