var formWrappingTemplate = _.template("<form>" +
  "<table class='<%= divName %>'><%= innerForm %></table>" +
  "<button id='save'>Save</button>" +
  "</form>"
  )

var editUserTemplate = _.template("" +
  "<tr class='formRow' id='edit-id'><td class='inputLabel'>id:</td><td class='inputField'><%= id %></td></tr>" +
  "<tr class='formRow' id='edit-name'><td class='inputLabel'>Name:</td><td class='inputField'><%= name %></td></tr>" +
  "<tr class='formRow' id='edit-email'><td class='inputLabel'>email:</td><td class='inputField'><%= email %></td></tr>" +
  "<tr class='formRow' id='edit-deskId'><td class='inputLabel'>deskId:</td><td class='inputField'><input type='text' name='deskId' value='<%= deskId %>'></td></tr>"
  );

var editPositionTemplate = _.template("<table class='editPositionForm'>" +
  "<tr class='' id='edit-x'><td class='positionInputLabel'>x:</td><td class='positionInputField'><input type='text' name='x' value='<%= x %>'></td></tr>" +
  "<tr class='' id='edit-y'><td class='positionInputLabel'>y:</td><td class='positionInputField'><input type='text' name='y' value='<%= y %>'></td></tr>" +
  "<tr class='' id='edit-w'><td class='positionInputLabel'>w:</td><td class='positionInputField'><input type='text' name='w' value='<%= w%>'></td></tr>" +
  "<tr class='' id='edit-h'><td class='positionInputLabel'>h:</td><td class='positionInputField'><input type='text' name='h' value='<%= h %>'></td></tr>" +
  "</table>"
  );

var editFeaturesTemplate = _.template("<table class='editFeatureForm'>" +
  "<tr class='' id='edit-chromecast'><td class='featureInputLabel'>chromecast:</td><td class='featureInputField'><input type='checkbox' name='chromecast' value='chromecast' <%= chromecast ? 'checked' : '' %>></td></tr>" +
  "<tr class='' id='edit-phone'><td class='featureInputLabel'>phone:</td><td class='featureInputField'><input type='checkbox' name='phone' value='phone' <%= phone ? 'checked' : '' %>></td></tr>" +
  "<tr class='' id='edit-tv'><td class='featureInputLabel'>tv:</td><td class='featureInputField'><input type='checkbox' name='tv' value='tv' <%= tv ? 'checked' : '' %>></td></tr>" +
  "<tr class='' id='edit-seats'><td class='featureInputLabel'>seats:</td><td class='featureInputField'><input type='text' name='seats' maxlength=3 value='<%= seats %>'></td></tr>" +
  "</table>"
  );

var editRoomTemplate = _.template("" +
  "<tr class='formRow' id='edit-id'><td class='inputLabel'>id:</td><td class='inputField'><%= id %></td></tr>" +
  "<tr class='formRow' id='edit-name'><td class='inputLabel'>Name:</td><td class='inputField'><input type='text' name='name' value='<%= name %>'></td></tr>" +
  "<tr class='formRow' id='edit-features'><td class='inputLabel'>features:</td><td class='inputField'><%= editFeaturesTemplate(features) %></td></tr>" +
  "<tr class='formRow' id='edit-sectionId'><td class='inputLabel'>sectionId:</td><td class='inputField'><input type='text' name='sectionId' value='<%= sectionId %>'></td></tr>" +
  "<tr class='formRow' id='edit-position'><td class='inputLabel'>position:</td><td class='inputField'><%= editPositionTemplate(position) %></td></tr>"
  );

var editPlaceTemplate = _.template("" +
  "<tr class='formRow' id='edit-id'><td class='inputLabel'>id:</td><td class='inputField'><%= id %></td></tr>" +
  "<tr class='formRow' id='edit-name'>Name:<td class='inputLabel'></td><td class='inputField'><input type='text' name='name' value='<%= name %>'></td></tr>" +
  "<tr class='formRow' id='edit-description'><td class='inputLabel'>description:</td><td class='inputField'><input type='text' name='description' value='<%= description %>'></td></tr>" +
  "<tr class='formRow' id='edit-sectionId'><td class='inputLabel'>sectionId:</td><td class='inputField'><input type='text' name='sectionId' value='<%= sectionId %>'></td></tr>" +
  "<tr class='formRow' id='edit-position'><td class='inputLabel'>position:</td><td class='inputField'><%= editPositionTemplate(position) %></td></tr>"
  );

var editSectionTemplate = _.template("" +
  "<tr class='formRow' id='edit-id'><td class='inputLabel'>id:</td><td class='inputField'><%= id %></td></tr>" +
  "<tr class='formRow' id='edit-name'><td class='inputLabel'>Name:</td><td class='inputField'><input type='text' name='name' value='<%= name %>'></td></tr>" +
  // "<tr class='formRow' id='edit-mapId'>mapId: <%= mapId %> </tr>" +
  "<tr class='formRow' id='edit-position'><td class='inputLabel'>position:</td><td class='inputField'><%= editPositionTemplate(position) %></td></tr>"
  );

var editMapTemplate = _.template(""+
  "<tr class='formRow' id='edit-id'><td class='inputLabel'>id:</td><td class='inputField'><%= id %></td></tr>" +
  "<tr class='formRow' id='edit-name'><td class='inputLabel'>Name:</td><td class='inputField'><input type='text' name='name' value='<%= name %>'></td></tr>"
  // "<div class='' id='edit-mapId'>mapId: <%= mapId %> </div>" +
  // "<div class='' id='edit-position'>position: <%= editPositionTemplate(position) %> </div>" +
  );


var EditFormView= Backbone.View.extend({
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
      this.$el.html(formWrappingTemplate({divName:'editUserForm', innerForm:editUserTemplate(obj.attributes)}));
    } else if (obj instanceof Room) {
      this.$el.html(formWrappingTemplate({divName:'editRoomForm', innerForm:editRoomTemplate(obj.attributes)}));
    } else if (obj instanceof Place) {
      this.$el.html(formWrappingTemplate({divName:'editPlaceForm', innerForm:editPlaceTemplate(obj.attributes)}));
    } else if (obj instanceof Section) {
      this.$el.html(formWrappingTemplate({divName:'editSectionForm', innerForm:editSectionTemplate(obj.attributes)}));
    } else if (obj instanceof  Map) {
      this.$el.html(formWrappingTemplate({divName:'editMapForm', innerForm:editMapTemplate(obj.attributes)}));
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