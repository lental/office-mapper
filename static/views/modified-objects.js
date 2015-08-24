var ModifiedObjectsView = Backbone.View.extend({
  initialize: function(params){
    this.render();
    this.listenTo(pageState.get("modifiedObjects"), 'change', this.render);
    this.listenTo(pageState, 'change:[modifiedObjects]', this.render);
  },

  el: '#modified-objects-wrapper',

  events: {
    "click #modified-objects-save": "saveAll",
  },
  saveAll: function() {
    console.log("saving All Modified");
    pageState.get("modifiedObjects").forEach(function(i, o, set) {o.save()});
    pageState.trigger('change', pageState); //HACK 1 of the weekend: need to trigger to update everyone
  },


  template: _.template("<% modifiedObjects.forEach( function(i, o, set) { %>" +
       "<div><%= o.toSimpleString() %></div>" +
    "<% }); %> "),

  render: function() {
    this.$("#modified-objects").html(this.template({modifiedObjects: pageState.get("modifiedObjects")}));
    return this;
  }
});
var renderModifiedObjectsView = function() {
  new ModifiedObjectsView({pageState: pageState});
};