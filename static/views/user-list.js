var userTemplate = _.template("<div class='userListElement <%= isSelected ? 'active': '' %>' data-id=<%= id%>>" + 
  "<div class='userThumbnail'><img class='userThumbnailImage' src='<%= thumbnailUrl %>' /></div>" +
  "<div class='userName'>Name: <%= name %> </div>" + 
  "<div class='userEmail'>email: <%= email %> </div>" +  
  "<div class='userDesk'>desk: <%= deskId %> </div>" +
  "</div>"
  ); 
                   

var UserListView = Backbone.View.extend({
  initialize: function(){
    this.render();
    this.listenTo(pageState, 'change', this.render);
  },

  el: '#user-list',

  events: {
    "click .userListElement": "onUserClick",
  },

  onUserClick: function(event) {
    element = event.currentTarget;
    console.log("user " + element.dataset.id + " click");
    pageState.selectObject(users.getUser(element.dataset.id));
  },

  template: _.template("<% users.each( function(user) { %> \
       <% user.attributes.isSelected = user == pageState.get('selectedObject') %> \
       <%= userTemplate(user.attributes)%> \
    <% }); %> "),
  render: function() {
    this.$el.html(this.template({users:this.model}));
    return this;
  }
});

var renderUsers = function() {
  new UserListView({model:users, pageState: pageState});
};