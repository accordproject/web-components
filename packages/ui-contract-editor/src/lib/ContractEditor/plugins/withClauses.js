import { uuid } from 'uuidv4';
import { Editor, Node, Transforms, Path } from 'slate';
import { HistoryEditor } from 'slate-history';

import { SlateTransformer } from '@accordproject/markdown-slate';
import { HtmlTransformer } from '@accordproject/markdown-html';
import { CLAUSE, VARIABLE, FORMULA } from './withClauseSchema';
import getChildren from '../../utilities/getChildren';

import '../../styles.css';

/**
 * Returns a formula inline from clauseNode whose name
 * matches the name of the search formula
 * @param {*} clauseNode the input clause node
 * @param {*} search the formula to look for in the clause node
 */
export const findFormula = (clauseNode, search) => {
  const formulas = getChildren(clauseNode, (n) => n.type === FORMULA
    && n.data.name === search.data.name);
  return formulas && formulas.length > 0 ? formulas[0] : null;
};

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

  editor.getClauseWithPath = (location = editor.selection) => {
    const [clauseNodeAndPath] = Editor.nodes(
      editor,
      { match: n => n.type === CLAUSE, at: location }
    );
    return clauseNodeAndPath;
  };

  editor.isInsideClause = (location = editor.selection) => !!editor.getClauseWithPath(location);

  editor.onChange = () => {
    onChange();
    if (editor.isInsideClause()) {
      const [clauseNode, path] = editor.getClauseWithPath();
      const [variable] = Editor.nodes(editor, { match: n => n.type === VARIABLE });

      // if we have edited a variable, then we ensure that all
      // occurences of the variable get the new value
      if (variable && variable[0].data && variable[0].data.name) {
        const variableName = variable[0].data.name;
        const variableIterator = Editor.nodes(editor, { match: n => n.type === VARIABLE
          && n.data.name === variableName,
        at: path });
        let result = variableIterator.next();
        while (!result.done) {
          const entry = result.value;
          if (!Path.equals(entry[1], variable[1])) {
            const entryValue = Node.string(entry[0]);
            const variableValue = Node.string(variable[0]);
            if (entryValue !== variableValue) {
              const newNode = JSON.parse(JSON.stringify(variable[0]));
              HistoryEditor.withoutSaving(editor, () => {
                Editor.withoutNormalizing(editor, () => {
                  Transforms.removeNodes(editor, { at: entry[1] });
                  Transforms.insertNodes(editor, newNode, { at: entry[1] });
                });
              });
            }
          }
          result = variableIterator.next();
        }
      }

      if (onClauseUpdated) {
        onClauseUpdated(clauseNode).then(({ node, operation, error }) => {
          if (operation === 'replace_node') {
            Transforms.removeNodes(editor, { at: path });
            Transforms.insertNodes(editor, node, { at: path });
          } else if (operation === 'update_formulas') {
            // if we have edited a variable, then we ensure that all
            // formulas that depend on the variable are updated based on the values in 'node'
            if (variable && variable[0].data && variable[0].data.name) {
              const variableName = variable[0].data.name;
              const formulasIterator = Editor.nodes(editor, { match: n => n.type === FORMULA
                  && n.data.dependencies.includes(variableName),
              at: path });
              let result = formulasIterator.next();
              while (!result.done) {
                const formulaEntry = result.value;
                const newFormula = findFormula(node, formulaEntry[0]);
                if (newFormula) {
                  const oldFormulaValue = Node.string(formulaEntry[0]);
                  const newFormulaValue = Node.string(newFormula);
                  if (newFormulaValue !== oldFormulaValue) {
                    HistoryEditor.withoutSaving(editor, () => {
                      Editor.withoutNormalizing(editor, () => {
                        Transforms.removeNodes(editor, { at: formulaEntry[1] });
                        Transforms.insertNodes(editor, newFormula, { at: formulaEntry[1] });
                      });
                    });
                  }
                }
                result = formulasIterator.next();
              }
            }
          }

          // set or clear errors
          HistoryEditor.withoutSaving(editor, () => {
            Transforms.setNodes(editor, { error: !!error }, { at: path });
          });
        });
      }
    } // inside a clause
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
          onClauseUpdated(clause, true);
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

  editor.canAddClause = () => {
    // do not allow adding a clause in nested elements (ie. lists, other clauses)
    if (editor.selection) return (editor.selection.anchor.path.length <= 2);
    // do allow adding a clause if no selection (can add it to end of doc)
    return true;
  };

  return editor;
};

export default withClauses;
