/* React */
import React, { useCallback, useEffect, useState } from 'react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

/* Accord Project */
import { SlateTransformer } from '@accordproject/markdown-slate';
import { TemplateMarkTransformer } from '@accordproject/markdown-template';
import { Template, Clause, TemplateLibrary, version } from '@accordproject/cicero-core';
import ContractEditor from '@accordproject/ui-contract-editor';

/* Storybook */
import { action } from '@storybook/addon-actions';
import { text, select, boolean, object } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react'

/* Slate */
import { Editor, Node, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';

/* Misc */
import { uuid } from 'uuidv4';
import styled from 'styled-components';

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

const markdownText = `# Heading One
This is text. This is *italic* text. This is **bold** text. 
This is a [link](https://clause.io). This is \`inline code\`.
`;

export const contractEditor = () => {
  const lockText = boolean('lockText', true);
  const readOnly = boolean('readOnly', false);
  const [slateValue, setSlateValue] = useState( () => {
    return slateTransformer.fromMarkdown(markdownText).document.children;
  });
  const [editor, setEditor] = useState(null);
  const [templates, setTemplates] = useState([]);
  const templateUrl = select('Insert Template', templates);  

  useEffect( () => {
    const templateLibrary = new TemplateLibrary();
    templateLibrary.getTemplateIndex( {latestVersion: true, ciceroVersion: version.version} )
    .then( (index) => {
      const temp = {};  
      console.log(index);
      Object.keys(index).forEach(uri => {
        temp[index[uri].displayName] = index[uri].url
      });
      setTemplates(temp);
    });
  }, []);

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

    if(!val.data.src) {
      return Promise.resolve(true);
    }
    const SLICE_INDEX_1 = val.data.src.lastIndexOf('/') + 1;
    const SLICE_INDEX_2 = val.data.src.indexOf('@');
    const TEMPLATE_NAME = val.data.src.slice(SLICE_INDEX_1, SLICE_INDEX_2);

    try {
      const newReduxState = store.getState();
      const value = {
        document: {
          children: val.children
        }
      };
      const text = slateTransformer.toMarkdown(value);
      const ciceroClause = new Clause(newReduxState[TEMPLATE_NAME]);
      ciceroClause.parse(text)
      const parseResult = ciceroClause.getData();
      action('Clause -> Parse: ')({
        clause: TEMPLATE_NAME,
        parseResult,
      });
      return Promise.resolve(true);

      /* XXX What do we do with this? - JS
      const something = await ciceroClause.draft({format:'slate'});
      const found = val.children[1].children.filter(element => element.type === 'formula' && element.data.name === 'formula');
      action('Clause -> Parse: ')({
        'Clause': ciceroClause,
        'AST': ast,
        'Draft': something
      });
      const path = ReactEditor.findPath(newReduxState.editor, found[0]);
      const newConditional = {
        object: 'inline',
        type: 'formula',
        data: { name: "formula", elementType: "Double" },
        children: [{ object: "text", text: `${Math.round(Math.random() * 10)}` }]
      };
      Editor.withoutNormalizing(newReduxState.editor, () => {
        Transforms.removeNodes(newReduxState.editor, { at: path });
        Transforms.insertNodes(newReduxState.editor, newConditional, { at: path });
      });
      */
    } catch (err) {
      action('Clause -> Parse: ')({
        clause: TEMPLATE_NAME,
        parseError: err
      });
      return Promise.resolve(false);
    }

  }, [editor]);

  let timeoutId;
  const debouncedParseClause = node => new Promise((resolve) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout((n) => {
      resolve(parseClause(n));
    }, 500, node);
  });

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
        onClauseUpdated={debouncedParseClause}
        augmentEditor={augmentEditor}
      />
    </Wrapper>
  );
};

contractEditor.parameters = {
  notes: "Notes ...."
};


const withProvider = (contractEditor) => <Provider store={store}>{contractEditor()}</Provider>;

export default { title: 'Contract Editor', decorators: [withProvider] };
