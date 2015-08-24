var ModifiedObjectsView = Backbone.View.extend({
  initialize: function(params){
    this.render();
    this.listenTo(pageState.get("modifiedObjects"), 'change', this.render);
    this.listenTo(pageState, 'change', this.render);
  },

  el: '#modified-objects-wrapper',

  events: {
    "click #save-all": "saveAll",
  },
  saveAll: function() {
    console.log("saving All Modified");
    pageState.get("modifiedObjects").forEach(function(i, o, set) {o.save()});
  },


  template: _.template("<% modifiedObjects.forEach( function(i, o, set) { %>" +
       "<div><%= o.toSimpleString() %></div>" + //.getSimpleName()
    "<% }); %> "),

  render: function() {
    this.$("#modified-objects").html(this.template({modifiedObjects: pageState.get("modifiedObjects")}));
    return this;
  }
});
var renderModifiedObjectsView = function() {
  new ModifiedObjectsView({pageState: pageState});
};