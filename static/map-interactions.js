var MapSectionView = Backbone.View.extend({
  tagName: "div",
  className: "mapSection shadowed",
  initialize: function() {
    this.render();
    this.listenTo(pageState, 'change', this.render);
  },

  template: _.template(
    "<div class='mapSectionName'><%= name %></div>" +
    "<% deskGroups.forEach(function(group){ %>" +
      "<%= group.el.outerHTML %>" +
    "<% }); %>" +
    "<% rooms.forEach(function(room){ %>" +
      "<%= room.el.outerHTML %>" +
    "<% }); %>" +
    "<% places.forEach(function(place){ %>" +
      "<%= place.el.outerHTML %>" +
    "<% }); %>" +
    "<div class='mapSectionAddButton shadowed clickable'>+</div>"
  ),

  render: function() {
    var deskGroups = [];
    this.model.attributes.deskGroups.forEach(function(group){
      deskGroups.push(new MapDeskGroupView({model: group}));
    });

    var rooms = [];
    this.model.attributes.rooms.forEach(function(room){
      rooms.push(new MapRoomView({model: room}));
    });

    var places = [];
    this.model.attributes.places.forEach(function(place){
      places.push(new MapPlaceView({model: place}));
    });

    this.$el.html(this.template({rooms: rooms, places:places , deskGroups: deskGroups}));
    this.$el.css({
      height: this.model.attributes.position.h,
      width: this.model.attributes.position.w,
      top: this.model.attributes.position.y,
      left: this.model.attributes.position.x
    });
    this.$el.draggable({containment: "parent"}).resizable();
    this.$el.find(".mapDeskGroup").draggable({containment: "parent"}).resizable();
    this.$el.find(".mapRoom").draggable({containment: "parent"}).resizable();
    this.$el.find(".mapPlace").draggable({containment: "parent"}).resizable();
    this.$el.find(".mapDesk").draggable({containment: "parent"}).resizable();
    return this;
  }
});

var MapDeskGroupView = Backbone.View.extend({
  tagName: "div",
  className: "mapDeskGroup shadowed",
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
      maxX = Math.max(maxX, desk.attributes.position.x);
      maxY = Math.max(maxX, desk.attributes.position.y);
      maxWidth = Math.max(maxX, desk.attributes.position.w);
      maxHeight = Math.max(maxX, desk.attributes.position.h);
      desks.push(new MapDeskView({model: desk}));
    });

    this.$el.html(this.template({desks: desks}));
    this.$el.css({
      top: this.model.attributes.xyPosition.y,
      left: this.model.attributes.xyPosition.x,
      height: (maxY + maxHeight + 5) + "px",
      width: (maxX + maxWidth + 5) + "px",
    });
    return this;
  }
});

var MapDeskView = Backbone.View.extend({
  tagName: "div",
  className: "mapDesk shadowed",
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
  },

  el: '#map',

  render: function() {
    if(pageState.get("currentMapLoaded")) {
      var curMap = this.model.getCurrentMap()
      this.$("#map_name").text(curMap.attributes.name);

      var sections = curMap.attributes.sections;
      sections.forEach(function(section){
        $("#map").prepend((new MapSectionView({model: section})).el);
      });
    }
    else
    {
      this.$("#map_name").text("loading...");
    }
    return this;
  }
});

function renderMapView(pState) {
  new MapView({model:pState});
}