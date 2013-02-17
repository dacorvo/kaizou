//  Copyright (c) 2006, David Corvoysier
//  Released under the GPL license
//  http://www.gnu.org/copyleft/gpl.html
//
// File: http.js
// Description: Kaizou file HTTP retrieval function

// Error handler
function onKaizouError(e){
  alert("Error " + e.target.status + " occurred while receiving the document.");
}

// Get a Kaizou file at a given URL
function getKaizouFileAtURL(url){
  var req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.onerror = onKaizouError;
  // Use an anonymous function to support reentrance
  req.onload = function (){
    if(req.responseXML){
      // Get the Kaizou document
      var kaizouDoc = req.responseXML.documentElement;
      if(kaizouDoc){
        var target = getFirstChild(kaizouDoc,"target");
        if(target){
          var uri = getRandomChildTextValue(target,"uri");
          if(uri){
          // Set the next doc to be loaded
          _nextDoc = kaizouDoc;
          // Set refCount
          _refCount = 1;
          // Open the target URI
          window.content.location.href = uri;
          return;
          }
        }
      }
    }
    alert("Error: invalid Kaizou link");
  }
  req.send(null);
}
