var userTemplate = _.template("<div class='user-list-element' data-id=<%= id%>>" + 
  "<div class='user-thumbnail'><img class='user-thumbnail-image' src='<%= thumbnailUrl %>' />" +
  "<div class='user-name'>Name: <%= name %> </div>" + 
  "<div class='user-email'>email: <%= email %> </div>" +  
  "<div class='user-desk'>desk: <%= deskId %> </div>" +
  "</div>"
  ); 
                   

var ListBarView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  template: _.template("<% users.each( function(user) { %> \
       <%= userTemplate({id:user.get('id'), \
                      name:user.get('name'), \
                     email:user.get('email'), \
              thumbnailUrl:user.get('thumbnailUrl'),\
              deskId:user.get('deskId')})%> \
        <br /> \
    <% }); %> "),
  render: function() {
    $("#" + this.id).html(this.template({users:this.model}));
    return this;
}
});

var renderUsers = function() {
  new ListBarView({model:users, 
    id: 'list-bar'});
};