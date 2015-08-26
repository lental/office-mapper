var ListBarSquishView = Backbone.View.extend({
  initialize: function(){
    this.listSquished = false;
    this.render();
  },

  el: '#list-squish',

  events: {
    "click .squishLeft": "squishListBar",
    "click #go-to-top": "scrollToTop",
    "click #go-to-rooms": "scrollToRooms"
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
  render: function() {
    this.$(".squishLeft").html(this.listSquished ? ">>" : "<<");
    this.$("#list-bar").toggleClass("squished", this.listSquished);
    return this;
  }
});
var renderListBarSquishView = function() {
  new ListBarSquishView();
};