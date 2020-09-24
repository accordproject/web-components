/* eslint-disable react/display-name */
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* React */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ReactEditor } from 'slate-react';
import { Editor, Node, Point, Transforms } from 'slate';

/* Components */
import { MarkdownEditor } from './node_modules/@accordproject/ui-markdown-editor';
import ClauseComponent from '../components/Clause';
import Variable from '../components/Variable';
import Conditional from '../components/Conditional';
import Optional from '../components/Optional';
import Formula from '../components/Formula';

/* Plugins */
import withClauseSchema, {
  CLAUSE,
  CONDITIONAL,
  FORMULA,
  OPTIONAL,
  VARIABLE
} from './plugins/withClauseSchema';
import withClauses, { isEditableClause } from './plugins/withClauses';
import withVariables, { isEditableVariable } from './plugins/withVariables';

/**
 * Adds the current value to local storage
 */
const storeLocal = (value) => {
  localStorage.setItem('contract-editor', value.toJSON());
};

/**
 * Default contract props
 */
const contractProps = {
  value: {
    object: 'value',
    document: {
      object: 'document',
      data: {},
      nodes: [{
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [{
          object: 'text',
          text: 'Welcome! Edit this text to get started.',
          marks: []
        }],
      }]
    }
  },
  onChange: storeLocal,
  plugins: []
};

/**
 * ContractEditor React component, which wraps a markdown-editor
 * and assigns the ClausePlugin.
 *
 * @param {*} props the properties for the component
 */
