var MapListView = Backbone.View.extend({
  initialize: function(){
    this.initialRender();
    this.listenTo(pageState, 'change', this.render);
    this.listenTo(this.model, 'add', this.initialRender);
    this.listenTo(gplus, 'change', this.onGPlusChange);
  },

  el: '#navigation-bar',
  
  initialRender: function() {
    this.$el.empty();
    this.model.each( _.bind(function(map) { 
      mapView = new MapEntryView({model: map});
      this.$el.append(mapView.$el);
    },this));
    this.$el.append(this.addMapTemplate());
    this.onGPlusChange();
  },
  events: {
    "click #add-new-map": "onNewMapClick",
  },

  onNewMapClick: function() {
    this.model.create({
        wait:true,
        name:"New Map"});
  },

  addMapTemplate: _.template("<div id='add-new-map' class='addMapButton'>Add New Map</div>"),

  onMapClick: function(event) {
    element = event.currentTarget;
    console.log("map " + element.dataset.id + " click");
    pageState.selectMapId(element.dataset.id);
    pageState.selectObject(maps.getMap(element.dataset.id));
  },

  onGPlusChange: function() {
    this.$("#add-new-map").toggleClass("displayNone", !gplus.isCurrentUserAnAdmin());
  },
  render: function() {
    return this;
  }
});
var renderMapSelecton = function() {
  new MapListView({model:maps, pageState: pageState});
};