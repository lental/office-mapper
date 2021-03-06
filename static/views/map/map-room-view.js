var MapRoomView = Backbone.View.extend({
  tagName: "div",
  className: "mapRoom shadowed",
  id: function() {return "map_room_" + this.model.id},
  initialize: function() {
    this.render();
    this.onGPlusChange();
    this.listenTo(this.model, 'change', this.render);
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
      height: this.model.attributes.position.h,
      width: this.model.attributes.position.w,
      top: this.model.attributes.position.y,
      left: this.model.attributes.position.x,
      transform: "rotate(" + this.model.attributes.rotation + "deg)"
    })
  },
  destroy: function(event) {
    console.log("Desk destroyed")
    this.remove();
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
  },

  roomModified: function(evt) {
    this.updatePageStateAfterModification(this.model,{
      position: {
        x: parseInt(evt.target.style.left),
        y: parseInt(evt.target.style.top),
        w: parseInt(evt.target.style.width),
        h: parseInt(evt.target.style.height)
      }});
  },
  roomDragged: function(evt) {
    this.$el.parent().append(this.$el);
  },

  updatePageStateAfterModification: function(obj, change) {
    pageState.selectObject(obj);
    pageState.setOnSelectedObject(change);
  },

  onGPlusChange: function() {
    if(gplus.isCurrentUserAnAdmin()){
        this.$el
        .draggable({containment: "parent", stop: this.roomModified.bind(this), drag: this.roomDragged.bind(this)})
        .resizable({stop: this.roomModified.bind(this)});
      }
      else{ 
        if (this.$el.resizable("instance")) this.$el.resizable("destroy");
        if (this.$el.draggable("instance")) this.$el.draggable("destroy");
      }
  },

});
