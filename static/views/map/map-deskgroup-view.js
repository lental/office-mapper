
var MapDeskGroupView = Backbone.View.extend({
  tagName: "div",
  className: "mapDeskGroup shadowed",
  id: function() {return "map_deskgroup_" + this.model.attributes.id},
  initialize: function() {
    this.render();
    this.onGPlusChange();
    this.listenTo(this.model, 'sync', this.sync);
    this.listenTo(this.model, 'destroy', this.destroy);
    this.listenTo(gplus, 'change', this.onGPlusChange);

    this.$el.click(function(evt){
      pageState.mapSelectionClick = true;
      pageState.selectObject(this.model);
      evt.stopPropagation();
    }.bind(this));
  },

  sync: function(event) {
    console.log("synced");
    this.$el.css({
      top: this.model.attributes.xyPosition.y,
      left: this.model.attributes.xyPosition.x,
      transform: "rotate(" + this.model.attributes.rotation + "deg)"
    })
  },
  destroy: function(event) {
    console.log("Desk destroyed")
    this.remove();
    this.render();
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
     this.$el.append(desk.el);
    },this));
    this.$el.css({
      top: this.model.attributes.xyPosition.y,
      left: this.model.attributes.xyPosition.x,
      height: (maxY + maxHeight + 5) + "px",
      width: (maxX + maxWidth + 30) + "px",
      transform: "rotate(" + this.model.attributes.rotation + "deg)"
    });
    return this;
  },

  deskGroupModified: function(evt) {
    this.updatePageStateAfterModification(this.model,{
      xyPosition: {
        x: parseInt(evt.target.style.left),
        y: parseInt(evt.target.style.top),
        // w: parseInt(evt.target.style.width),
        // h: parseInt(evt.target.style.height)
      }});
  },
  
  onGPlusChange: function() {
    if(gplus.isLoggedIn()){
        this.$el
        .draggable({containment: "parent", stop: this.deskGroupModified.bind(this)})
        .resizable({stop: this.deskGroupModified.bind(this)});
      }
      else{ 
        if (this.$el.resizable("instance")) this.$el.resizable("destroy");
        if (this.$el.draggable("instance")) this.$el.draggable("destroy");
      }
  },
  updatePageStateAfterModification: function(obj, change) {
    pageState.selectObject(obj);
    pageState.setOnSelectedObject(change);
  },
});

