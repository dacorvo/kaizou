//  Copyright (c) 2006, David Corvoysier
//  Released under the GPL license
//  http://www.gnu.org/copyleft/gpl.html
//
// File: editor.js
// Description: Kaizou editor
//
// Note: A large part of this code is adapted from the Platypus source code
// See http://platypus.mozdev.org/ for more info on Platypus

// Kaizou document creation routines

// Create a child node of a node with a given tag name
function createChildNode(doc,node,name){
  var child = doc.createElement(name);
  return node.appendChild(child);
}

// Create a child node of a node with a given tag name and text
function createChildNodeWithText(doc,node,name,value){
  var child = doc.createElement(name);
  var text = doc.createTextNode(value);
  child.appendChild(text);
  return node.appendChild(child);
}

// Create a child node of a node with a given tag name and CDATA
function createChildNodeWithData(doc,node,name,value){
  var child = doc.createElement(name);
  var data = doc.createCDATASection(value);
  child.appendChild(data);
  return node.appendChild(child);
}

// Set the text value of the first child of a node knowing its name    
function setChildNodeWithText(doc,node,name,value){
  try{
    var child = getFirstChild(node,name);
    if(!child){
      child = createChildNodeWithText(doc,node,name,value);
    }else{
      var textNode = getTextNode(child);
      if(textNode) textNode.data = value;
    }
  }
  catch(e){
    alert(e);
  }
}

// Add a new comment action node to a group of actions
function addCommentAction(doc,actions,pattern,message){
  if((doc != null) &&(actions!=null)){
    try{    
      var action = createChildNode(doc,actions,"comment");
      createChildNodeWithText(doc,action,"pattern",pattern);
      createChildNodeWithText(doc,action,"message",message);
      return action;
    }
    catch(e)
    {
      alert(e);
    }
  }
  return null;
}

// Add a new img-over action node to a group of actions
function addImgOverAction(doc,actions,src,xpos,ypos,width,height){
  if((doc != null) &&(actions!=null)){
    try{    
      var action = createChildNode(doc,actions,"img-over");
      createChildNodeWithText(doc,action,"src",src);
      createChildNodeWithText(doc,action,"xpos",xpos);
      createChildNodeWithText(doc,action,"ypos",ypos);
      if(width) createChildNodeWithText(doc,action,"width",width);
      if(height) createChildNodeWithText(doc,action,"height",height);
      return action;
    }
    catch(e)
    {
      alert(e);
    }
  }
  return null;
}

// Add a new inner-html action node to a group of actions
function addInnerHTMLAction(doc,actions,html){
  if((doc != null) &&(actions!=null)){
    try{    
      var action = createChildNode(doc,actions,"inner-html");
      createChildNodeWithData(doc,action,"html",html);
      return action;
    }
    catch(e)
    {
      alert(e);
    }
  }
  return null;
}

// Add a new transformation node to a Kaizou document
function addTransformation(doc,xpath){
//function addTransformation(doc,fpath,xpath){
  if(doc != null){
    try{    
      var transform = createChildNode(doc,doc.firstChild,"transform");
/*      if(fpath){
        createChildNodeWithText(doc,transform,"fpath",fpath);
      }*/
      createChildNodeWithText(doc,transform,"xpath",xpath);
      createChildNode(doc,transform,"actions");
      return transform;
    }
    catch(e)
    {
      alert(e);
    }
  }
  return null;
}

// Add a new uri node to a Kaizou document
function addTargetURI(doc,uri){
  if(doc != null){
    try{    
      var target = getFirstChild(doc.firstChild,"target");
      createChildNodeWithText(doc,target,"uri",uri);      
    }
    catch(e)
    {
      alert(e);
    }
  }
}

// Add a new pattern node to a Kaizou document
function addTargetPattern(doc,pattern){
  if(doc != null){
    try{    
      var target = getFirstChild(doc.firstChild,"target");
      createChildNodeWithText(doc,target,"pattern",pattern);      
    }
    catch(e)
    {
      alert(e);
    }
  }
}

// Create a new Kaizou document
function newKaizouDescriptionDocument(uri){
  // Create document
  var doc = document.implementation.createDocument("http://www.kaizou.org","kaizou",null);
  // Add Title, Author & Link children
  createChildNodeWithText(doc,doc.firstChild,"title","");
  var author = getKaizouPrefAuthor();
  createChildNodeWithText(doc,doc.firstChild,"author",author ? author : "");
  createChildNodeWithText(doc,doc.firstChild,"link","");
  createChildNodeWithText(doc,doc.firstChild,"description","");
  // Add target child
  var target = createChildNode(doc,doc.firstChild,"target");
  addTargetURI(doc,uri);
  return doc;
}

