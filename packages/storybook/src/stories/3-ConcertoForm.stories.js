import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { text, boolean, object } from '@storybook/addon-knobs';
import { ConcertoForm, ModelBuilderVisitor } from '@accordproject/ui-concerto';
import { ConcertoMetamodel, TestModel } from './concerto.models';

export default {
  title: 'Concerto Form',
  component: ConcertoForm,
  parameters: {
    componentSubtitle: 'Create dynamic forms from Concerto models',
    knobs: {
      escapeHTML: false,
    },
  }
};

export const SimpleExample = () => {
  const readOnly = boolean('Read-only', false);
  const type = text('Type', 'test.Person');
  const options = object('Options', {
    includeOptionalFields: true,
    includeSampleData: 'sample',
    updateExternalModels: true,
    checkboxStyle: 'toggle',
    hiddenFields: [
      'org.accordproject.base.Transaction.transactionId',
      'org.accordproject.cicero.contract.AccordContract.contractId',
      'org.accordproject.cicero.contract.AccordClause.clauseId',
      'org.accordproject.cicero.contract.AccordContractState.stateId',
    ],
  });
  const model = text('Model', TestModel);

  const handleValueChange = (json) => {
    return action("value changed")(json);
  };

  options.relationshipProvider = {
    getOptions: (field) => {
      if (field.getFullyQualifiedTypeName() === 'test.Person') {
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
      }
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <ConcertoForm
        readOnly={readOnly}
        models={[model]}
        options={options}
        type={type}
        json={null}
        onValueChange={handleValueChange}
      />
    </div>
  )
};


export const ModelBuilder = () => {
  const readOnly = boolean('Read-only', false);
  const type = text('Type', 'concerto.metamodel.ModelFile');
  const options = object('Options', {
    includeOptionalFields: false,
    updateExternalModels: false,
    visitor: new ModelBuilderVisitor(),
    customSelectors: {
      types: [
        { text: 'Contract', value: 'org.accordproject.cicero.contract.AccordContract' },
        { text: 'Party', value: 'org.accordproject.cicero.contract.AccordParty' }
      ]
    }
  });
  const model = text('Model', ConcertoMetamodel);

  const handleValueChange = (json) => {
    return action("value changed")(json);
  };

  return (
    <div style={{ padding: '10px' }}>
      <ConcertoForm
        readOnly={readOnly}
        models={[model]}
        options={options}
        type={type}
        json={null}
        onValueChange={handleValueChange}
      />
    </div>
  )
};
