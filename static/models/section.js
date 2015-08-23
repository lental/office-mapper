Section = Backbone.Model.extend({
    parse : function (response, options) {
        if (places) {
        response.deskGroups = new DeskGroups(response.deskGroups, {parse: true, allMapDesks: options.allMapDesks});
        response.places = places.getSubsetFromJSONArray(response.places);
        response.rooms = rooms.getSubsetFromJSONArray(response.rooms);
        } else {
            console.log("Tried to parse a section without places");
        }
        return response;
    }
});

Sections = Backbone.Collection.extend({
    model: Section
});