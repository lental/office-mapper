DeskGroup = Backbone.Model.extend({
  modelType: "DeskGroup",
    parse : function (response, options) {
      if (response.deskGroup) {
        response = response.deskGroup;
      }
      response.desks =  new Desks(response.desks, {parse: true, allMapDesks: options.allMapDesks});
      return response;
    },
  toSimpleString: function() {
    return "DeskGroup " + this.get('id') + ": " + this.get('name');
  }
});

DeskGroups = Backbone.Collection.extend({
    model: DeskGroup
});