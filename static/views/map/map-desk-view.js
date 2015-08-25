var MapDeskView = Backbone.View.extend({
  tagName: "div",
  className: "mapDesk shadowed",
  id: function() {return "map_desk_" + this.model.attributes.id;},
  initialize: function() {
    this.$el.html(this.template({id:this.model.attributes.id}));
    this.render();
    this.user = users.getUserByDeskId(this.model.attributes.id);
    this.listenTo(this.model, 'sync', this.sync);
    this.listenTo(this.model, 'change', this.render);
    this.listenToOnce(pageState, 'change:usersLoaded', this.render);
    this.listenTo(gplus, 'change', this.render);
  },

  sync: function(event) {
    console.log("synced");
    this.$el.css({
      height: this.model.attributes.position.h,
      width: this.model.attributes.position.w,
      top: this.model.attributes.position.y,
      left: this.model.attributes.position.x,
      transform: "rotate(" + this.model.attributes.rotation + "deg)"
    })
  },
  template: _.template(
    "<div class='mapDeskName invisible'><%= id %></div>"
  ),
  render: function() {
    this.user = users.getUserByDeskId(this.model.attributes.id);
    this.$el.toggleClass("mapDeskFull", this.user != null) ;
    this.$(".mapDeskName").toggleClass("invisible", !gplus.isLoggedIn());
      
    this.$el.css({
      height: this.model.attributes.position.h,
      width: this.model.attributes.position.w,
      top: this.model.attributes.position.y,
      left: this.model.attributes.position.x,
      transform: "rotate(" + this.model.attributes.rotation + "deg)"
    });
    return this;
  }
});
