var roomTemplate = _.template("<div class='roomListElement <%= isSelected ? 'active': '' %>' data-id=<%= id%>>" +
  "<div class='roomName'><%= name %> </div>" +
  "<div class='roomFeatures'><%= roomFeaturesTemplate(features) %> </div>" +
  "</div>"
  );

var roomFeaturesTemplate = _.template("<table class='featureListTable'>" +
  "<tr class='' id=''><td class='featureListLabel'>chromecast:</td><td><%= chromecast ? '&#10004;' : 'X' %></td>" +
  "<td class='featureListSpacer'></td>" +
  "<td class='featureListLabel'>phone:</td><td><%= phone ? '&#10004;' : 'X' %></td></tr>" +
  "<tr class='' id=''><td class='featureListLabel'>tv:</td><td><%= tv ?  '&#10004;' : 'X'  %></td>" +
  "<td class='featureListSpacer'></td>" +
  "<td class='featureListLabel'>seats:</td><td><%= seats %></td></tr>" +
  "</table>"
  );

var RoomListView = Backbone.View.extend({
  initialize: function(){
    this.render();
    this.listenTo(pageState, 'change', this.render);
  },

  el: '#room-list',

  events: {
    "click .roomListElement": "onRoomClick",
    "click .roomListElement": "onRoomClick",
  },

  onRoomClick: function(event) {
    element = event.currentTarget;
    console.log("room " + element.dataset.id + " click");
    pageState.selectObject(rooms.getRoom(element.dataset.id));
  },

  template: _.template("<% rooms.each( function(room) { %>" +
       "<% if (room.searchMatches(pageState.get('searchQuery'))) { %>" +
       "<% room.attributes.isSelected = room == pageState.get('selectedObject') %>" +
       "<%= roomTemplate(room.attributes)%>" +
    "<% }}); %> "),
  render: function() {
    this.$el.html(this.template({rooms:this.model}));
    return this;
  }
});
var renderRooms = function() {
  new RoomListView({model:rooms, pageState: pageState});
};