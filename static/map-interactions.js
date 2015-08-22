var MapSectionView = Backbone.View.extend({
  tagName: "div",
  className: "section",
  initialize: function() {
   this.render();
  },

  template: _.template(
    "<div class='sectionName'><%= name %></div>" +
    "<% deskGroups.forEach(function(group){ %>" +
      "<%= (new MapDeskGroupView({model: group})).el.outerHTML %>" +
    "<% }); %>" +
    "<% rooms.forEach(function(room){ %>" +
      "<%= (new MapRoomView({model: room})).el.outerHTML %>" +
    "<% }); %>" +
    "<% places.forEach(function(place){ %>" +
      "<%= (new MapPlaceView({model: place})).el.outerHTML %>" +
    "<% }); %>"
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
  className: "deskGroup",
  initialize: function() {
    this.render();
  },
  template: _.template(
    "<% desks.forEach(function(desk){ %>" +
      "<%= (new MapDeskView({model: desk})).el.outerHTML %>" +
    "<% }); %>"
  ),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    this.$el.css({
      top: this.model.attributes.xy_position.y,
      left: this.model.attributes.xy_position.x,
    });
    return this;
  }
});

var MapDeskView = Backbone.View.extend({
  tagName: "div",
  className: "desk",
  initialize: function() {
    this.render();
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
  className: "room",
  initialize: function() {
    this.render();
  },
  template: _.template(
    ""
  ),
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

var MapPlaceView = Backbone.View.extend({
  tagName: "div",
  className: "place",
  initialize: function() {
    this.render();
  },
  template: _.template(
    ""
  ),
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

function renderInitialMap(initialMap) {
  $("#map_name").text(initialMap.attributes.name);
  var sections = initialMap.attributes.sections;
  sections.forEach(function(section){
    $("#map").prepend((new MapSectionView({model: section})).el);
  });
}