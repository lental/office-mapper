Desk = Backbone.Model.extend({
  modelType: "Desk",
  parse: function(response, options){
    if (response.desk) {
      response = response.desk;
    }
    if(options.allMapDesks) {
      options.allMapDesks.add(this);
    }
    return response
  },

  toSimpleString: function() {
    return "Desk " + this.get('id') + ": " + this.get('name');
  }
});

Desks = Backbone.Collection.extend({
    model: Desk
});