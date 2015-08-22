var GPlusButtonView = Backbone.View.extend({
  initialize: function(){
    this.render();
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
    this.$("#loggedIn").hide();
    this.$("#loggedOut").show();
    gapi.load('auth2', function(){
      gapi.auth2.getAuthInstance().signOut();
    });
  },

  el: '#gplus-container',

  render: function() {
    return this;
  }
});
function renderGPlusButton() {
  new GPlusButtonView({model:places});
};

function onSuccess(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail());
  console.log('ID Token: ' + googleUser.getAuthResponse().id_token);
  this.$('#user-info').html("Hello, " + profile.getName() + "!");
  this.$("#loggedOut").hide();
  this.$("#loggedIn").show();
}
function onFailure(error) {
  console.log(error);
}
function renderButton() {
  this.$("#loggedIn").hide();
  this.$("#loggedOut").show();
  gapi.signin2.render('signin', {
    'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/admin.directory.user.readonly',
    'width': 200,
    'height': 45,
    'longtitle': false,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}