var placeTemplate = _.template("<div class='listElement placeListElement<%= isSelected ? ' active': '' %>' data-id=<%= id%>>" +
  "<div class='placeName'><%= name %> </div>" +
  "<div class='placeDescription'><%= description %> </div>" +
  "</div>"
  );

var PlaceListView = Backbone.View.extend({
  initialize: function(){
    this.hiding = false;
    this.listenTo(pageState, 'change', this.render);
    this.render();
  },

  el: '#places-section',

  events: {
    "click .placeListElement": "onPlaceClick",
    "click #places-title": "hideShowPlaces",
    "mouseenter .listBarTitle"  : "showHideButton",
    "mouseleave .listBarTitle"  : "hideHideButton"
  },

  hideHideButton: function(event) {
    this.$('.listHideButton').removeClass("visible");
  },
  showHideButton: function(event) {
    this.$('.listHideButton').addClass("visible");
  },

  hideShowPlaces: function(event) {
    this.hiding = !this.hiding;
    this.render();
  },
  onPlaceClick: function(event) {
    element = event.currentTarget;
    console.log("place " + element.dataset.id + " click");
    pageState.selectObject(places.getPlace(element.dataset.id));
  },

  template: _.template("<% places.each( function(place) { %>" +
       "<% var isSelected = place == pageState.get('selectedObject') %>" +
       "<% if (isSelected || place.searchMatches(pageState.get('searchQuery'))) { %>" +
       "<% place.attributes.isSelected = isSelected %>" +
       "<%= placeTemplate(place.attributes)%>" +
    "<% }}); %> "),

  render: function() {
    this.$('.listHideButton').html(this.hiding ? "Show" : "Hide");
    this.$('#place-list').toggleClass("hiddenList", this.hiding);
    this.$("#place-list").html(this.template({places:this.model}));
    var selectedObject = pageState.get('selectedObject');

    if (!this.hiding) {
      if (selectedObject instanceof Place) {
        var element = this.$('#place-list .listElement[data-id='+selectedObject.get('id')+']');
        if (isChildPartiallyOutsideOfParent(element[0], $("#scrollable-list")[0])) {
          element[0].scrollIntoView();
        }
      }
    }
    return this;
  }
});
var renderPlaces = function() {
  new PlaceListView({model:places, pageState: pageState});
};