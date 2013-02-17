/* Original code from XPather,  Author: Viktor Zigo, http://xpath.alephzarro.com */

// frame association object
function Frame(aNode){
    this.frameNode=aNode;
    this.frameDoc=aNode.ownerDocument;
    this.frameContent=aNode.contentDocument;
    this.frameUri=aNode.src;
    this.frameName=aNode.name;
}

Frame.prototype = {
    getXPath: function(kwds){
        return generateXPath(this.frameNode, null, null, kwds);
    },
    toString: function(){
        return "frm:"+this.frameNode + " doc:"+this.frameDoc 
        + "cnt:"+this.frameContent + " uri:"+this.frameUri + " name:"+this.frameName + "\n";
    }
}

// frame collection object
function Frames(aRootDoc){
    this.refresh(aRootDoc);
}

Frames.prototype = {
    rootDoc:null,
    frames:[],
    refresh:function(aRootDoc){
        this.rootDoc = aRootDoc;
        this.frames = [];
        this._collectFrames(this.rootDoc);        
    },
    _collectFrames:function(aDocNode) {
        var immediateFrames = []

        this._concatCollection( aDocNode.getElementsByTagName("frame"), immediateFrames );
        this._concatCollection( aDocNode.getElementsByTagName("iframe"), immediateFrames );
        
        this._addAll( immediateFrames );
        for (var i=0; i<immediateFrames.length; i++) {
            var frameDocument = immediateFrames[i].contentDocument;
            if (frameDocument)
               this._collectFrames(frameDocument);
        }
    } ,
    _concatCollection:function(aCollection, anArray){
        for (var i=0; i<aCollection.length; i++) anArray.push( aCollection.item(i) );
        return anArray;
    },
    _addAll:function(nodelist){
        for (var i=0; i<nodelist.length; i++) this.frames.push( new Frame(nodelist[i]) )
    },
    getAllDocuments:function(){
        var alldoc = new Array(this.rootDoc);
        for (var i in this.frames) alldoc.push( this.frames[i].frameContent);
        return alldoc;
    },
    getFrameForURI:function(uri){
      for (var i in this.frames){
        if(this.frames[i].frameUri == uri) return this.frames[i];
      }
      return null;
    },
    getFrameForDoc:function(doc){
      for (var i in this.frames){
        if(this.frames[i].frameContent == doc) return this.frames[i];
      }
      return null;
    },
    getFrameForName:function(name){
      for (var i in this.frames){
        if(this.frames[i].frameName == name) return this.frames[i];
      }
      return null;
    },
    toString:function(){
        var str ="";
        for(var i in this.frames) {
            str+=this.frames[i].toString();
        }
        return str;
    }
}
