var userTemplate = _.template("<div class='listElement userListElement<%= isSelected ? ' active': '' %>' data-id=<%= id%>>" +
  "<div class='userThumbnail'><img class='userThumbnailImage' src='<%= thumbnailUrl%>' onerror='this.src=\"/images/default-thumbnail.png\"' /></div>" +
  "<div class='userListInfo'>" +
  "<div class='userName'><%= name %> </div>" +
  "<div class='userEmail'><%= email %> </div>" +
  "<div class='userDesk'>Map: <%= mapName %> </div>" +
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
       "<% var params = JSON.parse(JSON.stringify(user.attributes))%>" +
       "<% if (isSelected || user.searchMatches(pageState.get('searchQuery'))) { %>" +
       "<% params.isSelected = isSelected %>" +
       "<% params.mapName = user.get('mapId') ? maps.getMap(user.get('mapId')).get('name') : 'No Assigned Desk' %>" +
       "<%= userTemplate(params) %>" +
    "<% }}); %> "),

  render: function() {
    this.$('.listHideButton').html(this.hiding ? "Show" : "Hide");
    this.$('#user-list').toggleClass("hiddenList", this.hiding);
    this.$('#user-list').html(this.template({users:this.model}));
    var selectedObject = pageState.get('selectedObject');
    if (selectedObject instanceof User) {
      this.$('#user-list .listElement[data-id='+selectedObject.get('id')+']')[0].scrollIntoView();
    }
    return this;
  }
});

var renderUsers = function() {
  new UserListView({model:users, pageState: pageState});
};