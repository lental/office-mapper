ListState =  Backbone.Model.extend({
    defaults: {
      searchQuery: '',
      filterBy: 'currentMap', // all, unassigned

    },
    modelType: "ListState",

    changeSearch: function(search) {
        console.log("searchChanged: " + search);
        this.set({searchQuery: search});
    },

  satisfiesFilter: function(model) {
    switch(this.get('filterBy')) {
    case "currentMap":
        return model.get('mapId') == pageState.get('currentMapId');
        break;
    case "all":
        return true;
        break;
    case "unassigned":
        return maps.getMap(model.get('mapId')) == null;
        break;
    default:
        console.log("WARNING: unexpected filter")
    }
    return false
  }

});