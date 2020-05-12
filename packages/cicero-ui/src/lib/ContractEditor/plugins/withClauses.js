import { uuid } from 'uuidv4';
import { Editor, Node } from 'slate';
import { SlateTransformer } from '@accordproject/markdown-slate';
import { HtmlTransformer } from '@accordproject/markdown-html';
import _ from 'lodash';
import { CLAUSE, VARIABLE } from './withClauseSchema';

import '../../styles.module.css';

/**
   * Check if UI valid (depth first traversal)
   * @param {object} params - recursion params
   * @param {object} children - the Slate children
   */
function _recursive(params, children) {
  /* eslint no-underscore-dangle: 0 */
  children.forEach((child) => {
    const childType = child.type;
    switch (child.object) {
      case 'text':
        break;
      default: {
        // eslint-disable-next-line default-case
        switch (childType) {
          case 'computed':
            throw new Error('Computed variable not supported');
          case 'image':
            throw new Error('Image not supported');
          case 'ol_list':
          case 'ul_list': {
            if (child.data.kind === VARIABLE) {
              throw new Error('List variable not supported');
            } if (params.depth > 0) {
              throw new Error('Nested list not supported');
            } else {
              // Increment depth before handling a list children
              params.depth += 1;
            }
          }
        }
      }
    }

    // process any children, attaching to first child if it exists
    if (child.children) {
      _recursive(params, child.children);
    }
    // Decrement depth when coming out of a list
    if (childType === 'ol_list' || childType === 'ul_list') {
      params.depth -= 1;
    }
  });
}

export const isEditableClause = (editor, event) => {
  if (
    event.inputType === 'deleteContentForward'
    && Node.get(editor, editor.selection.focus.path).text.length === editor.selection.focus.offset
  ) {
    const [match] = Editor
      .nodes(editor, { at: Editor.next(editor)[1], match: n => n.type === CLAUSE });
    return !match;
  }
  return true;
};

/* eslint no-param-reassign: 0 */
const withClauses = (editor, withClausesProps) => {
  const { insertData, onChange } = editor;
  const { onClauseUpdated, pasteToContract } = withClausesProps;

  editor.isInsideClause = (input = editor.selection) => {
      const [match] = Editor.nodes(editor, { match: n => n.type === CLAUSE, at: input });
    return !!match;
  };

  editor.onChange = () => {
    if (onClauseUpdated && editor.isInsideClause()) {
      const debouncedOnClauseUpdated = _.debounce(onClauseUpdated, 1000, { maxWait: 10000 });
      const [clauseNode] = Editor.nodes(editor, { match: n => n.type === CLAUSE });
      debouncedOnClauseUpdated(clauseNode[0]);
    }
    onChange();
  };

  editor.insertData = (data) => {
    const HTML_DOM = data.getData('text/html');
    if (HTML_DOM) {
      try {
        const clausesToParseAndPaste = [];
        const htmlTransformer = new HtmlTransformer();
        const slateTransformer = new SlateTransformer();

        const SLATE_DOM = slateTransformer
          .fromCiceroMark(htmlTransformer.toCiceroMark(HTML_DOM));

        const NEW_SLATE_CHILDREN = SLATE_DOM.document.children.map(
          (child) => {
            if (child.type === CLAUSE) {
              child.data.clauseid = uuid();
              clausesToParseAndPaste.push(child);
            }
            return child;
          }
        );
        const NEW_SLATE_DOM = {
          object: 'value',
          document: {
            object: 'document',
            data: {},
            children: NEW_SLATE_CHILDREN
          }
        };

        clausesToParseAndPaste.forEach((clause) => {
          pasteToContract(clause.data.clauseid, clause.data.src);
          onClauseUpdated(editor, clause);
        });

        const NEW_HTML_DOM = htmlTransformer
          .toHtml(slateTransformer.toCiceroMark(NEW_SLATE_DOM));

        insertData({
          getData: format => (format === 'text/html'
            ? NEW_HTML_DOM
            : data.getData('text/plain')),
        });
        return;
      } catch (err) { console.error(err); }
    }
    insertData(data);
  };

  editor.isClauseSupported = (clauseNode) => {
    const params = { depth: 0 };
    let children;
    if (clauseNode.document) {
      children = clauseNode.document.children;
    } else {
      children = [clauseNode];
    }
    _recursive(params, children);
    return true;
  };

  return editor;
};

export default withClauses;
