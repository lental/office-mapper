var MapSectionView = Backbone.View.extend({
  tagName: "div",
  className: "section",
  initialize: function() {
   this.render(); 
  },
  template: _.template("<div class='sectionName'><%= name %></div>" + 
                       "<% deskGroups.forEach(function(group){ %>" +
                        " <%= (new MapDeskGroupView({model: group})).el.outerHTML %>" +
                       "<% }); %>"),
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
  "tagName": "div",
  "className": "deskGroup",
  initialize: function() {
    console.log("foobar");
    this.render();
  },
  render: function() {
    this.$el.css({
      top: this.model.attributes.xy_position.y,
      left: this.model.attributes.xy_position.x,
    });
    return this;
  }
});

function renderInitialMap() {
  console.log("Maps ready!");
  var defaultMap = maps.first();
  $("#map_name").text(defaultMap.attributes.name);
  var sections = defaultMap.attributes.sections;
  sections.forEach(function(section){
    $("#map").prepend((new MapSectionView({model: section})).el);
  });
}