
var MapView = Backbone.View.extend({
  initialize: function(){
    this.renderCurrentMap()
    this.render();
    this.listenTo(pageState, 'change', this.render);
    this.listenTo(this.model, 'sync', this.sync);
    this.listenTo(pageState, 'change:selectedObject', this.highlightItem);
    this.listenTo(gplus, 'change', this.onGPlusChange);
  },
  renderCurrentMap: function() {
    console.log("rendering new map");
    this.listenTo(this.model.attributes.sections, 'change', this.render);
    this.$el.empty();
    var curMap = this.model;
    this.$("#map_name").text(curMap.attributes.name);
    var sections = curMap.attributes.sections;
    var maxX = 0;
    var maxWidth = 0;
    var maxY = 0;
    var maxHeight = 0;
    sections.forEach(_.bind(function(section){
      if (section.attributes.position.x + section.attributes.position.w >= maxX + maxWidth) {
        maxX = section.attributes.position.x;
        maxWidth = section.attributes.position.w;
      }
      if (section.attributes.position.y + section.attributes.position.h >= maxY + maxHeight) {
        maxY = section.attributes.position.y;
        maxHeight = section.attributes.position.h;
      }
      this.$el.prepend((new MapSectionView({model: section})).el);
    }, this));
    this.$el.css({width: (maxX+maxWidth+100) + "px", height: (maxY+maxHeight+100) + "px"});


    var newSectionButton = $("<div id='new_section_button' class='shadowed clickable'>+</div>");
    this.$el.append(newSectionButton);
    newSectionButton.css({left: (this.$el[0].scrollWidth - 80)+"px"});
    newSectionButton.click(function(){
      if(gplus.isCurrentUserAnAdmin()) {
      var newSection = this.model.attributes.sections.create({map_id: parseInt(this.model.attributes.id),
        name: "New Section",
        position: {x: 0, y: 0, w: 200, h: 200},
        deskGroups: new DeskGroups([]),
        places: new Places([]),
        rooms: new Rooms([])
      },{success: _.bind(function(model){
            // this.$el.append(new MapDeskView({model:model}).el)
            pageState.mapSelectionClick = false;
            var sectionView = new MapSectionView({model: model});
            this.$el.append(sectionView.el);
            // debugger
            model.trigger('sync', model);
            pageState.selectObject(model);
          },this), wait:true})
      } else {
        alert("You are not logged in");
      }
      
      // $("#map").prepend((new MapSectionView({model: newSection})).el);
    }.bind(this));

    this.highlightItem(pageState);
    this.onGPlusChange();
  },

  tagName: "div",
  id: "map",
  className: "flexElement",

  highlightItem: function(pState) {
    var selectedObject = pState.attributes.selectedObject;

    //This code doesn't selectMap for User click, but that is handled in pageState
    if (!selectedObject) {
      console.log("trying to highlight without a selected object");
      return;
    } if (selectedObject.modelType == "Map") {
      //Selected a map. won't highlight
      return;    
    }

    var selectedMapId = selectedObject.get('mapId') || selectedObject.get('map_id');
    if (selectedMapId && selectedMapId != pState.get('currentMapId')){
      console.log("trying to highlight from a different map. Switching map now");
      return;
    }

    var selectedElement;
    if (pState.attributes.selectedObject instanceof Place) {
      selectedElement = this.$("#map_place_" + pState.attributes.selectedObject.attributes.id);
    }
    if (pState.attributes.selectedObject instanceof Room) {
      selectedElement = this.$("#map_room_" + pState.attributes.selectedObject.attributes.id);
    }
    if (pState.attributes.selectedObject instanceof DeskGroup) {
      selectedElement = this.$("#map_deskgroup_" + pState.attributes.selectedObject.attributes.id).addClass(classToAdd);
    }
    if (pState.attributes.selectedObject instanceof Desk) {
      selectedElement = this.$("#map_desk_" + pState.attributes.selectedObject.attributes.id).addClass(classToAdd);
    }
    if (pState.attributes.selectedObject instanceof User) {
      selectedElement = this.$("#map_desk_" + pState.attributes.selectedObject.attributes.deskId).addClass(classToAdd);
    }

    if (selectedElement && selectedElement.length > 0) {
      var classToAdd = "mapSelectedItem mapAnimateSelectedItem";
      $(".mapSelectedItem.mapAnimateSelectedItem").removeClass(classToAdd);
      if (!pState.mapSelectionClick && isChildPartiallyOutsideOfParent(selectedElement[0], $("#map-wrapper")[0])) {

        selectedElement[0].scrollIntoView();
      }
      selectedElement.parent().append(selectedElement);

      //Show the DeskGroup
      if (pState.attributes.selectedObject instanceof Desk || pState.attributes.selectedObject instanceof User) {
        selectedElement.parent().parent().append(selectedElement.parent());
      }
      selectedElement.addClass(classToAdd);
    }
    else {
      console.log("Could not find selected element")
    }
    pState.mapSelectionClick = false;
  },

  render: function() {
     var maxX = 0;
    var maxY = 0;
    var maxWidth = 0;
    var maxHeight = 0;

    this.model.attributes.sections.forEach(function(section){
      if (section.attributes.position.x + section.attributes.position.w >= maxX + maxWidth) {
        maxX = section.attributes.position.x;
        maxWidth = section.attributes.position.w;
      }
      if (section.attributes.position.y + section.attributes.position.h >= maxY + maxHeight) {
        maxY = section.attributes.position.y;
        maxHeight = section.attributes.position.h;
      }
    });
    this.$el.css({
        height: (maxY + maxHeight + 100) + "px",
        width: (maxX + maxWidth + 100) + "px",
      });
    this.$("#new_section_button").css({left: (this.$el[0].scrollWidth - 80)+"px"});
    return this;
  },
  onGPlusChange: function() {
    $("#new_section_button").toggleClass("displayNone", !gplus.isCurrentUserAnAdmin());
  },
});