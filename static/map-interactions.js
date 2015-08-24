var MapSectionView = Backbone.View.extend({
  tagName: "div",
  className: "mapSection shadowed",
  showingCreateDialog: false,
  initialize: function() {
    this.render();
    this.listenTo(pageState, 'change', this.render);
  },
  events: {
    "click ": "onClick"
  },
  onClick: function(){
    pageState.mapSelectionClick = true;
    pageState.selectObject(this.model);
  },
  template: _.template(
    "<div class='mapSectionName'><%= attributes.name %></div>" +
    "<% deskGroups.forEach(function(group){ %>" +
      "<%= group.el.outerHTML %>" +
    "<% }); %>" +
    "<% rooms.forEach(function(room){ %>" +
      "<%= room.el.outerHTML %>" +
    "<% }); %>" +
    "<% places.forEach(function(place){ %>" +
      "<%= place.el.outerHTML %>" +
    "<% }); %>" +
    "<div class='mapSectionAddButton clickable shadowed'>+</div>"
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
    this.render();
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
    this.render();
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
    this.render();
  },

  createDesk: function(evt) {
    var deskGroupId = parseInt(evt.target.parentNode.id.split("_")[2]);
    var clickedDeskGroup = this.model.attributes.deskGroups.get(deskGroupId);
    var newDesk = clickedDeskGroup.attributes.desks.create({
      deskGroupId: deskGroupId,
      position: {x:0, y:0, h:20, w:20},
      rotation: 0
    });
    new MapDeskView({model: newDesk});
    this.render();
  },

  deskGroupModified: function(evt) {
    var deskGroupId = parseInt(evt.target.id.split("_")[2]);
    var deskGroup = this.model.attributes.deskGroups.get(deskGroupId);
    this.updatePageStateAfterModification(deskGroup,{
      position: {
        x: parseInt(evt.target.style.left),
        y: parseInt(evt.target.style.top),
        w: parseInt(evt.target.style.width),
        h: parseInt(evt.target.style.height)
      }});
  },

  deskModified: function(evt) {
    var deskId = parseInt(evt.target.id.split("_")[2]);
    var deskGroupId = parseInt(evt.target.parentNode.id.split("_")[2]);
    var desk = this.model.attributes.deskGroups.get(deskGroupId).attributes.desks.get(deskId);
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
    var room = this.model.attributes.rooms.get(roomId);
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
    var place = this.model.attributes.places.get(placeId);
    this.updatePageStateAfterModification(place,{
      position: {
        x: parseInt(evt.target.style.left),
        y: parseInt(evt.target.style.top),
        w: parseInt(evt.target.style.width),
        h: parseInt(evt.target.style.height)
      }});
  },

  sectionModified: function(evt) {
    this.updatePageStateAfterModification(place,{
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
    console.log("map width: ", map.width());
    console.log("section width: ", (section.style.left + section.style.width));
    if (map.width() - (parseInt(section.style.left) + parseInt(section.style.width)) < 100) {
      console.log("widening map");
      map.width(map.width() + 200);
    }
    if (map.height() - (section.style.top + section.style.height) < 100) {
      console.log("heightening map");
      map.width(map.width() + 200);
    }
  },

  sectionDragged: function(evt) {
    var map = $("#map");
    var section = evt.target;
    console.log("map width: ", map.width());
    console.log("section width: ", (section.style.left + section.style.width));
    if (map.width() - (parseInt(section.style.left) + parseInt(section.style.width)) < 100) {
      console.log("widening map");
      map.width(map.width() + 200);
    }
    if (map.height() - (section.style.top + section.style.height) < 100) {
      console.log("heightening map");
      map.width(map.width() + 200);
    }
  },

  render: function() {
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

    this.$el.html(this.template({attributes: this.model.attributes,
      rooms: localRooms, places: localPlaces , deskGroups: localDeskGroups}));
    this.$el.css({
      height: this.model.attributes.position.h,
      width: this.model.attributes.position.w,
      top: this.model.attributes.position.y,
      left: this.model.attributes.position.x
    });
    if (this.$el.resizable("instance")) this.$el.resizable("destroy");
    this.$el.draggable({containment: "parent", stop: this.sectionModified.bind(this), drag: this.sectionDragged.bind(this)}).resizable({stop: this.sectionModified.bind(this)});
    this.$el.find(".mapDeskGroup").draggable({containment: "parent", stop: this.deskGroupModified.bind(this)}).resizable();
    this.$el.find(".mapRoom").draggable({containment: "parent", stop: this.roomModified.bind(this)}).resizable({stop: this.roomModified.bind(this)});
    this.$el.find(".mapRoom").click(function(evt){
      pageState.mapSelectionClick = true;
      pageState.selectObject(this.model.attributes.rooms.get(parseInt(evt.target.id.split("_")[2])));
      evt.stopPropagation();
    }.bind(this));
    this.$el.find(".mapPlace").draggable({containment: "parent", stop: this.placeModified.bind(this)}).resizable({stop: this.placeModified.bind(this)});
    this.$el.find(".mapPlace").click(function(evt){
      pageState.mapSelectionClick = true;
      pageState.selectObject(this.model.attributes.places.get(parseInt(evt.target.id.split("_")[2])));
      evt.stopPropagation();
    }.bind(this));
    this.$el.find(".mapDesk").draggable({containment: "parent", stop: this.deskModified.bind(this)}).resizable({stop: this.deskModified.bind(this)});
    this.$el.find(".mapDesk").click(function(evt){
      var deskId = parseInt(evt.target.id.split("_")[2]);
      var deskGroupId = parseInt(evt.target.parentNode.id.split("_")[2]);
      var desk = this.model.attributes.deskGroups.get(deskGroupId).attributes.desks.get(deskId);
      pageState.mapSelectionClick = true;
      pageState.selectObject(desk);
      evt.stopPropagation();
    }.bind(this));
    this.$el.find(".mapSectionAddButton").click(this.showCreateDialog.bind(this));
    this.$el.find(".mapDeskAddButton").click(this.createDesk.bind(this));
    return this;
  }
});

var MapDeskGroupView = Backbone.View.extend({
  tagName: "div",
  className: "mapDeskGroup shadowed",
  id: function() {return "map_deskgroup_" + this.model.attributes.id},
  initialize: function() {
    this.render();
    this.listenTo(pageState, 'change', this.render);
  },
  template: _.template(
    "<% desks.forEach(function(desk){ %>" +
      "<%= desk.el.outerHTML %>" +
    "<% }); %>" +
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
    this.$el.css({
      top: this.model.attributes.xyPosition.y,
      left: this.model.attributes.xyPosition.x,
      height: (maxY + maxHeight + 5) + "px",
      width: (maxX + maxWidth + 30) + "px",
    });
    return this;
  }
});

var MapDeskView = Backbone.View.extend({
  tagName: "div",
  className: "mapDesk shadowed",
  id: function() {return "map_desk_" + this.model.attributes.id;},
  initialize: function() {
    this.render();
    this.listenTo(pageState, 'change', this.render);
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

var MapRoomView = Backbone.View.extend({
  tagName: "div",
  className: "mapRoom shadowed",
  id: function() {return "map_room_" + this.model.id},
  initialize: function() {
    this.render();
    this.listenTo(pageState, 'change', this.render);
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
    return this;
  }
});

var MapPlaceView = Backbone.View.extend({
  tagName: "div",
  id: function() {return "map_place_" + this.model.id},
  className: "mapPlace shadowed",
  initialize: function() {
    this.render();
    this.listenTo(pageState, 'change', this.render);
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
    this.$el.click(function(){alert("bar");});
    return this;
  }
});

var MapView = Backbone.View.extend({
  initialize: function(){
    this.render();
    this.listenTo(pageState, 'change', this.render);
    this.listenTo(pageState, 'change', setTimeout.bind(window, this.highlightItem, 1));
    this.currentlyDisplayedMapId = -1;
  },

  el: '#map',

  highlightItem: function(pState) {
    var classToAdd = "mapSelectedItem";
    if (!pState.mapSelectionClick) {
      classToAdd += " mapAnimateSelectedItem";
    }
    pState.mapSelectionClick = false;

    if (pState.attributes.selectedObject instanceof Place) {
      $("#map_place_" + pState.attributes.selectedObject.attributes.id).addClass(classToAdd);
    }
    if (pState.attributes.selectedObject instanceof Room) {
      $("#map_room_" + pState.attributes.selectedObject.attributes.id).addClass(classToAdd);
    }
    if (pState.attributes.selectedObject instanceof DeskGroup) {
      $("#map_deskgroup_" + pState.attributes.selectedObject.attributes.id).addClass(classToAdd);
    }
    if (pState.attributes.selectedObject instanceof Desk) {
      $("#map_desk_" + pState.attributes.selectedObject.attributes.id).addClass(classToAdd);
    }
    if (pState.attributes.selectedObject instanceof User) {
      $("#map_desk_" + pState.attributes.selectedObject.attributes.deskId).addClass(classToAdd);
    }
  },

  render: function() {
    if(pageState.get("currentMapLoaded")) {
      if(this.currentlyDisplayedMapId != this.model.get('currentMapId')) {
        console.log("rendering new map");
        this.listenTo(this.model.getCurrentMap().attributes.sections, 'change', this.render);
        this.currentlyDisplayedMapId = this.model.get('currentMapId')
        $("#map").empty();
        $("#map").append("<div id='new_section_button' class='shadowed clickable'>+</div>");
        var curMap = this.model.getCurrentMap()
        this.$("#map_name").text(curMap.attributes.name);
        var sections = curMap.attributes.sections;
        var maxX = 0;
        var maxWidth = 0;
        var maxY = 0;
        var maxHeight = 0;
        sections.forEach(function(section){
          if (section.attributes.position.x > maxX) {
            maxX = section.attributes.position.x;
            maxWidth = section.attributes.position.w;
          }
          if (section.attributes.position.y > maxY) {
            maxY = section.attributes.position.y;
            maxHeight = section.attributes.position.h;
          }
          $("#map").prepend((new MapSectionView({model: section})).el);
        });
        //$("#map").css({width: (maxX+maxWidth+100) + "px", height: (maxY+maxHeight+100) + "px"});
        $("#new_section_button").css({left: ($("#map")[0].scrollWidth - 80)+"px"});
        $("#new_section_button").click(function(){
          var newSection = this.model.getCurrentMap().attributes.sections.create({map_id: this.model.attributes.currentMapId,
            name: "New Section",
            position: {x: 0, y: 0, w: 200, h: 200},
            deskGroups: new DeskGroups([]),
            places: new Places([]),
            rooms: new Rooms([])
          });
          $("#map").prepend((new MapSectionView({model: newSection})).el);
        }.bind(this));
      }
    }
    else
    {
      this.$("#map_name").text("loading...");
    }
    return this;
  }
});

function renderMapView(pState) {
  mapView = new MapView({model:pState});
}