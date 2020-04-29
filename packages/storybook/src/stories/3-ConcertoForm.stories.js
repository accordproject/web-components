import React from 'react';
import { action } from '@storybook/addon-actions';
import { text, boolean, object } from '@storybook/addon-knobs';
import { ConcertoForm } from '@accordproject/concerto-ui-react';

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
  const options = object('Options', {});
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
  return <ConcertoForm 
    readOnly={readOnly} 
    models={[model]} 
    options = {options}
    type={type} 
    json = "{}"
    onModelChange={action("model changed")} 
    onValueChange={action("value changed")}
  />
};
