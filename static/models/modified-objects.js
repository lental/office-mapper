ModifiedObjects = Backbone.Model.extend({
  defaults: {
      modifiedObjects: {}
  },
  add: function(o){
    var objs = this.get('modifiedObjects')
    ret = false;
    if(!objs[o.cid]) {
      this.get('modifiedObjects')[o.cid] = o;
      ret = true;
    }
    this.trigger('change', this);
    return ret;
  },
  delete: function(o){
    var ret = delete(this.get('modifiedObjects')[o.cid]);
    this.trigger('change', this);
    return ret
  },
  getObjectByCId: function(cid) {
    return this.get('modifiedObjects')[cid];
  },
  has: function(o){
    return (this.get('modifiedObjects')[o.cid] != null);
  },
  each: function(f) {
    return $.each(this.get('modifiedObjects'), f);
  }
});
