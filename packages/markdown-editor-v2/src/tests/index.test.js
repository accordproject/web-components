import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';
import { SlateTransformer } from '@accordproject/markdown-slate';
import MarkdownEditor from '../index';

const slateTransformer = new SlateTransformer();
Enzyme.configure({ adapter: new Adapter() });
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
const mockOnChange = jest.fn();

describe('<MarkdownEditor />', () => {
  describe('on initialization', () => {
    it('renders page correctly', () => {
      const slate = slateTransformer.fromMarkdown(defaultMarkdown);

      const component = shallow(
        <MarkdownEditor
            className="ap-rich-text-editor"
            readOnly={false}
            value={slate.document.children}
            onChange={mockOnChange}
        />
      );
      const tree = toJson(component);
      expect(tree).toMatchSnapshot();
    });
  });
});
