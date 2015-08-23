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
    $("#confirm-dialog").html("Are you sure? This will update the user list to be up-to-date from Google Servers");
    $("#confirm-dialog").dialog({appendTo:"#vertical-flexbox",   
      buttons: [{
        text: "Ok",
        click: function() {
          $(this).html("getting list...");
          $("#confirm-dialog").dialog({
            buttons:[]
          });
          gplusList.getUserList(_.bind(function(list){
          $(this).html("sending list...");
            var jqxhr = $.post( "/v1/batchUsers", JSON.stringify(list), function() {
              console.log( "success" );
            })
              .done(_.bind(function() {
                console.log( "second success" );
              },this))
              .fail(_.bind(function() {
                $(this).html("Error.");
                console.log( "error" );
              },this))
              .always(_.bind(function() {        
                $("#confirm-dialog").dialog({
                  buttons:[{
                    text: "Close",
                    click: function() {
                      $(this).dialog( "close" );
                    }  
                  }]
                });
            },this));
          },this));
        }  
      },
      {
        text: "Cancel",
        click: function() {
          $(this).dialog( "close" );
        }  
      }]
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

