var PlaceEntryView = Backbone.View.extend({
  initialize: function(){
    this.listenTo(this.model, 'change', this.initialRender);
    this.listenTo(listState, 'change:searchQuery', this.render);
    this.listenTo(listState, 'change:filterByCurrentMap', this.render);
    this.listenTo(pageState, 'change:selectedObject', this.render);
    this.map = maps.getMap(this.model.get('mapId'));
    this.listenTo(this.map, 'change', this.onMapChanged);
    this.initialRender();
    this.render();
  },

  initialRender: function() {
    this.$el.html(this.template({
      place:this.model,
      mapName: this.model.get('mapId') ? maps.getMap(this.model.get('mapId')).get('name') : 'No Assigned Desk'
    }));
  },

  id: function() {return "list_place_" + this.model.attributes.id;},
  tagName: "div",
  className: "listElement placeListElement clickable",

  events: {
    "click ": "onPlaceClick"
  },

  onPlaceClick: function(event) {
    element = event.currentTarget;
    console.log("place " + element.dataset.id + " click");
    pageState.selectObject(this.model);
  },

  onMapChanged: function() {
    this.$(".placeDesk").html(this.map.get("name"));
  },

  template: _.template("" +
  "<div class='placeName'><%= place.get('name') %> </div>" +
  "<div class='placeDescription'><%= place.get('description') %> </div>" +
  "<div class='placeDesk'><%= mapName %> </div>" +
  ""),

  render: function() {
    var selectedPlace = pageState.get('selectedObject')

    var isSelected = this.model == selectedPlace;
    var matchesSearchQuery = this.model.searchMatches(listState.get('searchQuery'));
    var isCurrentMapShowing = !listState.get('filterByCurrentMap') || this.model.get('mapId') == pageState.get('currentMapId');

    var shouldShow = isSelected || (matchesSearchQuery && isCurrentMapShowing)
    this.$el.toggleClass("displayNone", !shouldShow);
    this.$el.toggleClass("active", isSelected);
    if(isSelected) {
      var element = this.$el;
      if (isChildPartiallyOutsideOfParent(element[0], $("#scrollable-list")[0])) {
        element[0].scrollIntoView();
      }
    }

    return this;
  }
});