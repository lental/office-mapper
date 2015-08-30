var ListBarSquishView = Backbone.View.extend({
  initialize: function(){
    this.listSquished = false;
    this.render();
  },

  el: '#list-squish',

  events: {
    "click .squishLeft": "squishListBar",
    "click #go-to-top": "scrollToTop",
    "click #go-to-rooms": "scrollToRooms",
    "change #filter-current-map-checkbox": "onFilterCurrentMapChanged",
  },
  scrollToTop: function(event) {
      console.log("hii");
      this.$("#scrollable-list").scrollTop( 0 );
  },

  scrollToRooms: function(event) {
    this.$("#room-list")[0].scrollIntoView()
  },

  squishListBar: function(event) {
    console.log("squishing");
    this.listSquished = !this.listSquished;
    this.render();
  },

  onFilterCurrentMapChanged: function(event) {
    listState.set("filterByCurrentMap", event.target.checked);
  },
  render: function() {
    this.$(".squishLeft").html(this.listSquished ? ">>" : "<<");
    this.$("#list-bar").toggleClass("squished", this.listSquished);
    return this;
  }
});
var renderListBarSquishView = function() {
  new ListBarSquishView();
};