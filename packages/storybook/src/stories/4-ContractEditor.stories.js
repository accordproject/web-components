/* React */
import React, { useCallback, useEffect, useState } from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

/* Accord Project */
import { SlateTransformer } from '@accordproject/markdown-slate';
import { TemplateMarkTransformer } from '@accordproject/markdown-template';
import { Template, Clause } from '@accordproject/cicero-core';
import ContractEditor from '@accordproject/ui-contract-editor';

/* Storybook */
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { text, select, boolean, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react'

/* Slate */
import { Editor, Node, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

/* Misc */
import { uuid } from 'uuidv4';
import styled from 'styled-components';
import 'semantic-ui-css/semantic.min.css';

const slateTransformer = new SlateTransformer();

const ADD_TEMPLATE = 'ADD_TEMPLATE';
const ADD_EDITOR = 'ADD_EDITOR';

const addTemplate = template => ({ type: ADD_TEMPLATE, template });
const addEditor = editor => ({ type: ADD_EDITOR, editor });

const reducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_TEMPLATE:
      console.log('Added these templates to the store: ', action.template);
      return {
        ...state,
        [action.template.metadata.packageJson.name]: action.template
      };
    case ADD_EDITOR:
      console.log('Added editor to the store!');
      return {
        ...state,
        editor: action.editor
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

const Wrapper = styled.div`
  border-radius: 3px;
  border: 1px solid gray;
  margin: 50px;
  padding: 20px;
  width: min-content;
  blockquote {
    width: 80%;
    margin: 10px auto;
    padding: 1.0em 10px 1.2em 15px;
    border-left: 3px solid #484848;
    line-height: 1.5em;
    position: relative;
  }
`;

export default { title: 'Contract Editor' };

const templates = {
  'Optional Clause': 'https://parserv2--templates-accordproject.netlify.app/archives/latedeliveryandpenalty-optional@0.1.0.cta',
  'Fixed Interest': 'https://parserv2--templates-accordproject.netlify.app/archives/fixed-interests@0.5.0.cta',
  'Late Delivery And Penalty': 'https://templates.accordproject.org/archives/latedeliveryandpenalty@0.15.0.cta',
  'Fragile Goods': 'https://templates.accordproject.org/archives/fragile-goods@0.13.1.cta',
};

export const contractEditor = () => {
  const markdownText = text( 'Markdown', `# Heading One
This is text. This is *italic* text. This is **bold** text. This is a [link](https://clause.io). This is \`inline code\`.  
`);
  const templateUrl = select('Template Archive URL', templates, 'https://parserv2--templates-accordproject.netlify.app/archives/fixed-interests@0.5.0.cta');
  const lockText = boolean('lockText', true);
  const readOnly = boolean('readOnly', false);
  const [slateValue, setSlateValue] = useState( () => {
    return slateTransformer.fromMarkdown(markdownText).document.children;
  });
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (editor) {
      Template.fromUrl(templateUrl)
        .then(async (template) => {
          const clause = new Clause(template);
          // console.log('clause', clause);
          clause.parse(template.getMetadata().getSample());
          const slateValueNew = await clause.draft({ format: 'slate' });
          console.log('slateValueNew', slateValueNew);

          const extraMarkdown = `This is some more text after a clause. Test moving a clause by dragging it or by using the up and down arrows.`;
          const extraText = slateTransformer.fromMarkdown(extraMarkdown);
          const slateClause = [
            {
              children: slateValueNew.document.children,
              data: {
                src: templateUrl,
                name: uuid(),
              },
              object: 'block',
              type: 'clause',
            },
            ...extraText.document.children
          ]
          store.dispatch(addTemplate(template))
          Transforms.insertNodes(editor, slateClause, { at: Editor.end(editor, [])});
        });
    }
  }, [templateUrl, markdownText, editor]);

  const onContractChange = useCallback((value) => {
    setSlateValue(value);
    action('Contract -> Change: ')(value);
  }, [editor]);

  const clausePropsObject = {
    CLAUSE_DELETE_FUNCTION: action('Clause -> Deleted'),
    CLAUSE_EDIT_FUNCTION: action('Clause -> Edit'),
    CLAUSE_TEST_FUNCTION: action('Clause -> Test')
  };

  const augmentEditor = useCallback((slateEditor) => {
    setEditor(slateEditor);
    store.dispatch(addEditor(slateEditor))
    return slateEditor;
  }, []);

  const parseClause = useCallback(async (val) => {
    const newReduxState = store.getState();
    const value = {
      document: {
        children: val.children
      }
    };
    const text = slateTransformer.toMarkdown(value);

    const SLICE_INDEX_1 = val.data.src.lastIndexOf('/') + 1;
    const SLICE_INDEX_2 = val.data.src.indexOf('@');
    const TEMPLATE_NAME = val.data.src.slice(SLICE_INDEX_1, SLICE_INDEX_2);
    const ciceroClause = new Clause(newReduxState[TEMPLATE_NAME]);

    ciceroClause.parse(text);

    const ast = ciceroClause.getData();
    const something = await ciceroClause.draft({format:'slate'});

    const found = val.children[1].children.filter(element => element.type === 'formula' && element.data.name === 'formula');
    
    const path = ReactEditor.findPath(newReduxState.editor, found[0]);
    const newConditional = {
      object: 'inline',
      type: 'formula',
      data: { name: "formula", elementType: "Double" },
      children: [{ object: "text", text: `${Math.round(Math.random() * 10)}` }]
    };
    action('Clause -> Parse: ')({
      'Clause': ciceroClause,
      'AST': ast,
      'Draft': something
    });

    Editor.withoutNormalizing(newReduxState.editor, () => {
      Transforms.removeNodes(newReduxState.editor, { at: path });
      Transforms.insertNodes(newReduxState.editor, newConditional, { at: path });
    });

  }, [editor]);

  const onClauseUpdatedHandler = useCallback((val) => {
    parseClause(val);
    action('Clause -> Update: ')(val);
  }, [editor, parseClause])

  return (
    <Wrapper>
      <ContractEditor
        value={slateValue}
        onChange={onContractChange}
        lockText={lockText}
        readOnly={readOnly}
        clauseProps={clausePropsObject}
        loadTemplateObject={action('Template -> Load')}
        pasteToContract={action('Contract -> Paste')}
        onClauseUpdated={onClauseUpdatedHandler}
        augmentEditor={augmentEditor}
      />
    </Wrapper>
  );
};

contractEditor.story = {
  component: contractEditor,
  decorators: [withA11y],
  parameters: {
    notes: "Notes ...."
  }
};

const withProvider = (story) => <Provider store={store}>{story()}</Provider>

storiesOf("ContractEditor", module).addDecorator(withProvider);
