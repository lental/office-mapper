var UserEntryView = Backbone.View.extend({
  initialize: function(){
    // this.listenTo(pageState, 'change', this.render);
    // this.listenTo(this.model, 'add', this.render);
    this.listenTo(this.model, 'change', this.initialRender);
    this.listenTo(pageState, 'change:searchQuery', this.render);
    this.listenTo(pageState, 'change:selectedObject', this.render);
    // this.hiding = false;
    this.initialRender();
    this.render();
  },
  initialRender: function() {
    this.$el.html(this.template({
      user:this.model,
      isSelected: this.model == pageState.get('selectedObject'),
      mapName: this.model.get('mapId') ? maps.getMap(this.model.get('mapId')).get('name') : 'No Assigned Desk'
    }));
  },

  id: function() {return "list_user_" + this.model.attributes.id;},
  tagName: "div",
  className: "listElement userListElement",

  events: {
    "click ": "onUserClick"
  },

  onUserClick: function(event) {
    element = event.currentTarget;
    console.log("user " + element.dataset.id + " click");
    pageState.selectObject(this.model);
  },

  template:  _.template("" +
  "<div class='userThumbnail'><img class='userThumbnailImage' src='<%= user.get('thumbnailUrl')%>' onerror='this.src=\"/images/default-thumbnail.png\"' /></div>" +
  "<div class='userListInfo'>" +
  "<div class='userName'><%= user.get('name') %> </div>" +
  "<div class='userEmail'><%= user.get('email') %> </div>" +
  "<div class='userDesk'>Map: <%= mapName %> </div>" +
  "</div>" +
  ""
  ),
  // _.template("<% users.each( function(user) { %>" +
  //      "<% var isSelected = user ==  %>" +
  //      "<% var params = JSON.parse(JSON.stringify(user.attributes))%>" +
  //      "<% params.isSelected = isSelected %>" +
  //      "<% params.mapName = user.get('mapId') ? maps.getMap(user.get('mapId')).get('name') : 'No Assigned Desk' %>" +
  //      "<%= userTemplate(params) %>" +
  //   "<% }); %> "),

  render: function() {

    var selectedObject = pageState.get('selectedObject');
    var selectedUser;
    if (selectedObject instanceof User) {
      selectedUser = selectedObject;
    } else if (selectedObject instanceof Desk) {
      selectedUser = this.model.getUserByDeskId(selectedObject.get('id'));
    }

    var isSelected = this.model == selectedUser;
    // if () { 
    this.$el.toggleClass("displayNone", !(isSelected || this.model.searchMatches(pageState.get('searchQuery'))));
    this.$el.toggleClass("active", isSelected);
    if(isSelected) {
      var element = this.$el;
      if (isChildPartiallyOutsideOfParent(element[0], $("#scrollable-list")[0])) {
        element[0].scrollIntoView();
      }
    }
    // }
  

    return this;
  }
});

var renderUsers = function() {
  new UserListView({model:users, pageState: pageState});
};