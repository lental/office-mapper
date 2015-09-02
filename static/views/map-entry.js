var MapEntryView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.model, 'change', this.initialRender);
    this.listenTo(pageState, 'change:selectedObject', this.render);
    this.listenTo(pageState, 'change:currentMapId', this.render);
    this.initialRender();
    this.render();
  },

  initialRender: function() {
    this.$el.html(this.template({
      map:this.model
    }));
  },

  id: function() {return "list_map_" + this.model.attributes.id;},
  tagName: "div",
  className: "mapListElement clickable",

  events: {
    "click ": "onMapClick"
  },

  onMapClick: function(event) {
    element = event.currentTarget;
    console.log("map " + element.dataset.id + " click");
    pageState.selectMapId(this.model.get('id'));
    pageState.selectObject(this.model);
  },

  template: _.template("" +
  "<div class='mapName'><%= map.get('name') %></div>" +
  ""),

  render: function() {
    var selectedObject = pageState.get('selectedObject')
    var isCurrentMapShowing = this.model.get('id') == pageState.get('currentMapId');
    this.$el.toggleClass("active", isCurrentMapShowing);
    return this;
  }
});