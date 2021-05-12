import { Transforms } from 'slate';
import { CiceroMarkTransformer } from '@accordproject/markdown-cicero';
import { HtmlTransformer } from '@accordproject/markdown-html';
import { SlateTransformer } from '@accordproject/markdown-slate';

/* eslint no-param-reassign: 0 */

/**
 * Extends the editor'features by incorporating HTML feature.
 * 
 * @param {Object} editor Editor to be improved
 * @returns {object} Editor with HTML functionality
 */
export const withHtml = (editor) => {
  const { insertData } = editor;

  editor.insertData = (data) => {
    const HTML_DOM = data.getData('text/html');
    const PLAIN_DOM = data.getData('text/plain');
    if (HTML_DOM || PLAIN_DOM) {
      try {
        const htmlTransformer = new HtmlTransformer();
        const slateTransformer = new SlateTransformer();
        const ciceroMarkTransformer = new CiceroMarkTransformer();

        const SLATE_DOM = HTML_DOM
          ? slateTransformer
            .fromCiceroMark(htmlTransformer.toCiceroMark(HTML_DOM))
          : slateTransformer
            .fromCiceroMark(ciceroMarkTransformer.fromMarkdown(PLAIN_DOM));

        Transforms.insertFragment(editor, SLATE_DOM.document.children);
      } catch (err) {
        console.error(err);
      }
      return;
    }

    insertData(data);
  };

  return editor;
};

export default withHtml;
