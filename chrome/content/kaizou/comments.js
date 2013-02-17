//  Copyright (c) 2006, David Corvoysier
//  Released under the GPL license
//  http://www.gnu.org/copyleft/gpl.html
//
// File: comments.js
// Description: Kaizou comments magic

// Insert a comment div in the middle of a text
function commentText(doc,oNode,action,author){
	if(oNode!=null){
		if(oNode.nodeType==3){
		  // Get the pattern of the text to comment
      var pattern = getFirstChildTextValue(action,"pattern");
      var reg = getProperRegexp(pattern);
      if(reg!=null){
        // Get a random comment text among those available
        var message = getRandomChildTextValue(action,"message");
        // Search for pattern in node data
  			var oldText = oNode.data;
  			var index = oldText.search(reg);
  			if(index != -1){
  			  // Get the matching text to be commented
  			  var commented = oldText.match(reg);
  				// Trim the text node
  				oNode.replaceData(index,oNode.data.length - index,'');
  				// Create a new div node to wrap everything we will add
  				var divWrapper = doc.createElement('div');
  				divWrapper.setAttribute("style","display:inline;position:relative;");
  				// Define the DIV innerHTML
  				var innerTop = "<a class='info' href='#'" 
            +  "onMouseOver=\"this.childNodes[1].style.display='block';\""
            +  "onMouseOut=\"this.style.backgroundColor='#ccc';this.childNodes[1].style.display='none';\""
            +  "style='background-color:#ccc;color:#000;text-decoration:none;'>";
  				var innerMiddle = "<div style='display: none;position:absolute;top:-1em;left:2em;"
  				  + "z-index:200;width:291px;color:#000;text-align: center;'>"
  				  + "<div style='background-color:#FFF;background:transparent "
            + " url(chrome://kaizou/content/resources/comment-top.png) top left no-repeat;'>"
  				  + "<div style='padding:0.1em 1em;padding-left:22px;padding-right:0.5em;background:none;"
  				  + "color:#333333;font-size:12px;font-weight:normal;margin: 15px 0 0 0;text-align:justify;"
            + "font-family:Verdana, Arial, Helvetica, sans-serif;font-style:normal;white-space:normal;'>";
          var innerMessage = "<B>" + (author ? author : "Anonymous") + " :</B><br />" + message;
  				var innerBottom = "</div></div><div style='background:url(chrome://kaizou/content/resources/comment-footer.png) " 
                          + "no-repeat;height:15px;'></div></div></a>";
          // Wrap everything
          divWrapper.innerHTML = innerTop + commented[0] + innerMiddle + innerMessage + innerBottom;
  				// If needed, Create a new text node to wrap the end of the text
  				var afterText = oldText.slice(index + commented[0].length,oldText.length);
  				afterTextNode = doc.createTextNode(afterText);
  				// Insert trailing text right after the old one
  				var newNode = insertAfter(afterTextNode,oNode);
  				// Insert the div in the middle
  				oNode.parentNode.insertBefore(divWrapper,newNode);
  			}
			}
		}
	}
}
