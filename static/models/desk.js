Desk = Backbone.Model.extend({
  parse: function(resp, options){
    if(options.allMapDesks) {
      options.allMapDesks.add(this);
    }
    return resp
  },

  toSimpleString: function() {
    return "Desk " + this.get('id') + ": " + this.get('name');
  }
});

Desks = Backbone.Collection.extend({
    model: Desk
});