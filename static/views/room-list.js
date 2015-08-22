var roomTemplate = _.template("<div class='roomListElement' data-id=<%= id%>>" +
  "<div class='room-name'>Name: <%= name %> </div>" +
  "<div class='room-features'>Features: <%= JSON.stringify(features) %> </div>" +
  "</div>"
  ); 
                   
var RoomListView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },

  el: '#room-list',

  events: {
    "click .roomListElement": "onRoomClick",
  },

  onRoomClick: function(event) {
    element = event.currentTarget;
    console.log("room " + element.dataset.id + " click");
    pageState.selectObject(rooms.getRoom(element.dataset.id));
  },

  template: _.template("<% rooms.each( function(room) { %> \
       <%= roomTemplate(room.attributes)%> \
        <br /> \
    <% }); %> "),
  render: function() {
    this.$el.html(this.template({rooms:this.model}));
    return this;
  }
});
var renderRooms = function() {
  new RoomListView({model:rooms});
};