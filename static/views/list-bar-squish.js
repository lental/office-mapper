var ListBarSquishView = Backbone.View.extend({
  initialize: function(){
    this.listSquished = false;
    this.render();
  },

  el: '#list-squish',

  events: {
    "click .squishLeft": "squishListBar",
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