ListState =  Backbone.Model.extend({
    defaults: {
      searchQuery: '',
      filterByCurrentMap: true,

    },
    modelType: "ListState",

    changeSearch: function(search) {
        console.log("searchChanged: " + search);
        this.set({searchQuery: search});
    },

});