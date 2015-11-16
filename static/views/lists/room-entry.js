
var RoomEntryView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.model, 'change', this.initialRender);
    this.listenTo(listState, 'change:searchQuery', this.render);
    this.listenTo(listState, 'change:filterBy', this.render);
    this.listenTo(pageState, 'change:selectedObject', this.render);
    this.map = maps.getMap(this.model.get('mapId'));
    this.listenTo(this.map, 'change', this.onMapChanged);
    this.initialRender();
    this.render();
  },

  initialRender: function() {
    this.$el.html(this.template({
      room:this.model,
      mapName: this.model.get('mapId') ? maps.getMap(this.model.get('mapId')).get('name') : 'No Assigned Desk'
    }));
  },

  id: function() {return "list_room_" + this.model.attributes.id;},
  tagName: "div",
  className: "listElement roomListElement clickable",

  events: {
    "click": "onRoomClick",
  },

  onRoomClick: function(event) {
    element = event.currentTarget;
    console.log("room " + element.dataset.id + " click");
    pageState.selectObject(this.model);
  },

  onMapChanged: function() {
    this.$(".roomMap").html(this.map.get("name"));
  },

  template: _.template("" +
  "<div class='roomName'><%= room.get('name') %> </div>" +
  "<div class='roomMap'><%= mapName %> </div>" +
  "<div class='roomFeatures'><%= this.featuresTemplate(room.get('features')) %> </div>" +
  ""),

  featuresTemplate: _.template("<table class='featureListTable'>" +
  "<tr class='' id=''><td class='featureListLabel'>chromecast:</td><td><%= chromecast ? '&#10004;' : 'X' %></td>" +
  "<td class='featureListSpacer'></td>" +
  "<td class='featureListLabel'>phone:</td><td><%= phone ? '&#10004;' : 'X' %></td></tr>" +
  "<tr class='' id=''><td class='featureListLabel'>tv:</td><td><%= tv ?  '&#10004;' : 'X'  %></td>" +
  "<td class='featureListSpacer'></td>" +
  "<td class='featureListLabel'>seats:</td><td><%= seats %></td></tr>" +
  "</table>"
  ),

  render: function() {
    var selectedObject = pageState.get('selectedObject');

    var isSelected = this.model == selectedObject;
    var matchesSearchQuery = this.model.searchMatches(listState.get('searchQuery'));
    var satisfiesFilter = listState.satisfiesFilter(this.model);

    var shouldShow = isSelected || (matchesSearchQuery && satisfiesFilter)
    this.$el.toggleClass("displayNone", !shouldShow);
    this.$el.toggleClass("active", isSelected);
    if(isSelected) {
      var element = this.$el;
      if (isChildPartiallyOutsideOfParent(element[0], $("#scrollable-list")[0])) {
        element[0].scrollIntoView();
      }
    }
    return this;
  }
});
var renderRooms = function() {
  new RoomListView({model:rooms, pageState: pageState});
};