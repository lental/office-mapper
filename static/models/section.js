Section = Backbone.Model.extend({
  modelType: "Section",
    parse : function (response, options) {
      if (response.section) {
        response = response.section;
      }
        if (places) {
          if (response.deskGroups) {
            response.deskGroups = new DeskGroups(response.deskGroups, {parse: true, allMapDesks: options.allMapDesks});
          }
          if (response.places)
            response.places = places.getSubsetFromJSONArray(response.places);
          else{}
            // response.places = new Places([], {parse: true});
          if (response.rooms)
            response.rooms = rooms.getSubsetFromJSONArray(response.rooms);
          else{}
            // response.rooms = new Rooms([], {parse: true});
        } else {
            console.log("Tried to parse a section without places");
        }
        return response;
    },
  toSimpleString: function() {
    return this.modelType + " " + this.get('id') + ": " + this.get('name');
  }
});

Sections = Backbone.Collection.extend({
    model: Section
});