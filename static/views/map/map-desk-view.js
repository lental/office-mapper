var MapDeskView = Backbone.View.extend({
  tagName: "div",
  className: "mapDesk shadowed",
  id: function() {return "map_desk_" + this.model.attributes.id;},
  initialize: function() {
    this.$el.html(this.template({id:this.model.attributes.id}));
    this.render();
    this.onGPlusChange();
    this.user = users.getUserByDeskId(this.model.attributes.id);
    this.listenTo(this.model, 'sync', this.sync);
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.destroy);
    this.listenToOnce(pageState, 'change:usersLoaded', this.render);
    this.listenTo(gplus, 'change', this.onGPlusChange);

    this.$el.click(function(evt){
      pageState.mapSelectionClick = true;
      pageState.selectObject(this.model);
      evt.stopPropagation();
    }.bind(this));
  },

  destroy: function(event) {
    console.log("Desk destroyed")
    this.remove();
    this.render();
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
      
    this.$el.css({
      height: this.model.attributes.position.h,
      width: this.model.attributes.position.w,
      top: this.model.attributes.position.y,
      left: this.model.attributes.position.x,
      transform: "rotate(" + this.model.attributes.rotation + "deg)"
    });
    return this;
  },

  onGPlusChange: function() {
    this.$(".mapDeskName").toggleClass("invisible", !gplus.isLoggedIn());
    if(gplus.isLoggedIn()){
        this.$el
        .draggable({containment: "parent", stop: this.deskModified.bind(this)})
        .resizable({stop: this.deskModified.bind(this)});
      }
      else{ 
        if (this.$el.resizable("instance")) this.$el.resizable("destroy");
        if (this.$el.draggable("instance")) this.$el.draggable("destroy");
      }
  },

  deskModified: function(evt) {
    // var deskId = parseInt(evt.target.id.split("_")[2]);
    // var deskGroupId = parseInt(evt.target.parentNode.id.split("_")[2]);
    // var desk = this.model.attributes.deskGroups.findWhere({id:deskGroupId}).attributes.desks.get(deskId);
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

});
