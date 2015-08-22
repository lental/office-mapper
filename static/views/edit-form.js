var editUserTemplate = _.template("<div class='editUserForm'><form>" +
  "<div class='edit-id'>id: <%= id %> </div>" +
  "<div class='edit-name'>Name: <%= name %> </div>" +
  "<div class='edit-email'>email: <%= email %> </div>" +
  "<div class='edit-deskId'>deskId: <input type='text' name='deskId' value='<%= deskId %>'> </div>" +
  "</form></div>"
  );

var editPositionTemplate = _.template("<div class='editPositionForm'>" +
  "<div class='edit-x'>x: <input type='text' name='x' value='<%= x %>'> </div>" +
  "<div class='edit-y'>y: <input type='text' name='y' value='<%= y %>'> </div>" +
  "<div class='edit-w'>w: <input type='text' name='w' value='<%= w %>'> </div>" +
  "<div class='edit-h'>h: <input type='text' name='h' value='<%= h %>'> </div>" +
  "</div>"
  );

var editFeaturesTemplate = _.template("<div class='editPositionForm'>" +
  "<div class='edit-chromecast'>chromecast: <input type='checkbox' name='chromecast' value='chromecast' <%= chromecast ? 'checked' : '' %>> </div>" +
  "<div class='edit-phone'>phone: <input type='checkbox' name='phone' value='phone' <%= phone ? 'checked' : '' %>> </div>" +
  "<div class='edit-tv'>tv: <input type='checkbox' name='tv' value='tv' <%= tv ? 'checked' : '' %>> </div>" +
  "<div class='edit-seats'>seats: <input type='text' name='seats' value='<%= seats %>'> </div>" +
  "</div>"
  );

var editRoomTemplate = _.template("<div class='editRoomForm'><form>" +
  "<div class='edit-id'>id: <%= id %> </div>" +
  "<div class='edit-name'>Name: <input type='text' name='name' value='<%= name %>'> </div>" +
  "<div class='edit-features'>features: <%= editFeaturesTemplate(features) %> </div>" +
  "<div class='edit-sectionId'>sectionId: <input type='text' name='sectionId' value='<%= sectionId %>'> </div>" +
  "<div class='edit-position'>position: <%= editPositionTemplate(position) %> </div>" +
  "</form></div>"
  );

var editPlaceTemplate = _.template("<div class='editPlaceForm'><form>" +
  "<div class='edit-id'>id: <%= id %> </div>" +
  "<div class='edit-name'>Name: <input type='text' name='name' value='<%= name %>'></div>" +
  "<div class='edit-description'>description: <input type='text' name='description' value='<%= description %>'> </div>" +
  "<div class='edit-sectionId'>sectionId: <input type='text' name='sectionId' value='<%= sectionId %>'> </div>" +
  "<div class='edit-position'>position: <%= editPositionTemplate(position) %> </div>" +
  "</form></div>"
  );

var editSectionTemplate = _.template("<div class='editSectionForm'><form>" +
  "<div class='edit-id'>id: <%= id %> </div>" +
  "<div class='edit-name'>Name: <input type='text' name='name' value='<%= name %>'> </div>" +
  // "<div class='edit-mapId'>mapId: <%= mapId %> </div>" +
  "<div class='edit-position'>position: <%= editPositionTemplate(position) %> </div>" +
  "</form></div>"
  );

var editMapTemplate = _.template("<div class='editMapForm'><form>" +
  "<div class='edit-id'>id: <%= id %> </div>" +
  "<div class='edit-name'>Name: <input type='text' name='name' value='<%= name %>'> </div>" +
  // "<div class='edit-mapId'>mapId: <%= mapId %> </div>" +
  // "<div class='edit-position'>position: <%= editPositionTemplate(position) %> </div>" +
  "</form></div>"
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
    } else if (obj instanceof Room) {
      this.$el.html(editRoomTemplate(obj.attributes));
    } else if (obj instanceof Place) {
      this.$el.html(editPlaceTemplate(obj.attributes));
    } else if (obj instanceof Section) {
      this.$el.html(editSectionTemplate(obj.attributes));
    } else if (obj instanceof  Map) {
      this.$el.html(editMapTemplate(obj.attributes));
    }
    else {
      this.$el.html("");
    }
    return this;
  }
});
var renderEditForm = function() {
  new EditFormView({pageState: pageState});
};