////////////////////////////////////////////////////////////////////////////////
// Code copied from Platypus by Scott R. Turner
// Fix: use lower-case for nodes names (compatibility with IE)
////////////////////////////////////////////////////////////////////////////////

// Builds XPATH based on element
function mybuildXPathForElement(e) {
    var parent = e.parentNode;
    var path = "";
   
    if(e.nodeName == "HTML"){
      // This is the top node, we can't go upper !
      path = "/html[1]";
    }else{
      // let's see if we can rely on differentiating attributes
      var elid = e.getAttribute("id");
      var elclass = e.getAttribute("class"); 
      var elname = e.getAttribute("name"); 
      if(elid || elclass || elname){
        // We will use this attribute set to select this element
        path="/descendant::" + e.nodeName.toLowerCase();
        var index = 1;
      	path += elid ? "[@id=\'" + elid + "\']" : "";
      	path += elclass ? "[@class=\'" + elclass + "\']" : "";
      	path += elname ? "[@name=\'" + elname + "\']" : "";
      	// We will evaluate this expression on the current document
        var doc = getBrowser().selectedBrowser.contentWindow.document;
      	var nodes = selectNodes(doc,path);
      	// Figure out what this element rank in the list
      	var j=0;
        while ( (node = nodes.snapshotItem(j) ) !=null ){
          if(e == node){
            index = j+1;
          }
          j++;
        }
      	path += "[" + index + "]";
      }else{
        // We can only rely on the node name and ancestors  
        if (parent) {
        	path = mybuildXPathForElement(parent);
        	path += "/" + e.nodeName.toLowerCase();
          
        	var index = 1;
        	var n = e.previousSibling;
        	while (n != null) {
        	    if (e.nodeName == n.nodeName) index++;
        	    n = n.previousSibling;
        	}
        	path += "[" + index + "]";
      	}
    	}
    }
    
    return path;
}

// Highlights an element
function highlight_elt(elem){
  // Do not highlight hidden elements
  if((elem != null)&& (elem.style.display != "none")){
    // Add border
  	elem.style.setProperty("-moz-outline-style", "solid", "important");
  	elem.style.setProperty("-moz-outline-width", "1px", "important");
  	elem.style.setProperty("-moz-outline-color", "#F66", "important");
    // Change bg-color (old bg-color is stored as a "special" attribute)
  	elem.setAttribute("kaizou-background-color",
  			  elem.style.getPropertyValue("background-color"));
  	elem.style.setProperty("background-color", "#FFCC00", "important");
  }
}

// Un-highlights an element
function clear_elt(elem){
  // Hidden elements shouldn't have been highlighted anyway, but ...
  if((elem != null)&& (elem.style.display != "none")){
    // Reset border
    elem.style.removeProperty("-moz-outline-style");
    elem.style.removeProperty("-moz-outline-width");
    elem.style.removeProperty("-moz-outline-color");
    // Restore bg-color (old bg-color is stored as a "special" attribute)
    elem.style.setProperty("background-color",
			     elem.getAttribute("kaizou-background-color"),
			     "important");
		// Remove "special" attribute
		elem.removeAttribute("kaizou-background-color");
		// If needed, remove "style" attribute
		if(elem.getAttribute("style") == ""){
		  elem.removeAttribute("style");
    }
  }
}

// Display a string in the status bar
function display_status(str) {
  var statusTextFld = document.getElementById("statusbar-display");
  statusTextFld.label = str;
}

// Sets the kaizou focus on an element
function set_kaizou_focus_on(doc, elem) {
  if (elem != doc.kaizou_focus) {
    clear_elt(doc.kaizou_focus);
    highlight_elt(elem);
    doc.kaizou_focus = elem;
  }
}

// Clears the kaizou focus
function clear_kaizou_focus(doc) {
  if (doc.kaizou_focus) {
    clear_elt(doc.kaizou_focus);
    doc.kaizou_focus = null;
  }
}

// Mouse-over event handler
function kaizou_handle_mouseover(evt) {
  var elem = (evt.target) ? evt.target : evt.srcElement;
  var doc = document.getElementById("content").contentDocument;
  if(!doc.kaizou_focus_frozen){
    set_kaizou_focus_on(doc, elem);
  }
}

// Tool menu showing event handler
function on_tool_menu_showing(){
  var doc = document.getElementById("content").contentDocument;
  var menu = document.getElementById('kaizou-commands').firstChild;
  for (var i=0; i<menu.childNodes.length; i++)
  if (menu.childNodes.item(i).id.match("kaizou-tool-edit")){
    if(doc.kaizou_started){
      menu.childNodes.item(i).hidden = false;
    }else{
      menu.childNodes.item(i).hidden = true;
    }    
  }else{
    if(doc.kaizou_started){
      menu.childNodes.item(i).hidden = true;
    }else{
      menu.childNodes.item(i).hidden = false;
    }     
  }
}
  
