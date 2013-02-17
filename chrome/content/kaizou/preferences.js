//  Copyright (c) 2006, David Corvoysier
//  Released under the GPL license
//  http://www.gnu.org/copyleft/gpl.html
//
// File: preferences.js
// Description: Kaizou preferences management routines

function getKaizouPrefsInterface(){
    // Define our preferences root
    var rootPref = "kaizou.";
    // Get an interface on our preferences branch
    return Components.classes["@mozilla.org/preferences-service;1"].
                  getService(Components.interfaces.nsIPrefService).
                  getBranch(rootPref);
}

// Retreives the path to the permanent kaizou files
function getKaizouPath(){
  try{
    // Get an interface on our preferences branch
    var prefs = getKaizouPrefsInterface();
    // Get the path to our kaizou description files
    var prefType = prefs.getPrefType("path");
    if (prefType == prefs.PREF_INVALID) {
      // Nothing has been defined yet
      var file = Components.classes["@mozilla.org/file/directory_service;1"]
                        .getService(Components.interfaces.nsIProperties)
                        .get("ProfD", Components.interfaces.nsIFile);
      // Define the default Kaizou path
      file.append("kaizou");
      // Set default Kaizou path
      prefs.setCharPref("path",file.path);
      return file.path    
    }else{
      return prefs.getCharPref("path");
    } 
  }
  catch(e){
    alert(e);
  }
}

// Retreives the stored author
function getKaizouPrefAuthor(){
  try{
    // Get an interface on our preferences branch
    var prefs = getKaizouPrefsInterface();
    // Get the author (if any)
    var prefType = prefs.getPrefType("author");
    if (prefType == prefs.PREF_INVALID) {
      return null;   
    }else{
      return prefs.getCharPref("author");
    } 
  }
  catch(e){
    alert(e);
  }
}

// Stores the Kaizou author
function setKaizouPrefAuthor(author){
  try{
    // Get an interface on our preferences branch
    var prefs = getKaizouPrefsInterface();
    prefs.setCharPref("author",author); 
  }
  catch(e){
    alert(e);
  }
}
