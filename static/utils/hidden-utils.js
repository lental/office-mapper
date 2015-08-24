function isChildPartiallyOutsideOfParent(child, parent){

return isChildOffLeftOfParent(child, parent) ||
       isChildOffRightOfParent(child, parent) ||
       isChildOffTopOfParent(child, parent) ||
       isChildOffBottomOfParent(child, parent);
}
function isChildOffLeftOfParent(child, parent) {
  return child.offsetLeft  < parent.ScrollLeft;
}
function isChildOffRightOfParent(child, parent) {
  return child.offsetLeft  + child.offsetWidth >
      parent.scrollLeft + parent.offsetWidth;
}
function isChildOffTopOfParent(child, parent) {
  return child.offsetTop < parent.scrollTop;
  
}
function isChildOffBottomOfParent(child, parent) {
  return child.offsetTop + child.offsetHeight >
      parent.scrollTop + parent.offsetHeight;
}