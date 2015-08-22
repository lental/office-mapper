var mapTemplate = _.template("<div class='mapListElement <%= isSelected ? 'active': '' %>' data-id=<%= id %>>" +
  "<div class='mapName'>Map: <%= name %> </div>" +
  "</div>"
  ); 
                   
var MapListView = Backbone.View.extend({
  initialize: function(){
    this.render();
    this.listenTo(pageState, 'change', this.render);
  },

  el: '#navigation-bar',

  events: {
    "click .mapListElement": "onMapClick",
  },

  onMapClick: function(event) {
    element = event.currentTarget;
    console.log("map " + element.dataset.id + " click");
    pageState.selectMapId(element.dataset.id);
    pageState.selectObject(null);
  },

  template: _.template("<% maps.each( function(map) { %> \
       <% map.attributes.isSelected = currentMapId == map.id %> \
       <%= mapTemplate(map.attributes) %> \
    <% }); %> "),

  render: function() {
    console.log("re-rednering map");
    this.$el.html(this.template({maps:this.model, currentMapId:pageState.get("currentMapId")}));
    return this;
  }
});
var renderMapSelecton = function() {
  new MapListView({model:maps, pageState: pageState});
};