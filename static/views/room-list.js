var RoomListView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(pageState, 'change', this.render);
    this.listenTo(this.model, 'add', this.render);
    this.hiding = false;
    this.initialRender();
    this.render();
  },

  el: '#rooms-section',

  initialRender: function() {
    this.$('#room-list').empty();
    rooms.each( function(room) { 
      roomView = new RoomEntryView({model: room});
        this.$('#room-list').append(roomView.$el);
    });
  },

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

  template: _.template("<% rooms.each( function(room) { %>" +
       "<% var isSelected = room == pageState.get('selectedObject') %>" +
       "<% if (isSelected || room.searchMatches(pageState.get('searchQuery'))) { %>" +
       "<% room.attributes.isSelected = isSelected %>" +
       "<%= roomTemplate(room.attributes)%>" +
    "<% }}); %> "),

  render: function() {
    this.$('.listHideButton').html(this.hiding ? "Show" : "Hide");
    this.$('#room-list').toggleClass("hiddenList", this.hiding);
    return this;
  }
});

var renderRooms = function() {
  new RoomListView({model:rooms, pageState: pageState});
};