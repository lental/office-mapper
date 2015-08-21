
var ListBarView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  template: _.template("<% users.each( function(map) { %> \
        Name: <%= map.get('name') %> <br /> \
        email: <%= map.get('email') %> <br /> \
        thumbnail: <%= map.get('thumbnailUrl') %> <br /> \
        desk: <%= map.get('desk_id') %> <br /> \
        <br /> \
    <% }); %> "),
  render: function() {
    $("#" + this.id).html(this.template({maps:this.model}));
    return this;
}
});

var renderUsers = function() {
  new ListBarView({model:users, 
    id: 'list-bar'});
};