Section = Backbone.Model.extend({
    parse : function (response, options) {
        if (places) {
          response.deskGroups = new DeskGroups(response.deskGroups, {parse: true, allMapDesks: options.allMapDesks});
          if (response.places)
            response.places = places.getSubsetFromJSONArray(response.places);
          else
            response.places = new Places([], {parse: true});
          if (response.rooms)
            response.rooms = rooms.getSubsetFromJSONArray(response.rooms);
          else
            response.rooms = new Rooms([], {parse: true});
        } else {
            console.log("Tried to parse a section without places");
        }
        return response;
    }
});

Sections = Backbone.Collection.extend({
    model: Section
});