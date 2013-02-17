//  Copyright (c) 2006, David Corvoysier
//  Released under the GPL license
//  http://www.gnu.org/copyleft/gpl.html
//
// File: urlCheck.js
// Description: Checks Kaizouability of an URL against a pattern
//
// Note: Part of this code is inspired from Greasemonkey
// See http://greasemonkey.mozdev.org for details about greasemonkey 

// This transforms a 'wildcard' url pattern to a real regexp
function convert2RegExp( pattern ) {
  s = new String(pattern);
  res = new String("^");
  
  for (var i = 0 ; i < s.length ; i++) {
    switch(s[i]) {
      case '*' : 
        res += ".*";
        break;
        
      case '.' : 
      case '?' :
      case '^' : 
      case '$' : 
      case '+' :
      case '{' :
      case '[' : 
      case '|' :
      case '(' : 
      case ')' :
      case ']' :
        res += "\\" + s[i];
        break;
      
      case '\\' :
        res += "\\\\";
        break;
      
      case ' ' :
        // Remove spaces from URLs.
        break;
      
      default :     
        res += s[i];
        break;
    }
  }
  return res;
}

// Use regexp to match an URL against an URL pattern
function URLMatch(url,pattern){
	return url.match(convert2RegExp(pattern));
}

// Is this url a target for this kaizou document ?
function isTargetOf(url,doc){
  try{
    // Go to the target node
    var target = doc.getElementsByTagName("target");
    if(target && (target.length>0)){
      // Get target URIs
      var uris = target[0].getElementsByTagName("uri");
      if(uris){
    		for(var i=0,n=uris.length;i<n;i++){
    		  // Get the URI
    		  var uri = getTextValue(uris[i]);
    		  // Does it match ?
    		  if(URLMatch(url,uri)) return true;
    		}  
  		}
      // Get target patterns
      var patterns = target[0].getElementsByTagName("pattern");
      if(patterns){
    		for(var i=0,n=patterns.length;i<n;i++){
    		  // Get the pattern
    		  var pattern = getTextValue(patterns[i]);
    		  // Does it match ?
    		  if(URLMatch(url,pattern)) return true;
    		}  
  		}
    }
    return false;
  }
  catch(e){
    alert("isTargetOf: " + e);
    return false;
  }
}
