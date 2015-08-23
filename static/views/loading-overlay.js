
var LoadingOverlayView = Backbone.View.extend({
  initialize: function(){
    this.render();
    this.listenTo(pageState, 'change', this.render);
    this.$("#loading-logo-img").removeClass("invisible");
  },

  el: '#loading-overlay',

  render: function() {
    if(pageState.isDataModelLoaded() && pageState.get("currentMapLoaded")) {
      this.$el.addClass("invisible");
    }
    // else
    // {
    //   this.$("#map_name").text("loading...");
    // }
    return this;
  }
});

function renderLoadingOverlayView(pState) {
  new LoadingOverlayView({model:pState});
}