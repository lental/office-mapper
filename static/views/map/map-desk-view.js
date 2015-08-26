var MapDeskView = Backbone.View.extend({
  deskOffset: 5, //The amount of top and left padding desired
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
    this.$el.attr("id",this.id());
    this.$(".mapDeskName").html(this.model.attributes.id);
    this.render();
  },
  template: _.template(
    "<div class='mapDeskName '><%= id %></div>" //invisible could be default if desired
  ),
  render: function() {
    this.user = users.getUserByDeskId(this.model.attributes.id);
    this.$el.toggleClass("mapDeskFull", this.user != null) ;
      
    this.$el.css({
      top: this.model.attributes.position.y + this.deskOffset,
      left: this.model.attributes.position.x + this.deskOffset,
      height: this.model.attributes.position.h,
      width: this.model.attributes.position.w,
      transform: "rotate(" + this.model.attributes.rotation + "deg)"
    });
    return this;
  },

  deskDragged: function(evt) {
    this.$el.parent().append(this.$el);
    var desk = evt.target;
    var deskGroup = this.$el.parent();
    deskGroup.css({transform:"rotate(0)"});
    if (deskGroup.width() - (parseInt(desk.style.left) + parseInt(desk.style.width)) <30) {
      console.log("widening deskgroup");
      deskGroup.width((parseInt(desk.style.left) + parseInt(desk.style.width))+30);
    }
    if (deskGroup.height() - (parseInt(desk.style.top) + parseInt(desk.style.height)) <5) {
      console.log("heightening deskgroup");
      deskGroup.height((parseInt(desk.style.top) + parseInt(desk.style.height))+ 5);
    }
  },
  onGPlusChange: function() {
    // this.$(".mapDeskName").toggleClass("invisible", !gplus.isLoggedIn());
    if(gplus.isLoggedIn()){
      this.$el
        .draggable({stop: this.deskModified.bind(this), drag: this.deskDragged.bind(this)})
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
        x: parseInt(evt.target.style.left) - this.deskOffset,
        y: parseInt(evt.target.style.top) - this.deskOffset,
        w: parseInt(evt.target.style.width),
        h: parseInt(evt.target.style.height)
    }});
  },
  updatePageStateAfterModification: function(obj, change) {
    pageState.selectObject(obj);
    pageState.setOnSelectedObject(change);
  },

});
