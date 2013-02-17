//  Copyright (c) 2006, David Corvoysier
//  Released under the GPL license
//  http://www.gnu.org/copyleft/gpl.html
//
// File: jar.js
// Description: Kaizou chrome jar functions

// 14/12/2006 for some reason calling getChromeFiles("*/overlays/*");
// twice crashes Firefox 1.5.
// We'll stick to returning hard-coded values for overlays until it is fixed ...

// Get a list of file URLs contained in our chrome jar matching a given pattern
function getChromeFiles(pattern){
  // Instantiate the result array
  var results = new Array();
  // We need to specify the id of our extension
  const id = "{b8ccaffc-1f41-45bf-ad7a-1c730d9a4656}";
  // Get the location of our extension
  var ext = Components.classes["@mozilla.org/extensions/manager;1"]
                      .getService(Components.interfaces.nsIExtensionManager)
                      .getInstallLocation(id)
                      .getItemLocation(id);  
  // Point to our jar file
  ext.append("chrome");
  ext.append("kaizou.jar");
  // Get a Zip Reader object
  var zipReader = Components.classes["@mozilla.org/libjar/zip-reader;1"]
                    .getService(Components.interfaces.nsIZipReader);
  // Init and open the Zip Reader
  zipReader.init(ext);
  zipReader.open();
  // Return entries
  var entries = zipReader.findEntries(pattern);
  while(entries.hasMoreElements()) {
    var zipEntry = entries.getNext().QueryInterface(Components.interfaces.nsIZipEntry);
    // We need to build a real chrome URI based on the zipEntry name
    var reg = /content\/kaizou\/(.*)$/;
    if(zipEntry.name.match(reg)){
      results.push("chrome://kaizou/content/" + RegExp.$1);
    }
  }    
  // Close the Zip Reader
  zipReader.close();
  // Return
  return results;
}
