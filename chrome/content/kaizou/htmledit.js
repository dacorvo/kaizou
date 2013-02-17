//  Copyright (c) 2006, David Corvoysier
//  Released under the GPL license
//  http://www.gnu.org/copyleft/gpl.html
//
// File: htmledit.js
// Description: htmledit.xul js functions

// Helper functions
function getTargetDOM(){
  return self.opener.content.document;
}

function getTargetElement(){
  return getTargetDOM().kaizou_focus;
}

function getKaizouDocument(){
  return getTargetDOM().kaizou_doc;
}

function getKaizouAuthor(){
  return getFirstChildTextValue(getKaizouDocument(),"author");
}

function getKaizouActions(){
  return getTargetDOM().kaizou_actions;
}

function getHTML(){
  var w = document.getElementById('miniBrowser').contentWindow;
  return w.editbox.document.f.ta.value;  
}

function init()
{
  var w = document.getElementById('miniBrowser').contentWindow;
  w.top = w;
  w.editbox.top = w;
  // Get target element inner HTML
  try {
    var target = getTargetElement();
    w.editbox.document.f.ta.value = Jash.Indenter.indent(target.innerHTML);
  } catch(e) {
    alert(e);
  }
}
    
// Modifies the html
function doModify(){
  // Get values from the window
  var html  = getHTML();
  // Get the target DOM document
  var domDoc = getTargetDOM();
  // Get the target element
  var elt = getTargetElement();
  // Get the current Kaizou document
  var kdoc = getKaizouDocument();
  // Get the current actions node
  var actions = getKaizouActions();
  
  if(kdoc && elt && actions){
    // Add a new action to the pending kaizou transformation
    var action = addInnerHTMLAction(kdoc,actions,html);
    // Apply transformations to the DOM in the window that opened this box
    innerHTML(elt,action);
  }
}

////////////////////////////////////////////////////////////////////////////////
// Event Handlers
////////////////////////////////////////////////////////////////////////////////

// OK button event handler
function doOK(){
  doModify();
  self.close();
}

// Cancel button event handler
function doCancel()
{
  self.close();
}
