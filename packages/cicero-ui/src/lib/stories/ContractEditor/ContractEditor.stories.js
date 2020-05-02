import React, { useCallback, useState, useRef } from 'react';
import { SlateTransformer } from '@accordproject/markdown-slate';
import 'semantic-ui-css/semantic.min.css';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import styled from 'styled-components';
import docs from '../../ContractEditor/README.md';
import ContractEditor from '../../ContractEditor';

const slateTransformer = new SlateTransformer();

const templateUri = 'https://templates.accordproject.org/archives/latedeliveryandpenalty@0.15.0.cta';
const clauseText = `Late Delivery and Penalty.
----

In case of delayed delivery<if id="forceMajeure" value="%20except%20for%20Force%20Majeure%20cases%2C" whenTrue="%20except%20for%20Force%20Majeure%20cases%2C" whenFalse=""/>
<variable id="seller" value="%22Dan%22"/> (the Seller) shall pay to <variable id="buyer" value="%22Steve%22"/> (the Buyer) for every <variable id="penaltyDuration" value="2%20days"/>
of delay penalty amounting to <variable id="penaltyPercentage" value="10.5"/>% of the total value of the Equipment
whose delivery has been delayed. Any fractional part of a <variable id="fractionalPart" value="days"/> is to be
considered a full <variable id="fractionalPart" value="days"/>. The total amount of penalty shall not however,
exceed <variable id="capPercentage" value="55.0"/>% of the total value of the Equipment involved in late delivery.
If the delay is more than <variable id="termination" value="15%20days"/>, the Buyer is entitled to terminate this Contract.`;

const getContractSlateVal = () => {
  const Clause = `\`\`\` <clause src="${templateUri}" clauseid="123">
${clauseText}
\`\`\`
`;

  const defaultContractMarkdown = `# Heading One
This is text. This is *italic* text. This is **bold** text. This is a [link](https://clause.io). This is \`inline code\`.  
${Clause}
`;

  return slateTransformer.fromMarkdown(defaultContractMarkdown);
};

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

export default { title: "'Components/Contract Editor" };

export const contractEditor = () => {
  const refUse = useRef(null);
  const [templateObj, setTemplateObj] = useState({});
  const [lockText, setLockText] = useState(true);
  const readOnly = boolean('readOnly', false);
  const [slateValue, setSlateValue] = useState(() => {
    const slate = getContractSlateVal();
    return slate.document.children;
  });

  const onContractChange = useCallback((value) => {
    setSlateValue(value);
  }, []);

  const parseClauseFunction = () => console.log('parseClauseFunction');
  const loadTemplateObjectFunction = () => console.log('loadTemplateObjectFunction');
  const pasteToContractFunction = () => console.log('pasteToContractFunction');

  const clausePropsObject = {
    CLAUSE_DELETE_FUNCTION: () => console.log('CLAUSE_DELETE_FUNCTION'),
    CLAUSE_EDIT_FUNCTION: () => console.log('CLAUSE_EDIT_FUNCTION'),
    CLAUSE_TEST_FUNCTION: () => console.log('CLAUSE_TEST_FUNCTION')
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
        loadTemplateObject={loadTemplateObjectFunction}
        pasteToContract={pasteToContractFunction}
        onClauseUpdated={parseClauseFunction}
      />
    </Wrapper>
  );
};

contractEditor.story = {
  component: contractEditor,
  decorators: [withA11y, withKnobs],
  parameters: {
    notes: docs
  }
};
