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
    pageState.selectObject(maps.getMap(element.dataset.id));
  },

  template: _.template("<% maps.each( function(map) { %> \
       <% map.attributes.isSelected = currentMapId == map.id %> \
       <%= mapTemplate(map.attributes) %> \
    <% }); %> "),

  render: function() {
    this.$el.html(this.template({maps:this.model, currentMapId:pageState.get("currentMapId")}));
    return this;
  }
});
var renderMapSelecton = function() {
  new MapListView({model:maps, pageState: pageState});
};