//  Copyright (c) 2006, David Corvoysier
//  Released under the GPL license
//  http://www.gnu.org/copyleft/gpl.html
//
// File: insertCommentDlg.js
// Description: insertCommentDlg.xul js functions

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

function getFullText(){
  return document.getElementById("fulltext").value;
}

function setFullText(value){
  document.getElementById("fulltext").value = value;
}

function getPattern(){
  return document.getElementById("pattern").value;
}

function setPattern(value){
  document.getElementById("pattern").value = value;
}

function getMessage(){
  return document.getElementById("message").value;
}

function setMessage(value){
  document.getElementById("message").value = value;
}

function getSelStart(){
  return document.getElementById("fulltext").selectionStart;  
}

function getSelEnd(){
  return document.getElementById("fulltext").selectionEnd;  
}

// Get the current text selection
function getSelectedText(){
  return getFullText().substring(getSelStart(),getSelEnd());
}

// Init the dialog
function initCommentDlg(){
  // Set the full text field
  setFullText(getTextValue(getTargetElement()));
  // Select all text
  document.getElementById("fulltext").select();
  // Set pattern to full text
  setPattern(getTextValue(getTargetElement()));  
}

// Inserts the comment
function doInsert(){
  // Get values from the window
  var pattern  = getPattern();
  var message = getMessage();
  // Get the target DOM document
  var domDoc = getTargetDOM();
  // Get the target element
  var elt = getTargetElement();
  // Get the current Kaizou document
  var kdoc = getKaizouDocument();
  // Get the current actions node
  var actions = getKaizouActions();
  
  if(kdoc && elt && actions && (pattern != "") && (message != "")){
    // Add a new action to the pending kaizou transformation
    var action = addCommentAction(kdoc,actions,pattern,message);
    // Apply transformations to the DOM in the window that opened this box
    commentText(domDoc,getTextNode(elt),action,getKaizouAuthor());
  }
}

////////////////////////////////////////////////////////////////////////////////
// Event Handlers
////////////////////////////////////////////////////////////////////////////////

// OK button event handler
function doOK(){
  doInsert();
  self.close();
}

// Cancel button event handler
function doCancel()
{
  self.close();
}
