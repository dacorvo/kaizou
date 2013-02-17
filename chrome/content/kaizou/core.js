//  Copyright (c) 2006, David Corvoysier
//  Released under the GPL license
//  http://www.gnu.org/copyleft/gpl.html
//
// File: core.js
// Description: Kaizou main script

// Global variables

// Document to be applied when clicking a kaizou link
var _nextDoc = null;
var _refCount = 0;

// Get the filename to be used to save a Kaizou file 
function getFilename(url,doc){
  // Try first to get the filename from the URL
  var name = url.substring(url.lastIndexOf('/')+1);
  var re = /^\w+\.xml$/;
  if(!name.match(re)){
    // This is not a valid filename, calculate it from the title
    name = getFilenameFromTitle(doc);
  }
  return name;
}

// Change the kaizou status
function setStatus(icon, message) {
  var status = document.getElementById("kaizouStatusImage");
  status.setAttribute("src", "chrome://kaizou/skin/"+icon+".png");
  status.setAttribute("tooltiptext", message);
}

// Tab changed handler
function onTabChanged(event) {
  var doc = window.content.document;
  // Change the status if the doc has been modified
  if (doc.kaizoued){
    setStatus('kaizou_on', 'This page has been kaizoued');
  }else{
    setStatus('kaizou_off', 'This is the original page');
  }
}

// Checks if the loaded document is a Kaizou file or a Kaizou target
function kaizouCheckThis(domDocument){
  // Get the document URL
  var url = domDocument.location.href;
  // If there is a fresh doc loaded, apply it
  if(_nextDoc){
    // Collect descendant frames
    var frames = new Frames(domDocument);
    // Update refCount with the number of descendant frames in that doc
    _refCount += frames.getAllDocuments().length -1;
    // Quick workaround to avoid google syndication mess
    if(isTargetOf(url,_nextDoc)){
      applyTransformations(domDocument,_nextDoc);
    }
    // Decrease refCount
    _refCount -= 1;
    if(_refCount == 0){
      // We've finished with that kaizou : clear it
      _nextDoc = null;
    }
  }
  // Call the tab changed handler to update the status
  onTabChanged(null);
}

// Open a new tab to the url provided as a parameter
function openURLInNewTab(url) {
  var newTab = getBrowser().addTab(url);
  getBrowser().selectedTab = newTab;
}

// Event handler for clicks on kaizou links
function captureClick(evt){
  var node = evt.target;
  var href = node.href;
  // Asynchronous call to get the file (will set _nextDoc)
  getKaizouFileAtURL(href);
  return false;
}

// DOM loaded event handler to launch kaizou actions on page
function onDOMLoaded(event){
  var domDocument = event.target;
  // Add click capture events on kaizou links
  var targetNodes = selectNodes(domDocument,"//a[@rel='kaizou']");
  var j=0;
  while ( (node = targetNodes.snapshotItem(j) ) !=null ){
    // Disable this link
    node.setAttribute("onclick","return false;");
    // Add a click event handler to trigger our code
    node.addEventListener('click', captureClick, true);
    j++;
  }
  // Check this Page
  kaizouCheckThis(domDocument);
}

// Main event handler used to register other events
function kaizouExtensionLoaded() {
  // Insert a DOM loaded event listener
  var appContent = document.getElementById("appcontent");
  appContent.addEventListener('DOMContentLoaded', onDOMLoaded, true);
  // Set popup menu event hander for revealing/hiding the context menu
  var menu = document.getElementById("contentAreaContextMenu");
  menu.addEventListener("popupshowing", kaizou_context_menu_showing, false); // in editor.js
  menu.addEventListener("popuphiding", kaizou_context_menu_hiding, false); // in editor.js
  // Insert an handler on tab select
  var tabs = document.getElementById("content"); 
  tabs.addEventListener("select", onTabChanged, true);
}
