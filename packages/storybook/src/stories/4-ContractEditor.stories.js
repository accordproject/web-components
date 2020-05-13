import React, { useCallback, useEffect, useState, useRef } from 'react';
import { SlateTransformer } from '@accordproject/markdown-slate';
import 'semantic-ui-css/semantic.min.css';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import { text, select, boolean, object } from '@storybook/addon-knobs';
import styled from 'styled-components';
import { ContractEditor } from '@accordproject/cicero-ui';
import { Template, Clause } from '@accordproject/cicero-core';

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
    line-height: 1.4285em;
    position: relative;
  }
`;

export default { title: 'Contract Editor' };

const templates = {
  'Late Delivery And Penalty': 'https://templates.accordproject.org/archives/latedeliveryandpenalty@0.15.0.cta',
  'Fragile Goods': 'https://templates.accordproject.org/archives/fragile-goods@0.13.1.cta'
};

export const contractEditor = () => {
  const markdownText = text( 'Markdown', `# Heading One
This is text. This is *italic* text. This is **bold** text. This is a [link](https://clause.io). This is \`inline code\`.  
`);
  const templateUrl = select('Template Archive URL', templates, 'https://templates.accordproject.org/archives/latedeliveryandpenalty@0.15.0.cta');
  const refUse = useRef(null);
  const lockText = boolean('lockText', true);
  const readOnly = boolean('readOnly', false);
  const [slateValue, setSlateValue] = useState( () => {
    return slateTransformer.fromMarkdown(markdownText).document.children;
  });

  useEffect( () => {
      Template.fromUrl(templateUrl)
      .then((template) => {
        const clause = new Clause(template);
        clause.parse(template.getMetadata().getSample());
        clause.draft({ wrapVariables: true })
        .then((drafted) => {
          const clauseMarkdown = `${markdownText}
\`\`\` <clause src="${templateUrl}" clauseid="123">
${drafted}
\`\`\``;
          const slateValue = slateTransformer.fromMarkdown(clauseMarkdown);
          setSlateValue(slateValue.document.children);
        });
      });
  }, [templateUrl, markdownText]);

  const onContractChange = useCallback((value) => {
    setSlateValue(value);
    action('contract-changed')(value);
  }, []);

  const clausePropsObject = {
    CLAUSE_DELETE_FUNCTION: action('clause-deleted'),
    CLAUSE_EDIT_FUNCTION: action('clause-edit'),
    CLAUSE_TEST_FUNCTION: action('clause-test')
  };

  return (
    <Wrapper>
      <ContractEditor
        value={slateValue}
        onChange={onContractChange}
        lockText={lockText}
        readOnly={readOnly}
        ref={refUse}
        clauseProps={clausePropsObject}
        loadTemplateObject={action('load-template')}
        pasteToContract={action('paste-to-contract')}
        onClauseUpdated={action('clause-updated')}
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
