//  Copyright (c) 2006, David Corvoysier
//  Released under the GPL license
//  http://www.gnu.org/copyleft/gpl.html
//
// File: transform.js
// Description: Kaizou transformation functions


// 'img-over' action handler
// returns the inserted img node
function insertImg(doc,node,action){
  if(node.parentNode!=null){
    // Get the image src
    var src = getFirstChildTextValue(action,"src");
    // Get the image relative x positioning
    var xpos = getFirstChildTextValue(action,"xpos");
    // Get the image relative y positioning
    var ypos = getFirstChildTextValue(action,"ypos");
    if((src != null)&&(xpos!=null)&&(ypos!=null)){
      // Create a new div node, positioned relatively to the target node
      var div = doc.createElement('div');
      div.setAttribute("style","display:inline;position:relative;");
      // For IE
      div.style.cssText = "display:inline;position:relative;vertical-align:top";
      // Create a new img node
      var img = doc.createElement('img');
      img.setAttribute("src",src);
      // Use CSS to position the image outside (position 'absolute')
      // and on top (z-index: 200) of the current document 'flow' 
      img.setAttribute("style","position:absolute;" 
                            +  " left:" + xpos + "px;"
                            +  " top:" + ypos + "px;"
                            +  " border: none;"
                            +  " margin: none;"
                            +  " padding: none;"
                            +  " z-index:200;");
      // For IE
      img.style.cssText = "position:absolute;" 
                            +  " left:" + xpos + "px;"
                            +  " top:" + ypos + "px;"
                            +  " border: none;"
                            +  " margin: none;"
                            +  " padding: none;"
                            +  " z-index:200;";
      // Optionally set width
      var width = getFirstChildTextValue(action,"width");
      if(width) img.setAttribute("width",width);
      // Optionally set height
      var height = getFirstChildTextValue(action,"height");
      if(height) img.setAttribute("height",height);
      // Insert new image in the div
      div.appendChild(img);
      // Insert div right after the target node
      return insertAfter(div,node);
    }
  }
  return null;
}

// 'regexp-data' action handler
function regexpData(node,action){
	if(node!=null){
		if(node.nodeType==3){
  	  // Get the pattern
  	  var patternStr = getFirstChildTextValue(action,"pattern");
  	  // Extract the javascript pattern and modifier
      var e = /\/?([^\/]*)\/?([g,i,m]{1,2})?/;
  	  if(patternStr.match(e)){
    	  var pattern = RegExp.$1;
    	  var modifier = RegExp.$2;
    	  // Get the substitution
    	  var substitution = getRandomChildTextValue(action,"substitution");
  			var oldText = node.data;
  			// Build a new Regexp object
  			var reg = new RegExp(pattern,modifier);
  			var index = oldText.search(reg);
  			if(index != -1){
  			  // Replace the text
  			  var newText = oldText.replace(reg,substitution);
  				// Update the text node
  				node.data = newText;
  			}
			}
		}
	}
}

// 'set-attr' action handler
function setAttrib(node,action){
  // Get the attribute name
  var name = getFirstChildTextValue(action,"name");
  // Get the attribute value
  var value = getFirstChildTextValue(action,"value");
  node.setAttribute(name,value);
}

// 'inner-html' action handler
function innerHTML(node,action){
  // Get the inner HTML to insert
  var html = getFirstChildDataValue(action,"html");
  if(html == null){
    html = getFirstChildTextValue(action,"html");
  }
  node.innerHTML = html;
}

// 'insert-node' action handler
function insertNode(doc,node,action){
  // Get the node name to be inserted
  var name = getNodeAttribute(action,"name");
  // Do we insert before or after ?
  var after = getNodeAttribute(action,"after") ? 
    (getNodeAttribute(action,"after") == "true") : false;
  // Get the inner HTML to insert
  var html = getFirstChildDataValue(action,"html");
  if(html == null){
    html = getFirstChildTextValue(action,"html");
  }
  var newNode = doc.createElement(name);
  newNode.innerHTML = html;
  if(after){
    insertAfter(newNode,node);
  }else{
    node.parentNode.insertBefore(newNode,node);
  }
}

// Perform Kaizou actions on target doc starting at a given node 
function performActions(target,doc,node,actions){
  for(var i=0,n=actions.length;i<n;i++){
    var action = actions[i];
    if(action.nodeType==1){
  	  // Get the action type
  	  var type;
      if(window.ActiveXObject){
        type = action.baseName.toLowerCase();
      }else{
        type = action.localName.toLowerCase();
      }
  	  switch(type){
  	   case "comment":
  	    var author = getFirstChildTextValue(doc,"author");
        commentText(target,node,action,author); // in comments.js
        break;
       case "regexp-data":
        regexpData(node,action);
        break;
       case "set-attr":
        setAttrib(node,action);
        break;
       case "img-over":
        insertImg(target,node,action);
        break;
       case "inner-html":
        innerHTML(node,action);
        break;
       case "insert-node":
        insertNode(target,node,action);
        break;
       default:
        break;
      } 
    } 
  }
}

// Apply transformations described in doc to target 
function applyTransformations(target,doc){
  try{
    // Go to the transformation node
    var transformations = doc.getElementsByTagName("transform");
    if(transformations){
  		for(var i=0,n=transformations.length;i<n;i++){
  		  // Get the path
  		  var path = getFirstChildTextValue(transformations[i],"xpath");  
        // Get the actions
        var actions = getFirstChild(transformations[i],"actions");
        if(actions){		  
    		  // Select nodes
          var targetNodes = selectNodes(target,path);
          if(window.ActiveXObject){
            var node;
		        while((node = targetNodes.iterateNext()) != null){
              // Tag this document as being modified
              target.kaizoued = true;
              // Perform actions on the node
              performActions(target,doc,node,actions.childNodes);
		        }
          }else{
            var j=0;
            while ( (node = targetNodes.snapshotItem(j) ) !=null ){
              // Tag this document as being modified
              target.kaizoued = true;
              // Perform actions on the node
              performActions(target,doc,node,actions.childNodes);
              j++;
            }
          }
        }    		  
  		}
    }  
  }
  catch(e){
    alert("Exception: " + e.name + "\n" + e.message);
  }
}
