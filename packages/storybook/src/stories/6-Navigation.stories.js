import React from "react";
import { withKnobs, text } from "@storybook/addon-knobs";
import { Navigation } from '@accordproject/ui-components';

export default { title: 'Navigation' };
export const navigation = () => {

  const mockNavigateToHeader = () =>{
    alert('Insert your navigation function here')
  }
  const headers=[{
    key: '1',
    text: text('clause text','This is a clause heading'),
    type: 'clause'
  },
  {
    key: '2',
    text: text('heading_one text','This is a H1 heading'),
    type: 'heading_one'
  },
  {
    key: '3',
    text: text('heading_two text','This is a H2 heading'),
    type: 'heading_two'
  },
  {
    key: '4',
    text: text('heading_three text','This is a H3 heading'),
    type: 'heading_three'
  },
  ]
  return (
    <Navigation
    headers={headers}
    navigateHeader={mockNavigateToHeader}
      />
  );
};

navigation.decorators = [withKnobs];
navigation.parameters = {
  notes: "Notes ...."
};
