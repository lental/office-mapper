var userTemplate = _.template("<div class='listElement userListElement<%= isSelected ? ' active': '' %>' data-id=<%= id%>>" +
  "<div class='userThumbnail'><img class='userThumbnailImage' src='<%= thumbnailUrl %>' /></div>" +
  "<div class='userListInfo'>" +
  "<div class='userName'><%= name %> </div>" +
  "<div class='userEmail'><%= email %> </div>" +
  "<div class='userDesk'>desk: <%= deskId %> </div>" +
  "</div>" +
  "</div>"
  );


var UserListView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(pageState, 'change', this.render);
    this.hiding = false;
    this.render();
  },

  el: '#user-section',

  events: {
    "click .userListElement": "onUserClick",
    "click #users-title": "hideShowUsers",
    "mouseenter #users-title"  : "showHideButton",
    "mouseleave #users-title"  : "hideHideButton"
  },


  hideHideButton: function(event) {
    this.$('.listHideButton').removeClass("visible");
  },
  showHideButton: function(event) {
    this.$('.listHideButton').addClass("visible");
  },

  hideShowUsers: function(event) {
    // element = event.currentTarget;
    this.hiding = !this.hiding;
    this.render();
  },
  onUserClick: function(event) {
    element = event.currentTarget;
    console.log("user " + element.dataset.id + " click");
    pageState.selectObject(users.getUser(element.dataset.id));
  },

  template: _.template("<% users.each( function(user) { %>" +
       "<% var isSelected = user == pageState.get('selectedObject') %>" +
       "<% if (isSelected || user.searchMatches(pageState.get('searchQuery'))) { %>" +
       "<% user.attributes.isSelected = isSelected %>" +
       "<%= userTemplate(user.attributes)%>" +
    "<% }}); %> "),

  render: function() {
    this.$('.listHideButton').html(this.hiding ? "Show" : "Hide");
    this.$('#user-list').toggleClass("hiddenList", this.hiding);
    this.$('#user-list').html(this.template({users:this.model}));
    return this;
  }
});

var renderUsers = function() {
  new UserListView({model:users, pageState: pageState});
};