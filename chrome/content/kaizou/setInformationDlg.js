//  Copyright (c) 2006, David Corvoysier
//  Released under the GPL license
//  http://www.gnu.org/copyleft/gpl.html
//
// File: setInformationDlg.js
// Description: setInformationDlg.xul js functions

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

function getKaizouDescription(doc){
  return getFirstChildTextValue(doc,"description");
}

function getKaizouTitle(doc){
  return getFirstChildTextValue(doc,"title");
}

function getKaizouAuthor(doc){
  return getFirstChildTextValue(doc,"author");
}

function getTitle(){
  return document.getElementById("title").value;  
}

function setTitle(value){
  document.getElementById("title").value = value;  
}

function getAuthor(){
  return document.getElementById("author").value;  
}

function setAuthor(value){
  document.getElementById("author").value = value;  
}

function getDescription(){
  return document.getElementById("description").value;  
}

function setDescription(value){
  document.getElementById("description").value = value;  
}

function getRemember(){
  return document.getElementById("remember").checked;
}

// Init the dialog
function initInfoDlg(){
  // Get values from the current doc
  var title = getKaizouTitle(getKaizouDocument());
  var author = getKaizouAuthor(getKaizouDocument());
  var description = getKaizouDescription(getKaizouDocument());
  if(!title){
    // Try to get the title from the modified document
    title = getFirstChildTextValue(getTargetDOM(),"title");
  }
  if(!author){
    // Try to get the author from the prefs
    author = getKaizouPrefAuthor();
  }
  // Set values
  if(title) setTitle(title);
  if(author) setAuthor(author);
  if(description) setDescription(description);
}

// Validate
function doOK(){
  var doc = getKaizouDocument();
  // Set Title
  setChildNodeWithText(doc,doc.firstChild,"title",getTitle());
  // Set Author
  setChildNodeWithText(doc,doc.firstChild,"author",getAuthor());
  // Set Description
  setChildNodeWithText(doc,doc.firstChild,"description",getDescription());
  // Remember author
  if(getRemember()) setKaizouPrefAuthor(getAuthor());
  return true;
}

// Cancel
function doCancel(){
  window.arguments[0].cancel = true;
  return true;
}
