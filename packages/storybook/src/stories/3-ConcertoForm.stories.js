import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { text, boolean, object } from '@storybook/addon-knobs';
import { ConcertoForm } from '@accordproject/ui-concerto';

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

  participant Person identified by name {
    o String name
  }

  concept Address {
    o String street
    o String city
    
    @FormEditor( "hide", true)
    o String zipCode
    o Country country
    --> Person owner optional
  }
  `);

  const handleValueChange = (json) => {
    return action("value changed")(json);
  };

  options.relationshipProvider = {
    getOptions : (field) => {
      if(field.getFullyQualifiedTypeName() === 'test.Person') {
        return [{
          key: '001',
          value: 'test.Person#Marissa',
          text: 'Marissa Mayer'
        },
        {
          key: '002',
          value: 'test.Person#Ada',
          text: 'Ada Lovelace'
        },
        {
          key: '003',
          value: 'test.Person#Grace',
          text: 'Grace Hopper'
        },
        {
          key: '004',
          value: 'test.Person#Lynn',
          text: 'Lynn Conway'
        },

        {
          key: '005',
          value: 'test.Person#Rosalind',
          text: 'Rosalind Picard'
        }
      ]
      }
      else {
        return null;
      }}
  };
  
  return (
    <div style={{ padding: '10px' }}>
      <ConcertoForm
        readOnly={readOnly}
        models={[model]}
        options = {options}
        type={type}
        json={null}
        onValueChange={handleValueChange}
      />
    </div>
  )
};
