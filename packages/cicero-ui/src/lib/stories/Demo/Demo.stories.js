import React, { useCallback, useState, useRef } from 'react';
import { Clause, Template } from '@accordproject/cicero-core';
import { SlateTransformer } from '@accordproject/markdown-slate';
import styled from 'styled-components';
import { render } from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import ContractEditor from '../../ContractEditor';

import docs from '../../../README.md';

const slateTransformer = new SlateTransformer();

const templateUri = 'https://templates.accordproject.org/archives/latedeliveryandpenalty@0.15.0.cta';

const templateUri2 = 'https://templates.accordproject.org/archives/acceptance-of-delivery@0.13.1.cta';

const templateUri3 = 'https://templates.accordproject.org/archives/volumediscountulist@0.2.1.cta';

const clauseText = `Late Delivery and Penalty.
----

In case of delayed delivery<if id="forceMajeure" value="%20except%20for%20Force%20Majeure%20cases%2C" whenTrue="%20except%20for%20Force%20Majeure%20cases%2C" whenFalse=""/>
<variable id="seller" value="%22Dan%22"/> (the Seller) shall pay to <variable id="buyer" value="%22Steve%22"/> (the Buyer) for every <variable id="penaltyDuration" value="2%20days"/>
of delay penalty amounting to <variable id="penaltyPercentage" value="10.5"/>% of the total value of the Equipment
whose delivery has been delayed. Any fractional part of a <variable id="fractionalPart" value="days"/> is to be
considered a full <variable id="fractionalPart" value="days"/>. The total amount of penalty shall not however,
exceed <variable id="capPercentage" value="55.0"/>% of the total value of the Equipment involved in late delivery.
If the delay is more than <variable id="termination" value="15%20days"/>, the Buyer is entitled to terminate this Contract.`;

const clauseText2 = `Acceptance of Delivery.
----

<variable id="shipper" value="%22Party%20A%22"/> will be deemed to have completed its delivery obligations
if in <variable id="receiver" value="%22Party%20B%22"/>'s opinion, the <variable id="deliverable" value="%22Widgets%22"/> satisfies the
Acceptance Criteria, and <variable id="receiver" value="%22Party%20B%22"/> notifies <variable id="shipper" value="%22Party%20A%22"/> in writing
that it is accepting the <variable id="deliverable" value="%22Widgets%22"/>.

Inspection and Notice.
----

<variable id="receiver" value="%22Party%20B%22"/> will have <variable id="businessDays" value="10"/> Business Days to inspect and
evaluate the <variable id="deliverable" value="%22Widgets%22"/> on the delivery date before notifying
<variable id="shipper" value="%22Party%20A%22"/> that it is either accepting or rejecting the
<variable id="deliverable" value="%22Widgets%22"/>.

Acceptance Criteria.
----

The "Acceptance Criteria" are the specifications the <variable id="deliverable" value="%22Widgets%22"/>
must meet for the <variable id="shipper" value="%22Party%20A%22"/> to comply with its requirements and
obligations under this agreement, detailed in <variable id="attachment" value="%22Attachment%20X%22"/>, attached
to this agreement.`;

