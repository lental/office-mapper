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
  var oldSuccess = options.success;
  options.success = 
  function(model, result, xhr) {
    if(pageState.get('modifiedObjects').has(model)) {
      console.log("deleted from modified objects");
      pageState.get('modifiedObjects').delete(model);
    }
    if(oldSuccess) {
      oldSuccess(model, result, xhr);
    }
  };

  var oldError = options.error;
  options.error = 
  function(model, result, xhr) {
    alert("Sync Failed! Log in and Try again");
    gplusSignOut();
    if(oldError) {
      oldError(model, result, xhr);
    }
  };
  Backbone.old_sync(method, model, options);
};