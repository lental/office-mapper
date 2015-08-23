Map = Backbone.Model.extend({
    parse : function (response) {
        // Can come in from either maps:[{}] or map:{}
        if (response.map) {
            response = response.map;
        }
        if (response.sections) {
            response.sections = new Sections(response.sections, {parse: true});
        }
        return response;
    },
    isFullyLoaded : function() {
        return this.get("sections");
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
