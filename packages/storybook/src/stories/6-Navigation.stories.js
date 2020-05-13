import React from "react";
import { withA11y } from "@storybook/addon-a11y";
import { withKnobs, text, boolean } from "@storybook/addon-knobs";
import { Navigation } from '@accordproject/cicero-ui';

export default { title: 'Navigation' };
export const navigation = () => {

  const mockNavigateToHeader = () =>{
    alert('Insert your navigation function here')
  }
  const navigationPropsInput = {
    NAVIGATE_SWITCH_TITLE_ACTIVE_COLOR : text('NAVIGATE_SWITCH_TITLE_ACTIVE_COLOR',''),
    NAVIGATE_SWITCH_TITLE_INACTIVE_COLOR : text('NAVIGATE_SWITCH_TITLE_INACTIVE_COLOR',''),
    NAVIGATE_SWITCH_TITLE_FONT_FAMILY : text('NAVIGATE_SWITCH_TITLE_FONT_FAMILY',''),
    NAVIGATE_SWITCH_FILES_VISIBLE : boolean('NAVIGATE_SWITCH_FILES_VISIBLE',false),

    NAVIGATION_POSITION : text('NAVIGATION_POSITION',''),
    NAVIGATION_TOP_VALUE : text('NAVIGATION_TOP_VALUE',''),
    NAVIGATION_MAX_HEIGHT : text('NAVIGATION_MAX_HEIGHT',''),
    NAVIGATION_WIDTH : text('NAVIGATION_WIDTH',''),
    NAVIGATION_BACKGROUND_COLOR : text('NAVIGATION_BACKGROUND_COLOR',''),

    CONTRACT_NAVIGATION_HEADER_COLOR : text('CONTRACT_NAVIGATION_HEADER_COLOR',''),
    CONTRACT_NAVIGATION_CLAUSE_COLOR : text('CONTRACT_NAVIGATION_CLAUSE_COLOR',''),
    CONTRACT_NAVIGATION_CLAUSE_HEADER_COLOR : text('CONTRACT_NAVIGATION_CLAUSE_HEADER_COLOR',''),

    CLAUSE_NAVIGATION_TITLE_COLOR : text('CLAUSE_NAVIGATION_TITLE_COLOR',''),
    CLAUSE_NAVIGATION_TITLE_HOVER_COLOR : text('CLAUSE_NAVIGATION_TITLE_HOVER_COLOR',''),
    CLAUSE_NAVIGATION_EXPANSION_ARROW_COLOR : text('CLAUSE_NAVIGATION_EXPANSION_ARROW_COLOR',''),
    CLAUSE_NAVIGATION_EXPANSION_ARROW_HOVER_COLOR : text('CLAUSE_NAVIGATION_EXPANSION_ARROW_HOVER_COLOR',''),
    CLAUSE_NAVIGATION_FILE_DELETE_COLOR : text('CLAUSE_NAVIGATION_FILE_DELETE_COLOR',''),
    CLAUSE_NAVIGATION_FILE_DELETE_HOVER_COLOR : text('CLAUSE_NAVIGATION_FILE_DELETE_HOVER_COLOR',''),
    CLAUSE_NAVIGATION_FILE_ADD_COLOR : text('CLAUSE_NAVIGATION_FILE_ADD_COLOR',''),
    CLAUSE_NAVIGATION_FILE_ADD_HOVER_COLOR : text('CLAUSE_NAVIGATION_FILE_ADD_HOVER_COLOR',''),
}
const headers=[{
  key: '1',
  text: text('clause text','clause'),
  type: 'clause'
},
{
  key: '2',
  text: text('heading_one text','heading_one'),
  type: 'heading_one'
},
{
  key: '3',
  text: text('heading_two text','heading_two'),
  type: 'heading_two'
},
{
  key: '4',
  text: text('heading_three text','heading_three'),
  type: 'heading_three'
},
]
  return (
    <Navigation
    headers={headers}
    navigateHeader={mockNavigateToHeader}
    navigationProps={navigationPropsInput}
      />
  );
};

navigation.story = {
  component: navigation,
  decorators: [withA11y, withKnobs],
  parameters: {
    notes: "Notes ...."
  }
};
