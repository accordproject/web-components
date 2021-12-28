import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { text, boolean, object } from '@storybook/addon-knobs';
import { ConcertoForm, ConcertoModelBuilder } from '@accordproject/ui-concerto';
import { TestModel } from './concerto.models';
import { MetaModel } from '@accordproject/concerto-core';

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
  const textOnly = boolean("Text-only", false);
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

  const handleValueChange = async (json) => {
    await action("new cto")(newCto);
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
    <div style={{ padding: "10px" }}>
      <ConcertoForm
        textOnly={textOnly}
        readOnly={readOnly}
        models={[model]}
        options={options}
        type={type}
        json={null}
        onValueChange={handleValueChange}
      />
    </div>
  );
};


export const ModelBuilder = () => {
  const textOnly = boolean("Text-only", false);
  const readOnly = boolean('Read-only', false);
  const type = text('Type', 'concerto.metamodel.ModelFile');
  const options = object('Options', {
    includeOptionalFields: false,
    updateExternalModels: false,
    customSelectors: {
      types: [
        { text: 'Contract', value: 'Contract' },
        { text: 'Party', value: 'Party' }
      ]
    }
  });

  const cto = text('Initial CTO', TestModel);
  let json = null;
  try {
    json = MetaModel.ctoToMetaModel(cto);
  } catch (error) {
      console.log(`Invalid CTO: [${error.message}]`);
  }
  const handleValueChange = async (json) => {
    let newCto;
    try {
      newCto = MetaModel.ctoFromMetaModel(json, true);
      await action("metamodel change")(json);
    } catch (error) {
      await action("Invalid metamodel")(json);
    }
    try {
      const roundtripForSafety = MetaModel.ctoToMetaModel(newCto);
      await action("New CTO")(newCto);
    } catch (error) {
      await action("Invalid CTO")(`[${error.message}]\n${newCto}`);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <ConcertoModelBuilder
        textOnly={textOnly}
        readOnly={readOnly}
        options={options}
        type={type}
        json={json}
        onValueChange={handleValueChange}
      />
    </div>
  );
};
