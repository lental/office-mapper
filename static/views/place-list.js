var placeTemplate = _.template("<div class='placeListElement' data-id=<%= id%>>" +
  "<div class='place-name'>Name: <%= name %> </div>" +
  "</div>"
  ); 
                   
var PlaceListView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },

  el: '#place-list',

  events: {
    "click .placeListElement": "onPlaceClick",
  },

  onPlaceClick: function(event) {
    element = event.currentTarget;
    console.log("place " + element.dataset.id + " click");
    pageState.selectObject(places.getPlace(element.dataset.id));
  },

  template: _.template("<% places.each( function(place) { %> \
       <%= placeTemplate(place.attributes)%> \
        <br /> \
    <% }); %> "),

  render: function() {
    
    this.$el.html(this.template({places:this.model}));
    return this;
  }
});
var renderPlaces = function() {
  new PlaceListView({model:places});
};