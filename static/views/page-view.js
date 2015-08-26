
var PageView = Backbone.View.extend({
  initialize: function(){
    this.renderCurrentMap()
    this.render();
    this.listenTo(pageState, 'change', this.render);
    this.listenTo(pageState, 'change:currentMapLoaded', this.renderCurrentMap);
    this.listenTo(pageState, 'change:currentMapId', this.renderCurrentMap);
    this.listenTo(pageState, 'change:selectedObject', this.highlightItem);
    this.listenTo(gplus, 'change', this.onGPlusChange);
    this.currentlyDisplayedMapId = -1;
  },

  renderCurrentMap: function() {
    console.log("Maybe rendering new map");
    if(pageState.get("currentMapLoaded")) {
      if(this.currentlyDisplayedMapId != this.model.get('currentMapId')) {
        this.$("#map-wrapper").html(new MapView({model:this.model.getCurrentMap()}).$el);
      }
    }
  },
  el: 'body',

  render: function() {

    return this;
  },
  // onGPlusChange: function() {
  //   $("#new_section_button").toggleClass("displayNone", !gplus.isCurrentUserAnAdmin());
  // },
});

function renderPageView(pState) {
  mapView = new PageView({model:pState});
}