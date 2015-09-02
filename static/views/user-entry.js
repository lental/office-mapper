var UserEntryView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.model, 'change', this.initialRender);
    this.listenTo(listState, 'change:searchQuery', this.render);
    this.listenTo(listState, 'change:filterByCurrentMap', this.render);
    this.listenTo(pageState, 'change:selectedObject', this.render);
    this.map = maps.getMap(this.model.get('mapId'));
    this.listenTo(this.map, 'change', this.onMapChanged);
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
  className: "listElement userListElement clickable",

  events: {
    "click ": "onUserClick"
  },

  onUserClick: function(event) {
    element = event.currentTarget;
    console.log("user " + element.dataset.id + " click");
    pageState.selectObject(this.model);
  },

  onMapChanged: function() {
    this.$(".userMap").html(this.map.get("name"));
  },

  template:  _.template("" +
  "<div class='userThumbnail'><img class='userThumbnailImage' src='<%= user.get('thumbnailUrl')%>' onerror='this.src=\"/images/default-thumbnail.png\"' /></div>" +
  "<div class='userListInfo'>" +
  "<div class='userName'><%= user.get('name') %> </div>" +
  "<div class='userEmail'><%= user.get('email') %> </div>" +
  "<div class='userMap'><%= mapName %> </div>" +
  "</div>"
  ),

  render: function() {
    var selectedObject = pageState.get('selectedObject');
    var selectedUser;
    if (selectedObject instanceof User) {
      selectedUser = selectedObject;
    } else if (selectedObject instanceof Desk) {
      selectedUser = users.getUserByDeskId(selectedObject.get('id'));
    }

    var isSelected = this.model == selectedUser;
    var matchesSearchQuery = this.model.searchMatches(listState.get('searchQuery'));
    var isCurrentMapShowing = !listState.get('filterByCurrentMap') || this.model.get('mapId') == pageState.get('currentMapId');

    var shouldShow = isSelected || (matchesSearchQuery && isCurrentMapShowing)
    this.$el.toggleClass("displayNone", !shouldShow);
    this.$el.toggleClass("active", isSelected);
    if(isSelected) {
      var element = this.$el;
      if (isChildPartiallyOutsideOfParent(element[0], $("#scrollable-list")[0])) {
        element[0].scrollIntoView();
      }
    }

    return this;
  }
});