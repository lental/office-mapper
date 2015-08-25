function isChildPartiallyOutsideOfParent(child, parent){

  absChild = { offsetLeft:child.offsetLeft,
               offsetTop:child.offsetTop,
               offsetWidth:child.offsetWidth,
               offsetHeight:child.offsetHeight
             };
  curNode = child.parentElement;
  while (curNode != null) {
    if (curNode == parent) {
      break;
    } else {
      absChild.offsetLeft += curNode.offsetLeft;
      absChild.offsetTop += curNode.offsetTop;
      curNode = curNode.parentElement;
    }
  }
  if(curNode == null) {
    console.log("Child is not a descendant of Parent");
    return null;
  }
return isChildOffLeftOfParent(absChild, parent) ||
       isChildOffRightOfParent(absChild, parent) ||
       isChildOffTopOfParent(absChild, parent) ||
       isChildOffBottomOfParent(absChild, parent);
}
function isChildOffLeftOfParent(child, parent) {
  return child.offsetLeft  < parent.scrollLeft;
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