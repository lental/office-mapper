var MapPlaceView = Backbone.View.extend({
  tagName: "div",
  id: function() {return "map_place_" + this.model.id},
  className: "mapPlace shadowed",
  initialize: function() {
    this.render();
    this.onGPlusChange();
    this.listenTo(this.model, 'sync', this.sync);
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
  template: _.template(
    "<div class='mapPlaceName'><%= name %></div>"
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
  placeModified: function(evt) {
    this.updatePageStateAfterModification(this.model,{
      position: {
        x: parseInt(evt.target.style.left),
        y: parseInt(evt.target.style.top),
        w: parseInt(evt.target.style.width),
        h: parseInt(evt.target.style.height)
      }});
  },
  updatePageStateAfterModification: function(obj, change) {
    pageState.selectObject(obj);
    pageState.setOnSelectedObject(change);
  },

  onGPlusChange: function() {
    if(gplus.isLoggedIn()){
        this.$el
        .draggable({containment: "parent", stop: this.placeModified.bind(this)})
        .resizable({stop: this.placeModified.bind(this)});
      }
      else{ 
        if (this.$el.resizable("instance")) this.$el.resizable("destroy");
        if (this.$el.draggable("instance")) this.$el.draggable("destroy");
      }
  },
});
