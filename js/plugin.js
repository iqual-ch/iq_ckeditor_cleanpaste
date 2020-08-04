/**
 * @fileOverview Plugin that removes format from pasted content.
 */

(function () {

  var loadedFilters = [],
    CleanPaste = CKEDITOR.tools.createClass({
      $: function () {
        this.handlers = [];
      },

      proto: {
        register: function (definition) {
          if (typeof definition.priority !== 'number') {
            definition.priority = 10;
          }

          this.handlers.push(definition);
        },

        addPasteListener: function (editor) {
          window.ckeditor = editor;
          editor.on('paste', function (evt) {

            var removeAttributes = editor._.removeAttributes || (editor._.removeAttributes = editor.config.removeFormatAttributes.split(','));
            var tagsRegex = editor._.removeFormatRegex || (editor._.removeFormatRegex = new RegExp('^(?:' + editor.config.removeFormatTags.replace(/,/g, '|') + ')$', 'i'));
            var filter = CKEDITOR.plugins.removeformat.filter;

            // create a virtual DOM from pasted data
            var parser = new DOMParser();
            var doc = parser.parseFromString(evt.data.dataValue, "text/html");

            // convert virtual DOM to CKEDITOR.dom.document and get first and last nodes
            var ckeDocument = new CKEDITOR.dom.document(doc);
            var startNode = ckeDocument.getBody().getChild(0),
              endNode = ckeDocument.getBody().getChild(ckeDocument.getBody().getChildren().count() - 1),
              currentNode = startNode;

            // Loop through all nodes which are dom elements
            while (currentNode && currentNode.type == CKEDITOR.NODE_ELEMENT) {
              // If we have reached the end of the selection, stop looping.
              if (currentNode.equals(endNode)) {
                break;
              }

              var nextNode = currentNode.getNextSourceNode(false, CKEDITOR.NODE_ELEMENT),
                isFakeElement = currentNode.getName() == 'img' && currentNode.data('cke-realelement');

              // This node must not be a fake element, and must not be read-only.
              if (!isFakeElement && filter(editor, currentNode)) {
                // Remove elements nodes that match with this style rules.
                if (tagsRegex.test(currentNode.getName()))
                  currentNode.remove(1);
                else {
                  currentNode.removeAttributes(removeAttributes);
                  editor.fire('removeFormatCleanup', currentNode);
                }
              }
              currentNode = nextNode;
            }

            // Get cleaned up DOM as string and paste it
            evt.data.dataValue = ckeDocument.getBody().getHtml();
          }, this, null, 3);
        }
      }
    });

  CKEDITOR.plugins.add('cleanpaste', {
    requires: 'clipboard',
    beforeInit: function (editor) {
      editor.cleanPaste = new CleanPaste();
      editor.cleanPaste.addPasteListener(editor);
    }
  });

})();
