var roomTemplate = _.template("<div class='listElement roomListElement<%= isSelected ? ' active': '' %>' data-id=<%= id%>>" +
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
    this.hiding = false;
    this.render();
    this.listenTo(pageState, 'change', this.render);
  },

  el: '#rooms-section',

  events: {
    "click .roomListElement": "onRoomClick",
    "click .listBarTitle": "hideShowRooms",
    "mouseenter .listBarTitle"  : "showHideButton",
    "mouseleave .listBarTitle"  : "hideHideButton"
  },

  hideHideButton: function(event) {
    this.$('.listHideButton').removeClass("visible");
  },
  showHideButton: function(event) {
    this.$('.listHideButton').addClass("visible");
  },

  hideShowRooms: function(event) {
    // element = event.currentTarget;
    this.hiding = !this.hiding;
    this.render();
  },

  onRoomClick: function(event) {
    element = event.currentTarget;
    console.log("room " + element.dataset.id + " click");
    pageState.selectObject(rooms.getRoom(element.dataset.id));
  },

  template: _.template("<% rooms.each( function(room) { %>" +
       "<% var isSelected = room == pageState.get('selectedObject') %>" +
       "<% if (isSelected || room.searchMatches(pageState.get('searchQuery'))) { %>" +
       "<% room.attributes.isSelected = isSelected %>" +
       "<%= roomTemplate(room.attributes)%>" +
    "<% }}); %> "),

  render: function() {
    this.$('.listHideButton').html(this.hiding ? "Show" : "Hide");
    this.$('#room-list').toggleClass("hiddenList", this.hiding);
    this.$("#room-list").html(this.template({rooms:this.model}));
    var selectedObject = pageState.get('selectedObject');
    if (selectedObject instanceof Room) {
      this.$('#room-list .listElement[data-id='+selectedObject.get('id')+']')[0].scrollIntoView();
    }
    return this;
  }
});
var renderRooms = function() {
  new RoomListView({model:rooms, pageState: pageState});
};