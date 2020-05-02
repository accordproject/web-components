import React from 'react';
import { render } from '@testing-library/react';
import { SlateTransformer } from '@accordproject/markdown-slate';
import ContractEditor from '../index';

const slateTransformer = new SlateTransformer();

const defaultContractMarkdown = `# Heading One
  This is text. This is *italic* text. This is **bold** text. This is a [link](https://clause.io). This is \`inline code\`. Fin.`;
const slate = slateTransformer.fromMarkdown(defaultContractMarkdown);
const slateFinal = slate.document.children;


const props = {
  value: slateFinal,
  onChange: () => 1,
  onClauseUpdated: () => 1,
  lockText: true,
  readOnly: true,
};

const setup = () => {
  const ref = React.createRef();
  return render(<ContractEditor {...props} ref={ref} />);
};

beforeAll(() => {
  window.getSelection = () => ({
    removeAllRanges: () => {}
  });

  global.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
  });
});

describe('<ContractEditor />', () => {
  describe('on initialization', () => {
    it('renders page correctly', () => {
      const { baseElement } = setup();
      expect(baseElement).toMatchSnapshot();
    });
  });
});
