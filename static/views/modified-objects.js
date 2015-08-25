var ModifiedObjectsView = Backbone.View.extend({
  initialize: function(params){
    this.render();
    this.listenTo(pageState.get("modifiedObjects"), 'change', this.render);
    this.listenTo(pageState, 'change:[modifiedObjects]', this.render);
  },

  el: '#modified-objects-wrapper',

  events: {
    "click #modified-objects-save": "saveAll",
    "click #modified-objects-reset": "resetAll",
    "click .modifiedObject": "selectModifiedObject",
  },

  selectModifiedObject: function(event) {
    pageState.selectObject(pageState.get("modifiedObjects").getObjectByCId(event.target.dataset.cid));
  },

  saveAll: function() {
    console.log("saving All Modified");
    pageState.get("modifiedObjects").each(function(i,o) {o.save()});
    pageState.trigger('change', pageState); //HACK 1 of the weekend: need to trigger to update everyone
  },

  resetAll: function() {
    console.log("resetting All Modified");
    pageState.get("modifiedObjects").each(function(i,o) {o.fetch()});
    pageState.trigger('change', pageState); //HACK 1 of the weekend: need to trigger to update everyone
  },
  objectTemplate: _.template("<div class='modifiedObject' data-cid='<%=o.cid%>' data-modeltype='<%=o.modelType%>'><%= o.toSimpleString() %></div>"),

  render: function() {
    this.$("#modified-objects").empty();
    var objectList = this.$("#modified-objects");
    pageState.get("modifiedObjects").each( _.bind(function(i,o) { 
      objectList.append(this.objectTemplate({o:o}));
    },this));
    return this;
  }
});
var renderModifiedObjectsView = function() {
  new ModifiedObjectsView({pageState: pageState});
};