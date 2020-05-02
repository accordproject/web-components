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
import React from 'react';
import PropTypes from 'prop-types';

/* Components */
import { MarkdownEditor } from '@accordproject/markdown-editor';
import ClauseComponent from '../components/Clause';
import Conditional from '../components/Conditional';

/* Plugins */
import withClauseSchema, { COMPUTED, VARIABLE } from './plugins/withClauseSchema';
import withClauses from './plugins/withClauses';
import withVariables, { isEditable } from './plugins/withVariables';

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
  const withClausesProps = {
    onClauseUpdated: props.onClauseUpdated,
    pasteToContract: props.pasteToContract
  };

  const customElements = (attributes, children, element) => {
    const returnObject = {
      clause: () => (
        <ClauseComponent
          templateUri={element.data.src}
          clauseId={element.data.clauseid}
          {...attributes}>
            {children}
        </ClauseComponent>
      ),
      variable: () => (
        <span id={element.data.id} {...attributes} className={VARIABLE}>{children}</span>
      ),
      conditional: () => (
        <Conditional readOnly={props.readOnly} {...attributes}>{children}</Conditional>
      ),
      computed: () => (
        <span id={element.data.id} {...attributes} className={COMPUTED}>{children}</span>
      )
    };
    return returnObject;
  };


  const augmentEditor = editor => (
    props.augmentEditor
      ? props.augmentEditor(withVariables(withClauses(withClauseSchema(editor), withClausesProps)))
      : withVariables(withClauses(withClauseSchema(editor), withClausesProps))
  );

  return (
    <MarkdownEditor
      augmentEditor={augmentEditor}
      isEditable={(...args) => isEditable(props.lockText, ...args)}
      value={props.value || contractProps.value}
      onChange={props.onChange || contractProps.onChange}
      customElements={customElements}
      lockText={props.lockText}
      readOnly={props.readOnly}
      canBeFormatted={editor => !props.lockText || !editor.isInsideClause()}
      // editorProps={{ ...props.editorProps, onUndoOrRedo: props.onUndoOrRedo }}
      data-testid='editor'
      // clausePluginProps={{
      //   loadTemplateObject: props.loadTemplateObject,
      //   onClauseUpdated: props.onClauseUpdated,
      //   pasteToContract: props.pasteToContract,
      //   clauseProps: props.clauseProps,
      //   clauseMap: props.clauseMap
      // }}
  />
  );
};

/**
 * The property types for this component
 */
ContractEditor.propTypes = {
  augmentEditor: PropTypes.func,
  value: PropTypes.object,
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
