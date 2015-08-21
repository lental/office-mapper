User = Backbone.Model.extend({});
Map = Backbone.Model.extend({});
Section = Backbone.Model.extend({});
Room = Backbone.Model.extend({});
PointOfInterest = Backbone.Model.extend({});
DeskGroup = Backbone.Model.extend({});
Desk = Backbone.Model.extend({});

Users = Backbone.Collection.extend({
    model: User
});

PointsOfInterest = Backbone.Collection.extend({
    model: PointOfInterest
});

Rooms = Backbone.Collection.extend({
    model: Room
});

Maps = Backbone.Collection.extend({
    model: Map
});