var placeTemplate = _.template("<div class='placeListElement <%= isSelected ? 'active': '' %>' data-id=<%= id%>>" +
  "<div class='placeName'><%= name %> </div>" +
  "<div class='placeDescription'><%= description %> </div>" +
  "</div>"
  );

var PlaceListView = Backbone.View.extend({
  initialize: function(){
    this.render();
    this.listenTo(pageState, 'change', this.render);
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
       <% place.attributes.isSelected = place == pageState.get('selectedObject') %> \
       <%= placeTemplate(place.attributes)%> \
    <% }); %> "),

  render: function() {

    this.$el.html(this.template({places:this.model}));
    return this;
  }
});
var renderPlaces = function() {
  new PlaceListView({model:places, pageState: pageState});
};