import React, { useCallback, useEffect, useState } from 'react';
import { SlateTransformer } from '@accordproject/markdown-slate';
import { TemplateMarkTransformer } from '@accordproject/markdown-template';
import 'semantic-ui-css/semantic.min.css';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { text, select, boolean, object } from '@storybook/addon-knobs';
import styled from 'styled-components';
import ContractEditor from '@accordproject/ui-contract-editor';
import { Template, Clause } from '@accordproject/cicero-core';
import { Editor, Node, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { uuid } from 'uuidv4';

const slateTransformer = new SlateTransformer();

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
  'Fixed Interest': 'https://templates.accordproject.org/archives/fixed-interests@0.4.1.cta',
  'Late Delivery And Penalty': 'https://templates.accordproject.org/archives/latedeliveryandpenalty@0.15.0.cta',
  'Fragile Goods': 'https://templates.accordproject.org/archives/fragile-goods@0.13.1.cta'
};

export const contractEditor = () => {
  const markdownText = text( 'Markdown', `# Heading One
This is text. This is *italic* text. This is **bold** text. This is a [link](https://clause.io). This is \`inline code\`.  
`);
  const templateUrl = select('Template Archive URL', templates, 'https://templates.accordproject.org/archives/fixed-interests@0.4.1.cta');
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
          clause.parse(template.getMetadata().getSample());
          const slateValueNew = await clause.draft({ format: 'slate' });

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
          Transforms.insertNodes(editor, slateClause, { at: Editor.end(editor, [])});
        });
    }
  }, [templateUrl, markdownText, editor]);

  const onContractChange = useCallback((value) => {
    setSlateValue(value);
    action('contract-changed')(value);
  }, [editor]);

  const clausePropsObject = {
    CLAUSE_DELETE_FUNCTION: action('clause-deleted'),
    CLAUSE_EDIT_FUNCTION: action('clause-edit'),
    CLAUSE_TEST_FUNCTION: action('clause-test')
  };

  const augmentEditor = useCallback((slateEditor) => {
    setEditor(slateEditor);
    // set editor on redux store
    return slateEditor;
  }, []);

  const parseClause = useCallback((val) => {
    // get editor from redux state
    // const newReduxState = store.getState();
    console.log('<<>>', val)
    const value = {
      document: {
        children: val.children
      }
    };
    const text = slateTransformer.toMarkdown(value);
    console.log('text', text)

    Template.fromUrl(templateUrl)
      .then(async (template) => {
        const ciceroClause = new Clause(template);
        ciceroClause.parse(text);
        const ast = ciceroClause.getData();
        console.log('!!!!', ast)
        const something = await ciceroClause.draft({format:'slate'});
        console.log('????', something)

        const found = val.children[1].children.filter(element => element.type === 'variable' && element.data.name === 'loanAmount');
        console.log('found', found)
        console.log('editor', editor)
        
        const path = ReactEditor.findPath(editor, found[0]);
        console.log('path', path)
        const newConditional = {
          object: 'inline',
          type: 'variable',
          data: { name: "rate222", elementType: "Double" },
          children: [{ object: "text", text: "2.5" }]
        };
        Transforms.insertNodes(editor, newConditional, { at: path });
      });
  }, [editor]);

  const onClauseUpdatedHandler = useCallback((val) => {
    parseClause(val);
    action('clause-updated')(val);
  }, [editor, parseClause])

  return (
    <Wrapper>
      <ContractEditor
        value={slateValue}
        onChange={onContractChange}
        lockText={lockText}
        readOnly={readOnly}
        clauseProps={clausePropsObject}
        loadTemplateObject={action('load-template')}
        pasteToContract={action('paste-to-contract')}
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
