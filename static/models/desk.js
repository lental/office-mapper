Desk = Backbone.Model.extend({
  parse: function(resp, options){
    if(options.allMapDesks) {
      options.allMapDesks.add(this);
    }
    return resp
  }
});

Desks = Backbone.Collection.extend({
    model: Desk
});