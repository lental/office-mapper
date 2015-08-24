Backbone.Model.prototype.toJSON = function() {
  var json = _.clone(this.attributes);
  for(var attr in json) {
    if((json[attr] instanceof Backbone.Model) || (json[attr] instanceof Backbone.Collection)) {
      json[attr] = json[attr].toJSON();
    }
  }
  return json;
};

Backbone.old_sync = Backbone.sync
Backbone.sync = function(method, model, options) {
  if(gplus.isLoggedIn()) {
    options.headers = {"id-token": gplus.getAccessToken()};
    console.log("syncing with new token");
  }
  Backbone.old_sync(method, model, options);
};