// Context menu showing event handler
function kaizou_context_menu_showing(evt) {
  var doc = document.getElementById("content").contentDocument;
  var menu = document.getElementById('contentAreaContextMenu');
  if (doc.kaizou_started){
    // Freeze the focus
    doc.kaizou_focus_frozen = true;
    // hide everything except kaizou commands
    if (menu.childNodes.length != 0) {
      for (var i=0; i<menu.childNodes.length; i++)
      if (menu.childNodes.item(i).id.match("kaizou-edit")){
        // This is a Kaizou editor menu item 
        if(menu.childNodes.item(i).id.match("kaizou-edit-text")){
          // This editor item is only allowed on nodes that contain text
          if(getFocussedText()){
            menu.childNodes.item(i).hidden = false;
          }else{
            menu.childNodes.item(i).hidden = true;
          }
        }else{
          // This editor item is allowed on all nodes
          menu.childNodes.item(i).hidden = false;
        }
      }else if (!menu.childNodes.item(i).hidden){
        // Hide this menu item
        menu.childNodes.item(i).hidden = true;
        // Remember we did this to the poor guy
        menu.childNodes.item(i).kaizou_hidden = true;
      }
    }
  }else{
    // Show everything we've hidden before except kaizou commands
    if (menu.childNodes.length != 0){
      for (var i=0; i<menu.childNodes.length; i++){
        if (menu.childNodes.item(i).id.match("kaizou-edit")) {
          menu.childNodes.item(i).hidden = true;
        } else if (menu.childNodes.item(i).kaizou_hidden) {
          menu.childNodes.item(i).hidden = false;
          menu.childNodes.item(i).kaizou_hidden = false;
        }
      }
    }
  }
}

// Context menu hiding event handler
function kaizou_context_menu_hiding(evt) {
  var doc = document.getElementById("content").contentDocument;
  if (doc.kaizou_started){
    // Release the focus
    doc.kaizou_focus_frozen = false;
  }
}


// Recursively find all sub-documents in a document (ie frames)
function find_all_documents(doc){
  var result = new Array(doc);
  var alldocs = document.evaluate("//frame",
  		 doc, null,
  		 XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
  		 null);
  for (var i = 0; i < alldocs.snapshotLength; i++)
    result = result.concat(find_all_documents(alldocs.snapshotItem(i).contentDocument));
  return result;
}

// Resets the pending Kaizou document
function reset_kaizou_doc(doc) {
    doc.kaizou_doc = newKaizouDescriptionDocument(doc.location.href);
    doc.kaizou_actions = null;
}

// Add listeners to a DOM document
function add_kaizou_editor_listeners(doc){
  // Set various events handlers on document
  doc.addEventListener("mouseover",kaizou_handle_mouseover, false);
//  pdoc.addEventListener("keypress",kaizou_handle_keypress, false);
//  pdoc.addEventListener("click",kaizou_handle_click, false);
}

// Add listeners to a DOM document
function remove_kaizou_editor_listeners(doc){
  // Remove events handlers set on document
    doc.removeEventListener("mouseover", kaizou_handle_mouseover, false);
//  doc.removeEventListener("keypress", kaizou_handle_keypress, false);
//  doc.removeEventListener("click", kaizou_handle_click, false);
}

// Is this node in a frame ?
function inFrame(node){
  var doc = node.ownerDocument;
  var rdoc = document.getElementById("content").contentDocument;
  return (doc != rdoc);
}

// Get the current frame path
function buildFramePath(node,frames){
  var path = "";
  if(inFrame(node)){
    var fdoc = node.ownerDocument;
    var frame = frames.getFrameForDoc(fdoc);
    if(frame){
      path = frame.frameName;
      if(inFrame(frame.frameNode)){
        path = buildFramePath(frame.frameNode,frames) + "/" + path;
      }
    }
  }
  return path;
}

// Start editing a document
function start_kaizou_editor_on_doc(doc){
  
  // Collect frames (includes at least top frame)
  doc.kaizou_frames = new Frames(doc);
  
  // Add our listeners to each framed document
  var docs = doc.kaizou_frames.getAllDocuments();
  for(var i in docs){
    add_kaizou_editor_listeners(docs[i]);
  }
  
  // Capture window events
  window.captureEvents(Event.KeyPress);
  
  // This one is for stopping the editor on document unload
  doc.addEventListener("onunload",stop_kaizou_editor, false);
  
    // Set kaizou editor variables
  doc.kaizou_started = true;
  doc.kaizou_focus = null;
  doc.kaizou_focus_frozen = false;
  doc.kaizou_window = window;
  
  //  Create new Kaizou document
  reset_kaizou_doc(doc);

}

