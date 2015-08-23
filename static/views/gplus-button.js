var GPlusButtonView = Backbone.View.extend({
  initialize: function(){
    this.render();
    this.listenTo(gplus, 'change', this.render);
  },

  events: {
    "click #signout": "signout",
    "click #updateUsers": "updateUsers"
  },

  updateUsers: function() {
    gapi.client.load('admin', 'directory_v1', function() {
            // Step 5: Assemble the API request
            console.log(gapi.client);
            var request = gapi.client.directory.users.list({
              customer: "my_customer",
              viewType: "domain_public"
            });
            // Step 6: Execute the API request
            request.execute(function(resp) {
              console.log('RESPONSE', resp);
            });
          });
  },
  signout: function() {
    gapi.load('auth2', function(){
      gapi.auth2.getAuthInstance().signOut();
    });
    this.model.clear().set(this.model.defaults);
  },

  el: '#gplus-container',

  render: function() {
    var gUser = this.model.get("googleUser");
    if (gUser) {
      var profile = gUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
      // console.log('ID Token: ' + gUser.getAuthResponse().id_token);

      this.$('#user-info').html("Hello, " + profile.getName() + "!");
      this.$("#loggedOut").hide();
      this.$("#loggedIn").show();
    } else {
      this.$("#loggedIn").hide();
      this.$("#loggedOut").show();
    }

    return this;
  }
});
function connectGPlusView() {
  new GPlusButtonView({model:gplus});
};

