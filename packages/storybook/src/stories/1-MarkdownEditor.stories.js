import React, { useState, useCallback } from 'react';

import { SlateTransformer } from '@accordproject/markdown-slate';
import { boolean } from '@storybook/addon-knobs';
import { MarkdownEditor } from '@accordproject/markdown-editor';
import '../styles.module.css';
import 'semantic-ui-css/semantic.min.css';

const slateTransformer = new SlateTransformer();

const defaultMarkdown = `# My Heading

This is text. This is *italic* text. This is **bold** text. This is a [link](https://clause.io). This is \`inline code\`.

This is ***bold and italic*** text.

## Breaks
This is a  
hard break.

This is a
softbreak.

---

This ^^^^ is a thematic break

![ap_logo](https://docs.accordproject.org/docs/assets/020/template.png "AP triangle")

> This is a quote.
## Heading Two
This is more text.

Below is a code block:

\`\`\` javascript
this is my great
code
\`\`\`

Ordered lists:

1. one
1. two
1. three

Or:

* apples
* pears
* peaches

### Sub heading

This is more text.

<custom>
This is an html block.
</custom>

And this is <variable>an HTML inline</variable>.

# H1
## H2
### H3
#### H4
#### H5
##### H6

Fin.
`;

const propsObj = {
  WIDTH: '600px',
};


/**
 * MarkdownEditor demo
 */
export const Demo = () => {

  const readOnly = boolean('Read-only', false);

  /**
   * Current Slate Value
   */
  const [slateValue, setSlateValue] = useState(() => {
    const slate = slateTransformer.fromMarkdown(defaultMarkdown);
    console.log(slate);
    return slate.document.children;
  });
  const [markdown, setMarkdown] = useState(defaultMarkdown);

  /**
   * Called when the markdown changes
   */
  const onMarkdownChange = useCallback((markdown) => {
    localStorage.setItem('markdown-editor', markdown);
  }, []);

  /**
   * Called when the Slate Value changes
   */
  const onSlateValueChange = useCallback((slateChildren) => {
    localStorage.setItem('slate-editor-value', JSON.stringify(slateChildren));
    const slateValue = {
      document: {
        children: slateChildren
      }
    };
    const markdown = slateTransformer.toMarkdown(slateValue);
    setSlateValue(slateValue.document.children);
    setMarkdown(markdown);
  }, []);

  return (
    <div style={{ padding: '10px' }}>
      <MarkdownEditor
        readOnly={readOnly}
        value={slateValue}
        onChange={onSlateValueChange}
        editorProps={propsObj}
      />
    </div>
  );
}

const intro = `
The markdown editor implements a WYSIWYG editor for markdown that conforms to
the [CommonMark](https://spec.commonmark.org) specification.

The editor is based on [Slate](https://www.slatejs.org) and the Accord Project
\`markdown-transform \` [project](https://github.com/accordproject/markdown-transform) includes lots of useful utilities to transform various
formats to and from markdown.
`

const configuration = `
You can configure this component to be in read/write mode, 
in which case a formatting toolbar is displayed, or a read-only mode which locks
the text against editing and the formatting toolbar is removed.
`

export default {
  title: 'Markdown Editor',
  component: MarkdownEditor,
  parameters: {
    componentSubtitle: 'WYSIWYG Markdown Editor',
    notes: { Introduction: intro, Configuration: configuration },
  }
};