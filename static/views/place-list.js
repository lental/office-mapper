var PlaceListView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(listState, 'change', this.render);
    this.listenTo(this.model, 'add', this.onAdd);
    this.hiding = false;
    this.initialRender();
    this.render();
  },

  el: '#places-section',
  
  initialRender: function() {
    this.$('#place-list').empty();
    places.each( function(place) { 
      placeView = new PlaceEntryView({model: place});
      this.$('#place-list').append(placeView.$el);
    });
  },

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

  render: function() {
    this.$('.listHideButton').html(this.hiding ? "Show" : "Hide");
    this.$('#place-list').toggleClass("hiddenList", this.hiding);

    return this;
  }
});

var renderPlaces = function() {
  new PlaceListView({model:places, pageState: pageState});
};