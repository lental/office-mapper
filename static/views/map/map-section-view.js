var MapSectionView = Backbone.View.extend({
  tagName: "div",
  className: "mapSection shadowed",
  showingCreateDialog: false,
  initialize: function() {
    this.initialRender();
    this.render();
    this.listenTo(gplus, 'change', this.render);
    this.listenTo(this.model, 'sync', this.sync);
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
    var localDeskGroups = [];
    this.model.attributes.deskGroups.forEach(function(group){
      localDeskGroups.push(new MapDeskGroupView({model: group}));
    });

    var localRooms = [];
    this.model.attributes.rooms.forEach(function(room){
      localRooms.push(new MapRoomView({model: room}));
    });

    var localPlaces = [];
    this.model.attributes.places.forEach(function(place){
      localPlaces.push(new MapPlaceView({model: place}));
    });

    this.$el.html(this.template({attributes: this.model.attributes}));

    localDeskGroups.forEach(_.bind(function(group){
      this.$el.append(group.el);
    },this));

    localRooms.forEach(_.bind(function(room){
      this.$el.append(room.el);
    },this));

    localPlaces.forEach(_.bind(function(place){
      this.$el.append(place.el);
    },this));

    this.$el.append("<div class='mapSectionAddButton clickable shadowed'>+</div>");

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
    this.$el.find(".mapSectionAddDialog").remove();
    this.showingCreateDialog = false;
    var newRoom = this.model.attributes.rooms.create({
        name: "New Room",
        position: {x: 0, y:0, h: 100, w: 100},
        mapId: pageState.attributes.currentMapId,
        sectionId: this.model.attributes.id
    });
    new MapRoomView({model: newRoom});
    location.reload();
  },

  createPlace: function() {
    this.$el.find(".mapSectionAddDialog").remove();
    this.showingCreateDialog = false;
    var newPlace = this.model.attributes.places.create({
        name: "New Place",
        position: {x: 0, y:0, h: 100, w: 100},
        mapId: pageState.attributes.currentMapId,
        sectionId: this.model.attributes.id
    });
    new MapPlaceView({model: newPlace});
    location.reload();
  },

  createDeskGroup: function() {
    this.$el.find(".mapSectionAddDialog").remove();
    this.showingCreateDialog = false;
    var newDeskGroup = this.model.attributes.deskGroups.create({
        xyPosition: {x: 0, y:0},
        mapId: pageState.attributes.currentMapId,
        sectionId: this.model.attributes.id,
        desks: new Desks()
    });
    new MapDeskGroupView({model: newDeskGroup});
    location.reload();
  },

  createDesk: function(evt) {
    var deskGroupId = parseInt(evt.target.parentNode.id.split("_")[2]);
    var clickedDeskGroup = this.model.attributes.deskGroups.findWhere({id:deskGroupId});
    var newDesk = clickedDeskGroup.attributes.desks.create({
      deskGroupId: deskGroupId,
      position: {x:0, y:0, h:40, w:20},
      rotation: 0
    });
    new MapDeskView({model: newDesk});
    location.reload();
  },

  deskGroupModified: function(evt) {
    var deskGroupId = parseInt(evt.target.id.split("_")[2]);
    var deskGroup = this.model.attributes.deskGroups.findWhere({id:deskGroupId});
    this.updatePageStateAfterModification(deskGroup,{
      xyPosition: {
        x: parseInt(evt.target.style.left),
        y: parseInt(evt.target.style.top),
        // w: parseInt(evt.target.style.width),
        // h: parseInt(evt.target.style.height)
      }});
  },

  deskModified: function(evt) {
    var deskId = parseInt(evt.target.id.split("_")[2]);
    var deskGroupId = parseInt(evt.target.parentNode.id.split("_")[2]);
    var desk = this.model.attributes.deskGroups.findWhere({id:deskGroupId}).attributes.desks.get(deskId);
    this.updatePageStateAfterModification(desk,{
      position: {
        x: parseInt(evt.target.style.left),
        y: parseInt(evt.target.style.top),
        w: parseInt(evt.target.style.width),
        h: parseInt(evt.target.style.height)
    }});
  },

  roomModified: function(evt) {
    var roomId = parseInt(evt.target.id.split("_")[2]);
    var room = this.model.attributes.rooms.findWhere({id:roomId});
    this.updatePageStateAfterModification(room,{
      position: {
        x: parseInt(evt.target.style.left),
        y: parseInt(evt.target.style.top),
        w: parseInt(evt.target.style.width),
        h: parseInt(evt.target.style.height)
      }});
  },

  placeModified: function(evt) {
    var placeId = parseInt(evt.target.id.split("_")[2]);
    var place = this.model.attributes.places.findWhere({id:placeId});
    this.updatePageStateAfterModification(place,{
      position: {
        x: parseInt(evt.target.style.left),
        y: parseInt(evt.target.style.top),
        w: parseInt(evt.target.style.width),
        h: parseInt(evt.target.style.height)
      }});
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

  render: function() {

    this.$el.css({
      height: this.model.attributes.position.h,
      width: this.model.attributes.position.w,
      top: this.model.attributes.position.y,
      left: this.model.attributes.position.x
    });
    if(gplus.isLoggedIn()){
      if (this.$el.resizable("instance")) this.$el.resizable("destroy");
      this.$el.draggable({containment: "parent", stop: this.sectionModified.bind(this), drag: this.sectionDragged.bind(this)}).resizable({stop: this.sectionModified.bind(this)});
      this.$el.draggable( 'enable' );
      this.$el.find(".mapDeskGroup").draggable({containment: "parent", stop: this.deskGroupModified.bind(this)}).resizable();
      this.$el.find(".mapRoom").draggable({containment: "parent", stop: this.roomModified.bind(this)}).resizable({stop: this.roomModified.bind(this)});
      this.$el.find(".mapPlace").draggable({containment: "parent", stop: this.placeModified.bind(this)}).resizable({stop: this.placeModified.bind(this)});this.$el.find(".mapDesk").draggable({containment: "parent", stop: this.deskModified.bind(this)}).resizable({stop: this.deskModified.bind(this)});
    } else {
      // this.$el.draggable({});
      // this.$el.draggable( 'disable' );
    }
      
    this.$el.find(".mapDeskGroup").click(function(evt){
      pageState.mapSelectionClick = true;
      pageState.selectObject(this.model.attributes.deskGroups.findWhere({id:parseInt(evt.target.id.split("_")[2])}));
      evt.stopPropagation();
    }.bind(this));

    this.$el.find(".mapRoom").click(function(evt){
      pageState.mapSelectionClick = true;
      pageState.selectObject(this.model.attributes.rooms.findWhere({id:parseInt(evt.target.id.split("_")[2])}));
      evt.stopPropagation();
    }.bind(this));
    this.$el.find(".mapPlace").click(function(evt){
      pageState.mapSelectionClick = true;
      pageState.selectObject(this.model.attributes.places.findWhere({id:parseInt(evt.target.id.split("_")[2])}));
      evt.stopPropagation();
    }.bind(this));
    this.$el.find(".mapDesk").click(function(evt){
      var deskId = parseInt(evt.target.id.split("_")[2]);
      var deskGroupId = parseInt(evt.target.parentNode.id.split("_")[2]);
      var desk = this.model.attributes.deskGroups.findWhere({id:deskGroupId}).attributes.desks.findWhere({id:deskId});
      pageState.mapSelectionClick = true;
      pageState.selectObject(desk);
      evt.stopPropagation();
    }.bind(this));
    this.$el.find(".mapSectionAddButton").click(this.showCreateDialog.bind(this));
    this.$el.find(".mapDeskAddButton").click(this.createDesk.bind(this));
   
    return this;
  }
});
