var SeachBarView = Backbone.View.extend({
  initialize: function(){
    this.render();
    this.listenTo(pageState, 'change', this.clearSearchIfSearchEmpty);
  },

  el: '#search-bar',

  events: {
    "click #search-clear": "clearSearchQuery",
    "blur #search-input": "updateSearchValue",
    "keypress #search-input": "onKeyPress",
  },

  onKeyPress: function(event) {
    if (event.keyCode == 13) {
      pageState.changeSearch(event.target.value);
      return false;
    }
  },

  updateSearchValue: function(event) {
    element = event.currentTarget;
    pageState.changeSearch(event.target.value);
  },

  clearSearchQuery: function(event) {
    pageState.changeSearch('');
  },

  clearSearchIfSearchEmpty: function() {
    if (pageState.get("searchQuery") == '') {
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