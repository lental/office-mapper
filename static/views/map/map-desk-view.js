var MapDeskView = Backbone.View.extend({
  tagName: "div",
  className: "mapDesk shadowed",
  id: function() {return "map_desk_" + this.model.attributes.id;},
  initialize: function() {
    this.render();
    this.listenTo(pageState, 'change', this.render);
    this.user = users.getUserByDeskId(this.model.attributes.id);
  },
  render: function() {
    this.user = users.getUserByDeskId(this.model.attributes.id);
    this.$el.toggleClass("mapDeskFull", this.user != null) ;
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
