
var UserListView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(listState, 'change', this.render);
    this.listenTo(this.model, 'add', this.render);
    this.hiding = false;
    this.initialRender();
    this.render();
  },
  el:'#user-section',
  initialRender: function() {
    this.$('#user-list').empty();
    users.each( function(user) { 
      userView = new UserEntryView({model: user});
        this.$('#user-list').append(userView.$el);
    });
  },

  events: {
    "click .userListElement": "onUserClick",
    "click .listBarTitle": "hideShowUsers",
    "mouseenter .listBarTitle"  : "showHideButton",
    "mouseleave .listBarTitle"  : "hideHideButton"
  },

  hideHideButton: function(event) {
    this.$('.listHideButton').removeClass("visible");
  },
  showHideButton: function(event) {
    this.$('.listHideButton').addClass("visible");
  },

  hideShowUsers: function(event) {
    this.hiding = !this.hiding;
    this.render();
  },

  render: function() {
    this.$('.listHideButton').html(this.hiding ? "Show" : "Hide");
    this.$('#user-list').toggleClass("hiddenList", this.hiding);

    return this;
  }
});

var renderUsers = function() {
  new UserListView({model:users, listState: listState});
};