// Stop the kaizou editor on a document
function stop_kaizou_editor_on_doc(doc){
  if(doc.kaizou_started){
     
    // Remove listeners on each framed document
    var docs = doc.kaizou_frames.getAllDocuments();
    for(var i in docs){
      remove_kaizou_editor_listeners(docs[i]);
    }
    
    // Release window events
    doc.kaizou_window.releaseEvents(Event.KeyPress);
    
    // Unset kaizou editor variables
    clear_kaizou_focus(doc);
    doc.kaizou_started = false;
  }
}

// Start Kaizou editor
function start_kaizou_editor(){
  var doc = getBrowser().selectedBrowser.contentWindow.document;
	start_kaizou_editor_on_doc(doc);
}

// Stop Kaizou editor
function stop_kaizou_editor(){
  var doc = getBrowser().selectedBrowser.contentWindow.document;
	stop_kaizou_editor_on_doc(doc);
}

////////////////////////////////////////////////////////////////////////////////

// Get the current text selection
function getFocussedText()
{
  var result = null;
  var doc = getBrowser().selectedBrowser.contentWindow.document;
  if(doc.kaizou_started){
    result = getTextValue(doc.kaizou_focus);
  }
  return result;
}

// Insert an overlay image
function kaizou_insert_image(){
  var doc = getBrowser().selectedBrowser.contentWindow.document;
  if(doc.kaizou_started){
    //var fpath = buildFramePath(doc.kaizou_focus,doc.kaizou_frames);
    var xpath = mybuildXPathForElement(doc.kaizou_focus);
    //var transform = addTransformation(doc.kaizou_doc,fpath,xpath);
    var transform = addTransformation(doc.kaizou_doc,xpath);
    doc.kaizou_actions = getFirstChild(transform,"actions");
    var result = window.open("chrome://kaizou/content/insertImgDlg.xul","insertImgDlg",
                    "centerscreen,chrome,modal");
    doc.kaizou_actions = null;
  }
}

// Insert a comment
function kaizou_insert_comment(){
  var doc = getBrowser().selectedBrowser.contentWindow.document;
  if(doc.kaizou_started){
    var xpath = mybuildXPathForElement(doc.kaizou_focus) + "/text()";
    var transform = addTransformation(doc.kaizou_doc,xpath);
    doc.kaizou_actions = getFirstChild(transform,"actions");
    var result = window.open("chrome://kaizou/content/insertCommentDlg.xul","insertCommentDlg",
                    "centerscreen,chrome,modal");
    doc.kaizou_actions = null;
  }
}

// Modify inner HTML
function kaizou_modify_html(){
  var doc = getBrowser().selectedBrowser.contentWindow.document;
  if(doc.kaizou_started){
    var xpath = mybuildXPathForElement(doc.kaizou_focus);
    var transform = addTransformation(doc.kaizou_doc,xpath);
    doc.kaizou_actions = getFirstChild(transform,"actions");
    var result = window.open("chrome://kaizou/content/htmledit.xul","htmledit",
                    "width=500,height=400,centerscreen,chrome,modal,resizable");
    doc.kaizou_actions = null;
  }
}

// Save Kaizou document to disk
function kaizou_save(){
  var doc = getBrowser().selectedBrowser.contentWindow.document;
  if(doc.kaizou_started){
    // Ask for information
    var params = {cancel:false};
    window.openDialog("chrome://kaizou/content/setInformationDlg.xul","setInformationDlg",
                    "centerscreen,chrome,modal",params);
    if(!params.cancel){
      // Select the file to save the dialog
      var nsIFilePicker = Components.interfaces.nsIFilePicker;
      var fp = Components.classes["@mozilla.org/filepicker;1"]
              .createInstance(nsIFilePicker);
      fp.init(window, "Select a filename", nsIFilePicker.modeSave);
      fp.appendFilters(nsIFilePicker.filterXML);
      fp.defaultString = getFilenameFromTitle(doc.kaizou_doc);
      var res = fp.show();
      if ((res == nsIFilePicker.returnOK)||(res == nsIFilePicker.returnReplace)){
        var thefile = fp.file;
        // Save Kaizou document to disk
        saveKaizouDocument(thefile,doc.kaizou_doc);
        // Stop kaizou editor on that document
        stop_kaizou_editor();
      }
    }
  }
}
