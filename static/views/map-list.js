var mapTemplate = _.template("<div class='mapListElement' data-id=<%= id%>>" +
  "<div class='mapName'>Map: <%= name %> </div>" +
  "</div>"
  ); 
                   
var MapListView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },

  el: '#navigation-bar',

  events: {
    "click .mapListElement": "onMapClick",
  },

  onMapClick: function(event) {
    element = event.currentTarget;
    console.log("map " + element.dataset.id + " click");
  },

  template: _.template("<% maps.each( function(map) { %> \
       <%= mapTemplate(map.attributes)%> \
    <% }); %> "),

  render: function() {
    
    this.$el.html(this.template({maps:this.model}));
    return this;
  }
});
var renderMapSelecton = function() {
  new MapListView({model:maps});
};