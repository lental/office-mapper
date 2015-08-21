$(document).ready(function(){
  var GPlusButtonView = Backbone.View.extend({
    initialize: function(){
      this.render();
    },

    el: '#edit-bar',

    render: function() {
        
      this.$el.html("<div class='g-signin2' data-onsuccess='onSignIn'></div>");
      return this;
    }
  });

  new GPlusButtonView({model:places});
});