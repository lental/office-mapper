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
    this.$el.append("<div class='mapSectionAddButton clickable displayNone shadowed'>+</div>");
    this.$el.find(".mapSectionAddButton").click(this.showCreateDialog.bind(this));

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
          position: {x: 10, y:10, h: 100, w: 100},
          mapId: pageState.attributes.currentMapId,
          sectionId: this.model.attributes.id
        }, 
        { success: _.bind(function(model){
            this.$el.append(new MapRoomView({model:model}).el);
            rooms.add(model);
            pageState.mapSelectionClick = false;
            pageState.selectObject(model);
          },this)
        }
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
          position: {x: 10, y:10, h: 100, w: 100},
          mapId: pageState.attributes.currentMapId,
          sectionId: this.model.attributes.id
        }, {success: _.bind(function(model){
            this.$el.append(new MapPlaceView({model:model}).el)
            places.add(model);
            pageState.mapSelectionClick = false;
            pageState.selectObject(model);
          },this)
        }
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
          xyPosition: {x: 10, y:10},
          mapId: pageState.attributes.currentMapId,
          sectionId: this.model.attributes.id,
          desks: new Desks()
        },{success: _.bind(function(model){
            this.$el.append(new MapDeskGroupView({model:model}).el)
            pageState.mapSelectionClick = false;
            pageState.selectObject(model);
          },this)
        }
      );
    // new MapDeskGroupView({model: newDeskGroup});
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
    this.$el.parent().append(this.$el);
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
    if(gplus.isCurrentUserAnAdmin()){
        this.$el
        .draggable({containment: "parent", stop: this.sectionModified.bind(this), drag: this.sectionDragged.bind(this)})
        .resizable({stop: this.sectionModified.bind(this)});
        this.$(".mapSectionAddButton").removeClass("displayNone");
      }
      else{ 
        if (this.$el.resizable("instance")) this.$el.resizable("destroy");
        if (this.$el.draggable("instance")) this.$el.draggable("destroy");
        this.$(".mapSectionAddButton").addClass("displayNone");
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
