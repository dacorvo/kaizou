//  Copyright (c) 2006, David Corvoysier
//  Released under the GPL license
//  http://www.gnu.org/copyleft/gpl.html
//
// File: util.js
// Description: Kaizou utility functions

// General exception handler
function onKaizouException(e){
    // if DEBUG
    alert(e);
    // Else, Just gobble it !
}

// Retrieves the cdata node of a DOM Node
function getDataNode(node){
  try{
    for(var i=0,n=node.childNodes.length;i<n;i++){
      if(node.childNodes[i].nodeType == 4){
        return node.childNodes[i];
      }
    }
    return;
  }
  catch(e){
    onKaizouException(e);
  }
}

// Retrieves the cdata value of a DOM Node
function getDataValue(node){
  try{
    var dnode = getDataNode(node);
    if(dnode != null){
      return dnode.data;
    }
    return;
  }
  catch(e){
    onKaizouException(e);
  }
}

// Retrieves the text node of a DOM Node
function getTextNode(node){
  try{
    for(var i=0,n=node.childNodes.length;i<n;i++){
      if(node.childNodes[i].nodeType == 3){
        return node.childNodes[i];
      }
    }
    return;
  }
  catch(e){
    onKaizouException(e);
  }
}

// Retrieves the text value of a DOM Node
function getTextValue(node){
  try{
    var tnode = getTextNode(node);
    if(tnode != null){
      return tnode.data;
    }
    return;
  }
  catch(e){
    onKaizouException(e);
  }
}

// Retrieves a random child of a node matching a given tag name
function getRandomChild(node,name){
  try{
    var candidates = node.getElementsByTagName(name);
    if(candidates){
      var index = parseInt(Math.random() * candidates.length);
      return candidates[index];
    }
    return;
  }
  catch(e){
    onKaizouException(e);
  }
}

// Retrieves the first child of a node matching a given tag name
function getFirstChild(node,name){
  try{
    var candidates = node.getElementsByTagName(name);
    if(candidates){
      return candidates[0];
    }
    return;
  }
  catch(e){
    onKaizouException(e);
  }
}

// Retrieves the text value of the first child of a node knowing its name    
function getFirstChildTextValue(node,name){
  try{
    var child = getFirstChild(node,name);
    if(child){
      return getTextValue(child);
    }
    return;
  }
  catch(e){
    onKaizouException(e);
  }
}

// Retrieves the cdata value of the first child of a node knowing its name    
function getFirstChildDataValue(node,name){
  try{
    var child = getFirstChild(node,name);
    if(child){
      return getDataValue(child);
    }
    return;
  }
  catch(e){
    onKaizouException(e);
  }
}

// Retrieves the text value of a random child of a node knowing its name    
function getRandomChildTextValue(node,name){
  try{
    var child = getRandomChild(node,name);
    if(child){
      return getTextValue(child);
    }
    return;
  }
  catch(e){
    onKaizouException(e);
  }
}

// Retrieves the text value of a random child of a node knowing its name    
function getRandomChildDataValue(node,name){
  try{
    var child = getRandomChild(node,name);
    if(child){
      return getDataValue(child);
    }
    return;
  }
  catch(e){
    onKaizouException(e);
  }
}

// Retrieves the value of the attribute of a node    
function getNodeAttribute(node,name){
  try{
    var attlist = node.attributes;
    var att = attlist.getNamedItem(name);
    if(att) return att.value;
  }
  catch(e){
    onKaizouException(e);
  }
}

// Builds a javascript Regexp from a 'regular' regexp
function getProperRegexp(str){
  // Extract the javascript pattern and modifier
  var e = /\/?([^\/]*)\/?([g,i,m]{1,2})?/;
  if(str.match(e)){
    var pattern = RegExp.$1;
    var modifier = RegExp.$2;
  	var reg = new RegExp(pattern,modifier);
  	return reg;
  }else{
    return null;
  }
}

// Inserts a node before another node
function insertAfter(newNode,node){
  return node.parentNode.insertBefore(newNode,node.nextSibling);
}

// Select target nodes of a doc for a given XPATH
function selectNodes(doc,path){
  if(window.ActiveXObject){
   return document.evaluate(path,
                       document,
                       null,
                       XPathResult.ANY_TYPE,
                       null);
  }else{
   return doc.evaluate(path,
                       doc,
                       null,
                       XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                       null);
  }
}

// Get the filename to be used to save a Kaizou file 
function getFilenameFromTitle(doc){
  var title = getFirstChildTextValue(doc,"title");
  // Remove invalid charachters from title
  var re = /[\*\."\/\\\[\]\:\;\|\=\,<>\s]/g;
  return (title.replace(re,"_") + ".xml");
}
