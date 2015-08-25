function isChildPartiallyOutsideOfParent(child, parent){

return isChildOffLeftOfParent(child.getBoundingClientRect(), parent.getBoundingClientRect()) ||
       isChildOffRightOfParent(child.getBoundingClientRect(), parent.getBoundingClientRect()) ||
       isChildOffTopOfParent(child.getBoundingClientRect(), parent.getBoundingClientRect()) ||
       isChildOffBottomOfParent(child.getBoundingClientRect(), parent.getBoundingClientRect());
}
function isChildOffLeftOfParent(child, parent) {
  return child.left  < parent.left;
}
function isChildOffRightOfParent(child, parent) {
  return child.right  > parent.right;
}
function isChildOffTopOfParent(child, parent) {
  return child.top  < parent.top;
}
function isChildOffBottomOfParent(child, parent) {
  return child.bottom  > parent.bottom;
}