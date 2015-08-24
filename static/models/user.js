User = Backbone.Model.extend({
    searchMatches: function(query) {
        if(query == '') {
            return true;
        } else if (this.get("name") && this.get("name").toUpperCase().indexOf(query.toUpperCase()) > -1) {
            return true;
        } else if (this.get("email") && this.get("email").toUpperCase().indexOf(query.toUpperCase()) > -1 ) {
            return true;
        }
        return false;
    },
    mapIsLoadedAndVisible: function() {
        return this.get("mapId") == pageState.get("currentMapId") && pageState.get("currentMapLoaded");
    },
  toSimpleString: function() {
    return "User " + this.get('id') + ": " + this.get('name');
  }
});

Users = Backbone.Collection.extend({
    model: User,
    getUser : function(id) {
        return this.get({"id":id});
    },
    getUserByGPlusId : function(gplus_id) {
        return this.findWhere({"gplusId":gplus_id});
    },
    parse : function(response){
        return response.users;
    }
});