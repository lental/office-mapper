
var UserListView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(pageState, 'change', this.render);
    this.listenTo(this.model, 'add', this.render);
    this.hiding = false;
    this.initialRender();
    this.render();
  },
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

      $(o).toggleClass("displayNone", (this.isHiding ||!(isSelected || userForRow.searchMatches(pageState.get('searchQuery')))));
      $(o).toggleClass("active", isSelected);

      if(isSelected) {
        var element = this.$('#user-list .listElement[data-id='+selectedUser.get('id')+']');
        if (isChildPartiallyOutsideOfParent(element[0], $("#scrollable-list")[0])) {
          element[0].scrollIntoView();
        }
      }
    },this));

    return this;
  }
});

var renderUsers = function() {
  new UserListView({model:users, pageState: pageState});
};