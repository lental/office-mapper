var MapListView = Backbone.View.extend({
  initialize: function(){
    this.initialRender();
    this.listenTo(pageState, 'change', this.render);
    this.listenTo(this.model, 'add', this.initialRender);
  },

  el: '#navigation-bar',
  
  initialRender: function() {
    this.$el.empty();
    this.model.each( _.bind(function(map) { 
      mapView = new MapEntryView({model: map});
      this.$el.append(mapView.$el);
    },this));
  },
  events: {
    "click .mapListElement": "onMapClick",
  },

  onMapClick: function(event) {
    element = event.currentTarget;
    console.log("map " + element.dataset.id + " click");
    pageState.selectMapId(element.dataset.id);
    pageState.selectObject(maps.getMap(element.dataset.id));
  },

  render: function() {
    return this;
  }
});
var renderMapSelecton = function() {
  new MapListView({model:maps, pageState: pageState});
};