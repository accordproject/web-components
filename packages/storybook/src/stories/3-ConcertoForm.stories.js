import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { text, boolean, object } from '@storybook/addon-knobs';
import { ConcertoForm } from '@accordproject/ui-concerto';
import 'semantic-ui-css/semantic.min.css';

export default {
  title: 'Concerto Form',
  component: ConcertoForm,
  parameters: {
    componentSubtitle: 'Create dynamic forms from Concerto models',
  }
};
export const Demo = () => {
  const readOnly = boolean('Read-only', false);
  const type = text('Type', 'test.Address');
  const options = object('Options', {
    includeOptionalFields: true,
    includeSampleData: 'sample',
    updateExternalModels: true,
    hiddenFields: [
      'org.accordproject.base.Transaction.transactionId',
      'org.accordproject.cicero.contract.AccordContract.contractId',
      'org.accordproject.cicero.contract.AccordClause.clauseId',
      'org.accordproject.cicero.contract.AccordContractState.stateId',
    ],
  });
  const model = text('Model', `namespace test 

  enum Country {
    o USA
    o UK
    o France
    o Sweden
  }

  concept Address {
    o String street
    o String city
    o String zipCode
    o Country country
  }
  `);

  const safeStringify = (jsonObject) => {
    try {
      if (typeof jsonObject === 'object') {
        return JSON.stringify(jsonObject, null, 2);
      }
      return JSON.stringify(JSON.parse(jsonObject), null, 2);
    } catch (err){
      return jsonObject;
    }
  };

  const [jsonValue, setJsonValue] = useState(null);
  return <div style={{ padding: '10px' }}>
    <ConcertoForm 
      readOnly={readOnly} 
      models={[model]} 
      options = {options}
      type={type} 
      json={jsonValue}
      onModelChange={({ types, json }) => {
        setJsonValue(safeStringify(json));
        return action("model changed")(json);
      }}
      onValueChange={(json) => {
        setJsonValue(safeStringify(json));
        return action("value changed")(json);
      }}
    />
  </div>
};
