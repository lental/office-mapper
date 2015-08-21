var userTemplate = _.template("Name: <%= name %> <br />" + 
  "email: <%= email %> <br />" + 
  "thumbnail: <%= thumbnailUrl %> <br />" + 
  "desk: <%= deskId %> <br />"
  ); 
                   

var ListBarView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  template: _.template("<% users.each( function(user) { %> \
       <%= userTemplate({name:user.get('name'), email:user.get('email'), thumbnailUrl:user.get('thumbnailUrl'), deskId:user.get('desk_id')})%> \
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