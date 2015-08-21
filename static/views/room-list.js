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

  onRoomClick: function() {
    alert("room click");
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
  new RoomListView({model:rooms, 
    id: 'room-list'});
};