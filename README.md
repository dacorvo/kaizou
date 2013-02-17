# Kaizou Firefox extension

Disclaimer: this is obsolete stuff that I keep here so that it doesn't disappear.

## About kaizou

Kaizou is a format for describing modifications to be applied to a web page after it has been loaded into a browser.

Kaizou can be used in many ways:

- share your thoughts on a particular page by commenting it,
- provide an unofficial revamping of a specific web page,
- apply a text converter to any page (like 'see the web as yoda does').

Kaizou files can either be installed locally in your Kaizou cache to be applied automatically, or embedded in special links called 'klinks'

When clicking on a klink, a compatible browser would load the corresponding remote Kaizou file and apply it temporarily to the target page.

Firefox used to support Kaizou in a stand-alone fashion, using the Kaizou Firefox Extension.

On Kaizou.org, a server-implementation was also available for other browsers.

Once you had installed the extension, you could start using it by clicking on Klinks stored in (now gone) the Kaizou repository.

You could also create your own Kaizou files by using the Kaizou editor included in the extension.

## The Kaizou format

A Kaizou file contains several transformations that should be applied when the page has been loaded into the browser.

Each transformation applies only to a subset of the page identified by a specific selector that is applied to the page Document Object Model (DOM). This selector uses the XPATH syntax to specify the list of nodes that are targeted by the transformation.

Each transformation is composed of a set of actions of one of the following types:

- alter text using a regular expression (applies only to text nodes),

- comment text (applies only to text nodes),

- modify an attribute,

- insert an overlay image.

The Kaizou format is based on XML (see kaizou.xsd).
