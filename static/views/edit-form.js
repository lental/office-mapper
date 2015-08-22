var editUserTemplate = _.template("<div class='position-form'>" +
  "<div class='edit-userId'>userId: <%= id %> </div>" +
  "<div class='edit-name'>Name: <%= name %> </div>" +
  "<div class='edit-email'>email: <%= email %> </div>" +
  "<div class='edit-deskId'>deskId: <%= deskId %> </div>" +
  "</div>"
  ); 
 


var editRoomTemplate = _.template("<div class='position-form'>" +
  "<div class='edit-roomId'>roomId: <%= id %> </div>" +
  "<div class='edit-name'>Name: <%= name %> </div>" +
  "<div class='edit-features'>features: <%= JSON.stringify(features) %> </div>" +
  "<div class='edit-sectionId'>sectionId: <%= sectionId %> </div>" +
  "<div class='edit-position'>position: <%= JSON.stringify(position) %> </div>" +
  "</div>"
  );                   
var EditFormView = Backbone.View.extend({
  initialize: function(){
    this.render();
    this.listenTo(pageState, 'change', this.render);
  },

  el: '#edit-form',

  events: {
    // "click .placeListElement": "onPlaceClick",
  },

  // onPlaceClick: function(event) {
  //   element = event.currentTarget;
  //   console.log("edit " + element.dataset.id + " click");
  // },

  render: function() {
    var obj = pageState.get("selectedObject");
    if(obj instanceof User) {
      this.$el.html(editUserTemplate(obj.attributes));
    }
    else if (obj instanceof Room) {
      this.$el.html(editRoomTemplate(obj.attributes));
    }
    return this;
  }
});
var renderEditForm = function() {
  new EditFormView({pageState: pageState});
};