const ContractEditor = (props) => {
  const [hoveringFormulaContract, setHoveringFormulaContract] = useState(false);
  const [formulaNode, setFormulaNode] = useState(null);
  const withClausesProps = {
    onClauseUpdated: props.onClauseUpdated,
    pasteToContract: props.pasteToContract
  };

  const isFormulaDependency = useCallback((editor, variableNode) => {
    let formulaClauseName;
    let isVariableFormulaDependency = false;
    if (!hoveringFormulaContract || !formulaNode) return isVariableFormulaDependency;
    const formulaPATH = ReactEditor.findPath(editor, formulaNode);
    const variablePATH = ReactEditor.findPath(editor, variableNode);
    // eslint-disable-next-line no-restricted-syntax
    for (const [n] of Node.ancestors(editor, formulaPATH, { reverse: true })) {
      if (n.type === CLAUSE) { formulaClauseName = n.data.name; }
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const [n] of Node.ancestors(editor, variablePATH, { reverse: true })) {
      if (
        n.type === CLAUSE
        && n.data.name === formulaClauseName
        && formulaNode.data.dependencies.includes(variableNode.data.name)
      ) {
        isVariableFormulaDependency = true;
      }
    }
    return isVariableFormulaDependency;
  }, [hoveringFormulaContract, formulaNode]);

  const customElements = (attributes, children, element, editor) => {
    const CLAUSE_PROPS = {
      templateUri: (element.data && element.data.src) ? element.data.src : '',
      name: (element.data && element.data.name) ? element.data.name : '',
      error: element.error,
      clauseProps: props.clauseProps,
      readOnly: props.readOnly,
      hoveringFormulaContract,
      attributes,
      editor,
    };
    const VARIABLE_PROPS = {
      element,
      editor,
      isFormulaDependency,
      ...attributes
    };
    const CONDITIONAL_PROPS = {
      readOnly: props.readOnly,
      attributes
    };
    const FORMULA_PROPS = {
      name: (element.data && element.data.name) ? element.data.name : '',
      className: FORMULA,
      setHoveringFormulaContract,
      setFormulaNode,
      attributes,
      editor,
    };
    const OPTIONAL_PROPS = {
      readOnly: props.readOnly,
      attributes,
    };
    const returnObject = {
      [CLAUSE]: () => (<ClauseComponent {...CLAUSE_PROPS}>{children}</ClauseComponent>),
      [VARIABLE]: () => (<Variable {...VARIABLE_PROPS}>{children}</Variable>),
      [CONDITIONAL]: () => (<Conditional {...CONDITIONAL_PROPS}>{children}</Conditional>),
      [FORMULA]: () => (<Formula {...FORMULA_PROPS}>{children}</Formula>),
      [OPTIONAL]: () => (<Optional {...OPTIONAL_PROPS}>{children}</Optional>),
    };
    return returnObject;
  };


  const augmentEditor = editor => (
    props.augmentEditor
      ? props.augmentEditor(withVariables(withClauses(withClauseSchema(editor), withClausesProps)))
      : withVariables(withClauses(withClauseSchema(editor), withClausesProps))
  );

  const isEditable = (editor, event) => {
    if (editor.isInsideClause()) {
      const [clauseNode] = editor.getClauseWithPath();
      if (clauseNode.data.parseable === false) return true;
    }
    return isEditableClause(editor, event) && isEditableVariable(props.lockText, editor, event);
  };

  const canCopy = editor => (!((
    editor.isInsideClause(editor.selection.anchor)
    || editor.isInsideClause(editor.selection.focus)
  )));

  const canKeyDown = (editor, event) => {
    if (
      (event.keyCode || event.charCode) === 8
      && Point.equals(Editor.start(editor, editor.selection.anchor.path), editor.selection.anchor)
    ) {
      const [match] = Editor
        .nodes(editor, { at: Editor.previous(editor)[1], match: n => n.type === CLAUSE });
      return !match;
    }
    return true;
  };

  const onDragStart = (editor, event) => {
    event.stopPropagation();
    const node = ReactEditor.toSlateNode(editor, event.target);
    const path = ReactEditor.findPath(editor, node);
    const range = Editor.range(editor, path);
    event.dataTransfer.setData('text', JSON.stringify(range));
  };

  const onDragOver = (editor, event) => {
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  };

  // return true if should continue through to next handler, else return false
  const onDrop = (editor, event) => {
    event.preventDefault();
    const targetRange = ReactEditor.findEventRange(editor, event);
    const [targetIsClause] = Editor
      .nodes(editor, { match: n => n.type === CLAUSE, at: targetRange });
    if (targetIsClause) return false; // do not allow dropping inside of a clause
    const sourceRange = JSON.parse(event.dataTransfer.getData('text'));
    const clauseNodeAndPath = editor.getClauseWithPath(sourceRange);
    if (!clauseNodeAndPath) return true; // continue to next handler if not a clause
    const node = ReactEditor.toSlateNode(editor, event.target);
    const path = ReactEditor.findPath(editor, node);

    const nodes = [...Node.ancestors(editor, path, { reverse: false })];
    // first node is root editor so second will be top level after root editor
    const topLevelNodeAndPath = nodes[1];
    // if no top level after editor then the node was already a top level node so use its own path
    const topLevelPath = topLevelNodeAndPath ? topLevelNodeAndPath[1] : path;
    if (topLevelPath.length) {
      Transforms.select(editor, topLevelPath);
    } else {
      // if top level is empty array then we are at the editor level & should use the target range
      Transforms.select(editor, targetRange);
    }

    let edge = 'end';
    // if at the top level node, use the offset to determine which half we are in
    if (topLevelPath === path || (path[1] === 0 && path[0] === topLevelPath[0])) {
      const midpoint = Node.get(editor, targetRange.focus.path).text.length / 2;
      if (targetRange.focus.offset < midpoint) {
        edge = 'start';
      }
    } else { // if not at the top level node
      // divy up the children & see where the target child is in relation to middle child
      const midChild = [...Node.children(editor, topLevelPath)].length / 2;
      if (path[1] < midChild) {
        edge = 'start';
      }
    }
    Transforms.collapse(editor, { edge });
    Transforms.removeNodes(editor, { at: sourceRange.anchor.path, match: n => n.type === CLAUSE });
    Transforms.insertNodes(editor, clauseNodeAndPath[0]);
    return false;
  };

  // console.log('value: ', JSON.stringify(props.value));

  return (
    // <ClauseContext.Provider value={hoveringFormulaContract}>
    <MarkdownEditor
      augmentEditor={augmentEditor}
      isEditable={isEditable}
      value={props.value || contractProps.value}
      onChange={props.onChange || contractProps.onChange}
      customElements={customElements}
      lockText={props.lockText}
      readOnly={props.readOnly}
      canBeFormatted={editor => !props.lockText || !editor.isInsideClause()}
      canCopy={canCopy}
      canKeyDown={canKeyDown}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      activeButton={props.activeButton}
      data-testid='editor'
  />
  // </ClauseContext.Provider>
  );
};


/**
 * The property types for this component
 */
ContractEditor.propTypes = {
  activeButton: PropTypes.object,
  augmentEditor: PropTypes.func,
  value: PropTypes.array,
  onChange: PropTypes.func,
  lockText: PropTypes.bool,
  readOnly: PropTypes.bool,
  pasteToContract: PropTypes.func,
  clauseMap: PropTypes.object,
  clauseProps: PropTypes.shape({
    CLAUSE_DELETE_FUNCTION: PropTypes.func,
    CLAUSE_EDIT_FUNCTION: PropTypes.func,
    CLAUSE_TEST_FUNCTION: PropTypes.func,
  }),
  onClauseUpdated: PropTypes.func,
  onUndoOrRedo: PropTypes.func,
  plugins: PropTypes.arrayOf(PropTypes.shape({
    onEnter: PropTypes.func,
    onKeyDown: PropTypes.func,
    name: PropTypes.string.isRequired,
    augmentSchema: PropTypes.func,
  })),
};

export default ContractEditor;
