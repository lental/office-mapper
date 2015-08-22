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
      "<%= (new MapDeskGroupView({model: group})).el.outerHTML %>" +
    "<% }); %>" +
    "<% rooms.forEach(function(room){ %>" +
      "<%= (new MapRoomView({model: room})).el.outerHTML %>" +
    "<% }); %>" +
    "<% places.forEach(function(place){ %>" +
      "<%= (new MapPlaceView({model: place})).el.outerHTML %>" +
    "<% }); %>" +
    "<div class='mapSectionAddButton shadowed'>+</div>"
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

var MapDeskGroupView = Backbone.View.extend({
  tagName: "div",
  className: "mapDeskGroup shadowed",
  initialize: function() {
    this.render();
    this.listenTo(pageState, 'change', this.render);
  },
  template: _.template(
    "<% desks.forEach(function(desk){ %>" +
      "<%= (new MapDeskView({model: desk})).el.outerHTML %>" +
    "<% }); %>" +
    "<div class='mapDeskAddButton shadowed'>+</div>"
  ),
  render: function() {
    var maxX = 0;
    var maxY = 0;
    var maxWidth = 0;
    var maxHeight = 0;
    this.model.attributes.desks.forEach(function(desk){
      maxX = Math.max(maxX, desk.attributes.position.x);
      maxY = Math.max(maxX, desk.attributes.position.y);
      maxWidth = Math.max(maxX, desk.attributes.position.w);
      maxHeight = Math.max(maxX, desk.attributes.position.h);
    });
    this.$el.html(this.template(this.model.attributes));
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
    return this;
  }
});

function renderInitialMap(initialMap) {
  $("#map_name").text(initialMap.attributes.name);
  var sections = initialMap.attributes.sections;
  sections.forEach(function(section){
    $("#map").prepend((new MapSectionView({model: section})).el);
  });
}