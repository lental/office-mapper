
var MapDeskGroupView = Backbone.View.extend({
  tagName: "div",
  className: "mapDeskGroup shadowed",
  id: function() {return "map_deskgroup_" + this.model.attributes.id},
  initialize: function() {
    this.render();
    this.listenTo(this.model, 'sync', this.sync);
  },

  sync: function(event) {
    console.log("synced");
    this.$el.css({
      top: this.model.attributes.xyPosition.y,
      left: this.model.attributes.xyPosition.x,
      transform: "rotate(" + this.model.attributes.rotation + "deg)"
    })
  },
  template: _.template(
    "<div class='mapDeskAddButton shadowed clickable'>+</div>"
  ),
  render: function() {
    var maxX = 0;
    var maxY = 0;
    var maxWidth = 0;
    var maxHeight = 0;
    var desks = [];
    this.model.attributes.desks.forEach(function(desk){
      if (desk.attributes.position.x > maxX) {
        maxX = desk.attributes.position.x;
        maxWidth = desk.attributes.position.w;
      }
      if (desk.attributes.position.y > maxY) {
        maxY = desk.attributes.position.y;
        maxHeight = desk.attributes.position.h;
      }
      desks.push(new MapDeskView({model: desk}));
    });

    this.$el.html(this.template({desks: desks}));
    desks.forEach(_.bind(function(desk){
     this.$el.prepend(desk.el);
    },this));
    this.$el.css({
      top: this.model.attributes.xyPosition.y,
      left: this.model.attributes.xyPosition.x,
      height: (maxY + maxHeight + 5) + "px",
      width: (maxX + maxWidth + 30) + "px",
      transform: "rotate(" + this.model.attributes.rotation + "deg)"
    });
    return this;
  }
});

