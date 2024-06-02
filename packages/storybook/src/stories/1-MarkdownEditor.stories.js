import React, { useState, useCallback } from 'react';

import { SlateTransformer } from '@accordproject/markdown-slate';
import { boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { MarkdownEditor } from '@accordproject/ui-markdown-editor';

const slateTransformer = new SlateTransformer();

const defaultMarkdown = `# My Heading

This is text. This is *italic* text. This is **bold** text. This is a [link](https://clause.io). This is \`inline code\`.

This is ***bold and italic*** text.

## Breaks
This is a  
hard break.

This is a
paragraph break.

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
##### H5
###### H6

## Tables:

| Column1     | Column 2    |
| ----------- | ----------- |
| \`\`\`code block\`\`\`      | ![](data:image/jpeg;base64,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 "AP triangle")       | 
| Paragraph   | **Bold content**     |
| [link](http://clause.io) | *Italics* |

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
    action('onSlateValueChange')(slateChildren);
    localStorage.setItem('slate-editor-value', JSON.stringify(slateChildren));
    const slateValue = {
      document: {
        children: slateChildren
      }
    };
    const markdown = slateTransformer.toMarkdown(slateValue);
    setSlateValue(slateValue.document.children);
    action('markdown')(markdown);
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