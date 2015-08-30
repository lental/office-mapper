var SeachBarView = Backbone.View.extend({
  initialize: function(){
    this.render();
    this.listenTo(listState, 'change', this.clearSearchIfSearchEmpty);
  },

  el: '#search-bar',

  events: {
    "click #search-clear": "clearSearchQuery",
    "input #search-input": "updateSearchValue",
    // "keypress #search-input": "onKeyPress",
  },

  onKeyPress: function(event) {
    if (event.keyCode == 13) {
      listState.changeSearch(event.target.value);
      return false;
    }
  },

  updateSearchValue: function(event) {
    element = event.currentTarget;
    listState.changeSearch(event.target.value);
  },

  clearSearchQuery: function(event) {
    listState.changeSearch('');
  },

  clearSearchIfSearchEmpty: function() {
    if (listState.get("searchQuery") == '') {
      this.$("#search-input").val('');
    }
  },

  render: function() {
    return this;
  }
});
var renderSearchBar = function() {
  new SeachBarView({pageState: pageState});
};