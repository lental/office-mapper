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
    this.listenTo(this.model, 'add', this.render);
    this.hiding = false;
    this.initialRender();
    this.render();
  },
  initialRender: function() {
    this.$('#user-list').html(this.template({users:this.model}));
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
       "<% params.isSelected = isSelected %>" +
       "<% params.mapName = user.get('mapId') ? maps.getMap(user.get('mapId')).get('name') : 'No Assigned Desk' %>" +
       "<%= userTemplate(params) %>" +
    "<% }); %> "),

  render: function() {
    this.$('.listHideButton').html(this.hiding ? "Show" : "Hide");
    this.$('#user-list').toggleClass("hiddenList", this.hiding);


    var selectedObject = pageState.get('selectedObject');
    var selectedUser;
    if (selectedObject instanceof User) {
      selectedUser = selectedObject;
    } else if (selectedObject instanceof Desk) {
      selectedUser = this.model.getUserByDeskId(selectedObject.get('id'));
    }

    this.$('#user-list .listElement').each(_.bind(function(i, o){
      var userForRow = users.getUser(o.dataset.id);
      var isSelected = userForRow == selectedUser;
      // if () { 
      $(o).toggleClass("displayNone", (this.isHiding ||!(isSelected || userForRow.searchMatches(pageState.get('searchQuery')))));
      $(o).toggleClass("active", isSelected);
      if(isSelected) {
        var element = this.$('#user-list .listElement[data-id='+selectedUser.get('id')+']');
        if (isChildPartiallyOutsideOfParent(element[0], $("#scrollable-list")[0])) {
          element[0].scrollIntoView();
        }
      }
      // }
    },this));

    return this;
  }
});

var renderUsers = function() {
  new UserListView({model:users, pageState: pageState});
};