import React from 'react';
import { action } from '@storybook/addon-actions';
import { text, boolean } from '@storybook/addon-knobs';
import { TextEditor } from '@accordproject/text-editor';

export default {
  title: 'Text Editor',
  component: TextEditor,
  parameters: {
    componentSubtitle: 'Resizable text editor',
  }
};
export const Demo = () => {
  const content = text('Editor Content', 'This is the contents of the editor. Respond to the onChange notification to save updates.');
  const readOnly = boolean('Read-only', false);
  return <TextEditor readOnly={readOnly} markdown={content} onChange={action("content changed")}/>
};
