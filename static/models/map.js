Map = Backbone.Model.extend({
    defaults: {
        allMapDesks: null
    },
    parse : function (response) {
        this.set('allMapDesks', new Desks());
        // Can come in from either maps:[{}] or map:{}
        if (response.map) {
            response = response.map;
        }
        if (response.sections) {
            response.sections = new Sections(response.sections, {parse: true, allMapDesks: this.get("allMapDesks")});
        }
        return response;
    },
    isFullyLoaded : function() {
        return this.get("sections");
    },
    getDeskById: function(deskId) {
      return this.get("allMapDesks").findWhere({"id": deskId});
    }
});

Maps = Backbone.Collection.extend({
    model: Map,
    getMap : function(id) {
        return this.get({"id":id});
    },
    parse : function(response){
        return response.maps;
    }
});
