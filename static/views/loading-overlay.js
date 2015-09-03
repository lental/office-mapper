
var LoadingOverlayView = Backbone.View.extend({
  initialize: function(){
    this.render();
    this.listenTo(pageState, 'change:currentMapLoaded', this.onCurrentMapLoaded);
    this.listenTo(pageState, 'change:mapsLoaded', this.onMapsLoaded);
    this.listenTo(pageState, 'change:usersLoaded', this.onUsersLoaded);
    this.listenTo(pageState, 'change:roomsLoaded', this.onRoomsLoaded);
    this.listenTo(pageState, 'change:placesLoaded', this.onPlacesLoaded);
    this.listenTo(pageState, 'change:gplusLoaded', this.onGplusLoaded);
    this.$("#loading-info").removeClass("invisible");
  },

  el: '#loading-overlay',


  checkIfDataModelLoaded: function() {
    if(pageState.isDataModelLoaded() && pageState.get("currentMapLoaded")) {
      this.$el.addClass("invisible");
    }
    return this;
  },

  onCurrentMapLoaded: function() {
    this.$("#first-map-loaded .loadingStatus").html("Done");
    this.checkIfDataModelLoaded();
  },

  onMapsLoaded: function() {
    this.$("#maps-loaded .loadingStatus").html("Done");
    this.checkIfDataModelLoaded();
  },

  onUsersLoaded: function() {
    this.$("#users-loaded .loadingStatus").html("Done");
    this.checkIfDataModelLoaded();
  },

  onRoomsLoaded: function() {
    this.$("#rooms-loaded .loadingStatus").html("Done");
    this.checkIfDataModelLoaded();
  },

  onPlacesLoaded: function() {
    this.$("#places-loaded .loadingStatus").html("Done");
    this.checkIfDataModelLoaded();
  },

  onGplusLoaded: function() {
    this.$("#gplus-loaded .loadingStatus").html("Done");
    this.checkIfDataModelLoaded();
  },
});

function renderLoadingOverlayView(pState) {
  new LoadingOverlayView({model:pState});
}