//  Copyright (c) 2006, David Corvoysier
//  Released under the GPL license
//  http://www.gnu.org/copyleft/gpl.html
//
// File: file.js
// Description: Kaizou file IO functions

// File input/output modes reminder
//PR_RDONLY     =0x01 lecture seulement
//PR_WRONLY     =0x02 écriture seulement
//PR_RDWR       =0x04 lecture ou écriture
//PR_CREATE_FILE=0x08 si le fichier n'existe pas, il est créé (sinon, sans effet)
//PR_APPEND     =0x10 le fichier est positionné à la fin avant chaque écriture
//PR_TRUNCATE   =0x20 si le fichier existe, sa taille est réduite à zéro
//PR_SYNC       =0x40 chaque écriture attend que les données ou l'état du fichier soit mis à jour
//PR_EXCL       =0x80 idem que PR_CREATE_FILE, sauf que si le fichier existe, NULL est retournée

function serializeXMLtoFile(file,dom){
  try{
    // Acquire the file output stream interface 
    var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
                  .createInstance(Components.interfaces.nsIFileOutputStream);
    // Set flags PR_RDWR + PR_CREATE_FILE + PR_TRUNCATE
    var outputMode = 0x04 | 0x08 | 0x20;
    // Set rights
    var rights = 0664;
    // Init output stream
    outputStream.init(file, outputMode, rights, 0);
    // Serialize to stream
    var serializer = new XMLSerializer();
    serializer.serializeToStream(dom,outputStream,"UTF-8");
    // Close stream
    outputStream.close();
  }
  catch(e)
  {
  	alert(e);
  }
}

// Read a file corresponding to an nsIFile Object
function readFile(file){
  try{
    // If file doesn't exist, return
    if ( file.exists() != true) {
      return;
    }
    // Acquire the file input stream interface 
    var inputStream = Components.classes["@mozilla.org/network/file-input-stream;1"]
           .createInstance( Components.interfaces.nsIFileInputStream );
    // Set flags PR_RDONLY
    var inputMode = 0x01;
    // Set rights
    var rights = 00004;
    // Init input stream
    inputStream.init(file, inputMode, rights, null);
    // Acquire the binary stream interface
    var sis = Components.classes["@mozilla.org/binaryinputstream;1"]
            .createInstance(Components.interfaces.nsIBinaryInputStream);
    // Bind it to opened stream
    sis.setInputStream(inputStream);
    // Read file content
    var output = sis.readBytes(sis.available());
    // Return file content
    return(output);
  }
  catch(e)
  {
    alert(e);
    return;
  }
}

// Read a file corresponding to a path
function readFileAt(filepath){
  try{
    // Acquire the file interface
    var file =  Components.classes["@mozilla.org/file/local;1"]
                  .createInstance(Components.interfaces.nsILocalFile);
    // Init local file with file path (MUST be an absolute path)
    file.initWithPath(filepath);
    // Read the file
    return readFile(file);
  }
  catch(e)
  {
    alert(e);
    return;
  }
}

function saveKaizouDocument(file,doc){
  // Write document to disk
  serializeXMLtoFile(file,doc);
}
