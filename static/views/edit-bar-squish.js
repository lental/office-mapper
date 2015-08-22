var EditBarSquishView = Backbone.View.extend({
  initialize: function(){
    this.editSquished = false;
    this.render();
  },

  el: '#edit-squish',

  events: {
    "click .squishRight": "squishRightBar",
  },

  squishRightBar: function(event) {
    console.log("squishing Right");
    this.editSquished = !this.editSquished;
    this.render();
  },
  render: function() {
    this.$("#edit-bar").toggleClass("squished", this.editSquished);
    return this;
  }
});
var renderEditBarSquishView = function() {
  new EditBarSquishView();
};