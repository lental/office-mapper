ModifiedObjects = Backbone.Model.extend({
  defaults: {
      modifiedObjects: new Set()
  },
  add: function(o){
    var ret = this.get('modifiedObjects').add(o);
    this.trigger('change', this);
    return ret;
  },
  delete: function(o){
    var ret = this.get('modifiedObjects').delete(o);
    this.trigger('change', this);
    return ret
  },
  has: function(o){
    return this.get('modifiedObjects').has(o);
  },
  forEach: function(f) {
    return this.get('modifiedObjects').forEach(f);
  }
});
