DeskGroup = Backbone.Model.extend({
    parse : function (response) {
        response.desks =  new Desks(response.desks, {parse: true});
        return response;
    }
});

DeskGroups = Backbone.Collection.extend({
    model: DeskGroup
});