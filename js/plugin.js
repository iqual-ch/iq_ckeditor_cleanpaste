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

            var removeAttributes = evt.editor.removeAttributes;
            var tagsRegex = evt.editor.removeFormatRegex;
            var filter = CKEDITOR.plugins.removeformat.filter;
            var currentNode,
              iterator = document.createNodeIterator(jQuery(evt.data.dataValue)[0]);

            while (currentNode = iterator.nextNode()) {
              // Check node and remove / clean it if necessary
              // Maybe something like this:
              //// if ( filter(editor, currentNode)) {
              ////   if (tagsRegex.test(currentNode.getName()))
              ////     currentNode.remove(1);
              ////   else {
              ////     currentNode.removeAttributes(removeAttributes);
              ////     window.editoreditor.fire('removeFormatCleanup', currentNode);
              ////   }
              //// }
            }
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
