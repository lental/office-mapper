var MapSectionView = Backbone.View.extend({
  tagName: "div",
  className: "mapSection shadowed",
  showingCreateDialog: false,
  initialize: function() {
    this.initialRender();
    this.listenTo(this.model, 'sync', this.sync);
    this.listenTo(this.model, 'destroy', this.destroy);
    // this.listenTo(this.model.deskGroups, 'add', onDeskGroupAdd);
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

  initialRender: function() {
    this.$el.html(this.template({attributes: this.model.attributes}));
    this.model.attributes.deskGroups.forEach(_.bind(function(group){
      var newDeskGroup = new MapDeskGroupView({model: group});
      this.$el.append(newDeskGroup.el);
    },this));

    this.model.attributes.rooms.forEach(_.bind(function(room){
      var newRoom = new MapRoomView({model: room});
      this.$el.append(newRoom.el);
    },this));

    this.model.attributes.places.forEach(_.bind(function(place){
      var newPlace = new MapPlaceView({model: place});
      this.$el.append(newPlace.el);
    },this));
    this.$el.append("<div class='mapSectionAddButton clickable shadowed'>+</div>");
    this.$el.find(".mapSectionAddButton").click(this.showCreateDialog.bind(this));
    this.$el.find(".mapDeskAddButton").click(this.createDesk.bind(this));

    this.render();
    this.onGPlusChange();
  },

  template: _.template(
    "<div class='mapSectionName'><%= attributes.name %></div>" 
  ),

  showCreateDialog: function() {
    if (this.showingCreateDialog) {
      this.$el.find(".mapSectionAddDialog").remove();
    }
    else {
      this.$el.append("<div class='mapSectionAddDialog shadowed'>" +
        "<div class='mapAddPlace clickable' >Place</div>" +
        "<div class='mapAddRoom clickable' >Room</div>" +
        "<div class='mapAddDeskGroup clickable' >Desk Group</div>" +
      "</div>"
      );

      this.$el.find(".mapAddPlace").click(this.createPlace.bind(this));
      this.$el.find(".mapAddRoom").click(this.createRoom.bind(this));
      this.$el.find(".mapAddDeskGroup").click(this.createDeskGroup.bind(this));
    }
    this.showingCreateDialog = !this.showingCreateDialog;
  },

  createRoom: function() {
    if(gplus.isCurrentUserAnAdmin()) {        
      this.$el.find(".mapSectionAddDialog").remove();
      this.showingCreateDialog = false;
      var newRoom = this.model.attributes.rooms.create({
          name: "New Room",
          position: {x: 0, y:0, h: 100, w: 100},
          mapId: pageState.attributes.currentMapId,
          sectionId: this.model.attributes.id
        }, {success: function(){location.reload();} }
      );
    // new MapRoomView({model: newRoom});
    } else {
      alert("You are not logged in");
    }
  },

  createPlace: function() {
    if(gplus.isCurrentUserAnAdmin()) {
      this.$el.find(".mapSectionAddDialog").remove();
      this.showingCreateDialog = false;
      var newPlace = this.model.attributes.places.create({
          name: "New Place",
          position: {x: 0, y:0, h: 100, w: 100},
          mapId: pageState.attributes.currentMapId,
          sectionId: this.model.attributes.id
        }, {success: function(){location.reload();} }
      );
    // new MapPlaceView({model: newPlace});
    } else {
      alert("You are not logged in");
    }
  },

  createDeskGroup: function() {
    if(gplus.isCurrentUserAnAdmin()) {
      this.$el.find(".mapSectionAddDialog").remove();
      this.showingCreateDialog = false;
      var newDeskGroup = this.model.attributes.deskGroups.create({
          xyPosition: {x: 0, y:0},
          mapId: pageState.attributes.currentMapId,
          sectionId: this.model.attributes.id,
          desks: new Desks()
        }, {success: function(){location.reload();} }
      );
    // new MapDeskGroupView({model: newDeskGroup});
    } else {
      alert("You are not logged in");
    }
  },

  createDesk: function(evt) {
    if(gplus.isCurrentUserAnAdmin()) {
      var deskGroupId = parseInt(evt.target.parentNode.id.split("_")[2]);
      var clickedDeskGroup = this.model.attributes.deskGroups.findWhere({id:deskGroupId});
      var newDesk = clickedDeskGroup.attributes.desks.create({
        deskGroupId: deskGroupId,
        position: {x:0, y:0, h:40, w:20},
        rotation: 0
        }, {success: function(){location.reload();} }
      );
    // new MapDeskView({model: newDesk});
    } else {
      alert("You are not logged in");
    }
  },

  sectionModified: function(evt) {
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

  sectionDragged: function(evt) {
    var map = $("#map");
    var section = evt.target;
    if (map.width() - (parseInt(section.style.left) + parseInt(section.style.width)) < 100) {
      console.log("widening map");
      map.width(map.width() + 200);
    }
    if (map.height() - (parseInt(section.style.top) + parseInt(section.style.height)) < 100) {
      console.log("heightening map");
      map.height(map.height() + 200);
    }
  },

  onGPlusChange: function() {
    if(gplus.isLoggedIn()){
        this.$el
        .draggable({containment: "parent", stop: this.sectionModified.bind(this), drag: this.sectionDragged.bind(this)})
        .resizable({stop: this.sectionModified.bind(this)});
      }
      else{ 
        if (this.$el.resizable("instance")) this.$el.resizable("destroy");
        if (this.$el.draggable("instance")) this.$el.draggable("destroy");
      }
  },
  render: function() {
    this.$el.css({
      height: this.model.attributes.position.h,
      width: this.model.attributes.position.w,
      top: this.model.attributes.position.y,
      left: this.model.attributes.position.x
    });
    return this;
  }
});