const clauseText3 = `Volume-Based Card Acceptance Agreement [Abbreviated]
----

This Agreement is by and between Card, Inc., a New York corporation, and you, the Merchant. By accepting the Card, you agree to be bound by the Agreement.
Discount means an amount that we charge you for accepting the Card, which amount is:
1. a percentage (Discount Rate) of the face amount of the Charge that you submit, or a flat per-
   Transaction fee, or a combination of both; and/or
1. a Monthly Flat Fee (if you meet our requirements).

Transaction Processing and Payments. Our Card acceptance, processing, and payment requirements are set forth in the Merchant Regulations. Some requirements are summarized here for ease of reference, but do not supersede the provisions in the Merchant Regulations.
Payment for Charges. We will pay you, through our agent, according to your payment plan in US dollars for the face amount of Charges submitted from your Establishments less all applicable deductions, rejections, and withholdings, which include:
1. the Discount,
1. any amounts you owe us or our Affiliates,
1. any amounts for which we have Chargebacks and
1. any Credits you submit.

Your initial Discount is indicated in the Agreement or otherwise provided to you in writing by us. In addition to your Discount we may charge you additional fees and assessments, as listed in the Merchant Regulations or as otherwise provided to you in writing by us. We may adjust any of these amounts and may change any other amount we charge you for accepting the Card.

### SETTLEMENT

#### Settlement Amount.

Our agent will pay you according to your payment plan, as described below, in US dollars for the face amount of Charges submitted from your Establishments less all applicable deductions, rejections, and withholdings, which include:
1. the Discount,
1. any amounts you owe us or our Affiliates,
1. any amounts for which we have Chargebacks, and
1. any Credits you submit.

Our agent will subtract the full amount of all applicable deductions, rejections, and withholdings, from this payment to you (or debit your Bank Account), but if it cannot, then you must pay it promptly upon demand.

#### Discount.

The Discount is determined according to the following table:

- <variable id="volumeAbove" value="0.0"/>$ million <= Volume < <variable id="volumeUpTo" value="1.0"/>$ million : <variable id="rate" value="3.1"/>%
- <variable id="volumeAbove" value="1.0"/>$ million <= Volume < <variable id="volumeUpTo" value="10.0"/>$ million : <variable id="rate" value="3.1"/>%
- <variable id="volumeAbove" value="10.0"/>$ million <= Volume < <variable id="volumeUpTo" value="50.0"/>$ million : <variable id="rate" value="2.9"/>%
- <variable id="volumeAbove" value="50.0"/>$ million <= Volume < <variable id="volumeUpTo" value="500.0"/>$ million : <variable id="rate" value="2.5"/>%
- <variable id="volumeAbove" value="500.0"/>$ million <= Volume < <variable id="volumeUpTo" value="1000.0"/>$ million : <variable id="rate" value="1.2"/>%
- <variable id="volumeAbove" value="1000.0"/>$ million <= Volume < <variable id="volumeUpTo" value="1000000.0"/>$ million : <variable id="rate" value="0.1"/>%
`;

const getContractSlateVal = () => {
  const lateDeliveryandPenaltyClause = `\`\`\` <clause src="${templateUri}" clauseid="123">
  ${clauseText}
  \`\`\`
  `;

  const acceptanceOfDeliveryClause = `\`\`\` <clause src="${templateUri2}" clauseid="345">
${clauseText2}
\`\`\`
`;

  const volumeDiscountList = `\`\`\` <clause src="${templateUri3}" clauseid="678">
  ${clauseText3}
  \`\`\`
  `;

  const defaultContractMarkdown = `# Heading One
  This is text. This is *italic* text. This is **bold** text. This is a [link](https://clause.io). This is \`inline code\`.
  

  Paragraph in between
  
  ${acceptanceOfDeliveryClause}

  second Paragraph in between

  ${lateDeliveryandPenaltyClause}

  third

  ${volumeDiscountList}
  
  Fin.
  `;
  return slateTransformer.fromMarkdown(defaultContractMarkdown);
  // return defaultContractMarkdown;
};

/**
 * Parses user inputted text for a template using Cicero
 * @param {object} clauseNode The slate node of the clause.
 * @returns {Promise} The result of the parse or an error.
 */
const parseClause = (template, clauseNode) => {
  try {
    const clauseNodeJson = clauseNode.toJSON();
    const ciceroClause = new Clause(template);
    const slateTransformer = new SlateTransformer();
    const value = {
      document: {
        nodes: clauseNodeJson.nodes
      }
    };
    const text = slateTransformer.toMarkdown(value, { wrapVariables: false });
    ciceroClause.parse(text);
    const parseResult = ciceroClause.getData();
    console.log(parseResult);
  } catch (error) {
    console.log(error);
  }
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

export default { title: "'Components/Demo" };

export const demo = () => {
  const refUse = useRef(null);
  const [templateObj, setTemplateObj] = useState({});
  const [lockText, setLockText] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
  const [slateValue, setSlateValue] = useState(() => {
    const slate = getContractSlateVal();
    return slate.document.children;
  });

  const fetchTemplateObj = async (uri) => {
    try {
      if (!templateObj[uri]) {
        const template = await Template.fromUrl(uri);
        setTemplateObj({ ...templateObj, [uri]: template });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Called when the data in the contract editor has been modified
   */
  const onContractChange = useCallback((value) => { setSlateValue(value); }, []);

  return (
    <Wrapper>
      <ContractEditor
        value={slateValue}
        onChange={onContractChange}
        lockText={lockText}
        readOnly={readOnly}
        ref={refUse}
        // loadTemplateObject={fetchTemplateObj}
        onClauseUpdated={() => console.log('Demo')}
      />
    </Wrapper>
  );
};

demo.story = {
  component: demo,
  decorators: [withA11y, withKnobs],
  parameters: {
    notes: docs
  }
};
