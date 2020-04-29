import React, { useState, useCallback } from 'react';

import { TextEditor } from '@accordproject/text-editor'
import '@accordproject/text-editor/dist/index.css'

const defaultMarkdown = `This is
some sample text.
`;

const App = () => {
  /**
   * Current markdown
   */
  const [markdown, setMarkdown] = useState(defaultMarkdown);

  /**
   * Called when the markdown changes
   */
  const onMarkdownChange = useCallback((markdown) => {
    setMarkdown(markdown)
  }, []);

  return <TextEditor readOnly={false} markdown={markdown} onChange={onMarkdownChange} />
}

export default App
