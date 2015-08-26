
var MapDeskGroupView = Backbone.View.extend({
  tagName: "div",
  className: "mapDeskGroup shadowed",
  id: function() {return "map_deskgroup_" + this.model.attributes.id},
  initialize: function() {
    this.initialRender()
    this.listenTo(this.model, 'sync', this.sync);
    this.listenTo(this.model, 'destroy', this.destroy);
    this.listenTo(this.model.get("desks"), 'change', this.change);
    this.listenTo(this.model.get("desks"), 'add', this.deskAdded);
    this.listenTo(gplus, 'change', this.onGPlusChange);

    this.$el.find(".mapDeskAddButton").click(this.createDesk.bind(this));
    this.$el.click(function(evt){
      pageState.mapSelectionClick = true;
      pageState.selectObject(this.model);
      evt.stopPropagation();
    }.bind(this));
  },
  change: function(){
    this.render();
  },

  initialRender: function(){
    var desks = [];
    this.$el.html(this.template({desks: desks}));
    this.model.attributes.desks.forEach(_.bind(function(desk){

      desk = new MapDeskView({model: desk});
      this.$el.append(desk.el);
    },this));
    this.render();
    this.onGPlusChange();
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
  deskAdded: function(desk) {
    var deskView = new MapDeskView({model: desk});
    this.$el.append(deskView.el);
  },
  template: _.template(
    "<div class='mapDeskAddButton shadowed clickable'>+</div>"
  ),
  render: function() {
    var maxX = 0;
    var maxY = 0;
    var maxWidth = 0;
    var maxHeight = 0;

    this.model.attributes.desks.forEach(function(desk){
      if (desk.attributes.position.x + desk.attributes.position.w >= maxX + maxWidth) {
        maxX = desk.attributes.position.x;
        maxWidth = desk.attributes.position.w;
      }
      if (desk.attributes.position.y + desk.attributes.position.h >= maxY + maxHeight) {
        maxY = desk.attributes.position.y;
        maxHeight = desk.attributes.position.h;
      }
    });
    this.$el.css({
        top: this.model.attributes.xyPosition.y,
        left: this.model.attributes.xyPosition.x,
        height: (maxY + maxHeight + 10) + "px",
        width: (maxX + maxWidth + (gplus.isLoggedIn() ? 40 : 10)) + "px",
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
  deskGroupDragged: function(evt) {
    this.$el.parent().append(this.$el);
  },

  onGPlusChange: function() {
    if(gplus.isLoggedIn()){
        this.$el
        .draggable({containment: "parent", stop: this.deskGroupModified.bind(this), drag: this.deskGroupDragged.bind(this)})
        .resizable({stop: this.deskGroupModified.bind(this)});
        this.$(".mapDeskAddButton").removeClass("displayNone");
      }
      else{ 
        if (this.$el.resizable("instance")) this.$el.resizable("destroy");
        if (this.$el.draggable("instance")) this.$el.draggable("destroy");
        this.$(".mapDeskAddButton").addClass("displayNone");
      }
      this.render();
  },
  updatePageStateAfterModification: function(obj, change) {
    pageState.selectObject(obj);
    pageState.setOnSelectedObject(change);
  },

  createDesk: function(evt) {
    if(gplus.isCurrentUserAnAdmin()) {
      // var deskGroupId = parseInt(evt.target.parentNode.id.split("_")[2]);
      // var clickedDeskGroup = this.model.attributes.deskGroups.findWhere({id:deskGroupId});
      // debugger;
      var newDesk = this.model.get("desks").create({
        deskGroupId: this.model.get("id"),
        position: {x:0, y:0, h:40, w:20},
        rotation: 0,
        wait:true,
        },{success: _.bind(function(model){
            // this.$el.append(new MapDeskView({model:model}).el)
            // pageState.mapSelectionClick = false;
            model.trigger('sync', model);
            pageState.selectObject(model);
          },this)
        }
      );
    // new MapDeskView({model: newDesk});
    } else {
      alert("You are not logged in");
    }
  },
});

