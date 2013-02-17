//  Copyright (c) 2006, David Corvoysier
//  Released under the GPL license
//  http://www.gnu.org/copyleft/gpl.html
//
// File: insertImgDlg.js
// Description: Javascript functions for insertImg Dialog

// Helper Functions
function getTargetDOM(){
  return self.opener.content.document;
}

function getTargetElement(){
  return getTargetDOM().kaizou_focus;
}

function getKaizouDocument(){
  return getTargetDOM().kaizou_doc;
}

function getKaizouActions(){
  return getTargetDOM().kaizou_actions;
}

function getKaizouTmpNode(){
  return getTargetDOM().kaizou_tmp_node;
}

function getKaizouTmpAction(){
  return getTargetDOM().kaizou_tmp_action;
}

function getSRC(){
  return document.getElementById("src").value;
}

function setSRC(value){
  document.getElementById("src").value = value;
}

function getXPOS(){
  return parseInt(
        document.getElementById("xpos").value ?
         document.getElementById("xpos").value : 0);
}

function setXPOS(value){
  document.getElementById("xpos").value = value; 
}

function getYPOS(){
  return parseInt(
        document.getElementById("ypos").value ?
         document.getElementById("ypos").value : 0);
}

function setYPOS(value){
  document.getElementById("ypos").value = value; 
}


function getPreview(){
  return document.getElementById("preview").checked; 
}

function getZoom(){
  return parseInt(
        document.getElementById("zoom").value ?
          document.getElementById("zoom").value : 100);
}

function setZoom(value){
  var zoom = parseInt(value);
  zoom = (zoom < 0) ? 0 : zoom;
  zoom = (zoom > 100) ? 100 : zoom;
  document.getElementById("zoom").value = zoom;
}

// Get the real width of the previewed image using our hidden image
function getRealWidth(){
  return document.getElementById("hidden-image").naturalWidth;
}

// Get the real height of the previewed image using our hidden image
function getRealHeight(){
  return document.getElementById("hidden-image").naturalHeight;
}

function getWidth(){
  return getRealWidth() ? getZoom()*getRealWidth()/100 : null;
}

function getHeight(){
  return getRealHeight() ? getZoom()*getRealHeight()/100 : null;
}

function setPoster(value){
  document.getElementById("poster").src = value; 
}

function setHiddenImage(value){
  document.getElementById("hidden-image").src = value; 
}

// Get the next image in the library
function getNextImage(){
  // Get the current image
  var current = getSRC();
  // Defaults the next image to the first image in the library
  var nextIndex = 0;
  // Get the images library
  var images = getOverlays();
  for(var i = 0; i < images.length; i++){
    if(images[i]==current){
      // Calculate next index
      nextIndex = (i+1)%(images.length);
    }
  }
  return images[nextIndex];
}

// Get the previous image in the library
function getPreviousImage(){
  // Get the current image
  var current = getSRC();
  // Defaults the next image to the first image in the library
  var nextIndex = 0;
  // Get the images library
  var images = getOverlays();
  for(var i = 0; i < images.length; i++){
    if(images[i]==current){
      // Calculate next index
      nextIndex = (images.length+i-1)%(images.length);
    }
  }
  return images[nextIndex];
}

// Set the image to be inserted in the target DOM
function setImage(url){
  // Set the SRC value
  setSRC(url);
  // Set the hidden image "src"
  setHiddenImage(url);
  // Set the displayed poster "src"
  setPoster(url);
}

// Clear a previously inserted image
function clearPreview(){
  // Get the target DOM document
  var domDoc = getTargetDOM();
  // Get the target element
  var elt = getTargetElement();
  // Get the current Kaizou insert node
  var actions = getKaizouActions();
  // If we have already inserted something, remove it
  if(domDoc.kaizou_tmp_node != null){
    elt.parentNode.removeChild(domDoc.kaizou_tmp_node);
    domDoc.kaizou_tmp_node = null;
  }
  if(domDoc.kaizou_tmp_action != null){
    actions.removeChild(domDoc.kaizou_tmp_action);
    domDoc.kaizou_tmp_action = null;
  }
}

// Inserts the overlay image (as a tmp node if isPreview == true)
function doInsert(isPreview)
{
  // Get values from the window
  var src  = getSRC();
  var xpos = getXPOS();
  var ypos = getYPOS();
  var width = getWidth();
  var height = getHeight();
  // Get the target DOM document
  var domDoc = getTargetDOM();
  // Get the target element
  var elt = getTargetElement();
  // Get the current Kaizou document
  var kdoc = getKaizouDocument();
  // Get the current actions node
  var actions = getKaizouActions();
  
  if(kdoc && elt && actions && src != ""){
    // Do the actual insertion
    if(isPreview){
      // Create a new action and store it
      domDoc.kaizou_tmp_action = addImgOverAction(kdoc,actions,src,xpos,ypos,width,height);
      // Apply transformations to the DOM in the window that opened this box
      domDoc.kaizou_tmp_node = insertImg(domDoc,elt,domDoc.kaizou_tmp_action);
    }else{
      // Add a new action to the pending kaizou transformation
      var action = addImgOverAction(kdoc,actions,src,xpos,ypos,width,height);
      // Apply transformations to the DOM in the window that opened this box
      insertImg(domDoc,elt,action);
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Event Handlers
////////////////////////////////////////////////////////////////////////////////

// Preview button event handler
function doRefresh(previewOn)
{
  // If we have already inserted something, remove it
  clearPreview();
  if(previewOn){
    doInsert(true);
  }
}

// OK button event handler
function doOK(){
  // If we have already inserted something, remove it
  clearPreview();
  doInsert(false);
  self.close();
}

// Cancel button event handler
function doCancel()
{
  // If we have already inserted something, remove it
  clearPreview();
  self.close();
}
