GPlus =  Backbone.Model.extend({
    defaults: {
      googleUser: null,
      error: null,
    },
    isLoggedIn: function() {
      return this.get("googleUser") != null;
    },

    getUserId: function() {
      if (this.get("googleUser")) {
        return this.get("googleUser").getBasicProfile().getId();
      } else {
        console.log("no User ID!");
        return null
      }
    },
    
    getIdToken: function() {
      if (this.get("googleUser") && this.get("googleUser").getAuthResponse()) {
        return this.get("googleUser").getAuthResponse().id_token;
      } else {
        console.log("not properly logged in!");
        return null
      }
    },
    isCurrentUserAnAdmin: function() {
      var user = users.getUserByGPlusId(this.getUserId());
      return user != null ? user.get('admin') : false ;
    }
});