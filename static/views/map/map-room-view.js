var MapRoomView = Backbone.View.extend({
  tagName: "div",
  className: "mapRoom shadowed",
  id: function() {return "map_room_" + this.model.id},
  initialize: function() {
    this.render();
  },
  template: _.template(
    "<div class='mapRoomName'><%= name %></div>"
  ),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    this.$el.css({
      height: this.model.attributes.position.h,
      width: this.model.attributes.position.w,
      top: this.model.attributes.position.y,
      left: this.model.attributes.position.x
    });
    if(this.model.attributes.color)
      this.$el.css({
        "background-color": this.model.attributes.color
      });
    return this;
  }
});
