/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import ImageElement from '../plugins/withImages';
import { Heading } from './Node';
import { HorizontalRule } from './Span';
import {
  PARAGRAPH, LINK, IMAGE, H1, H2, H3, H4, H5, H6, HR,
  CODE_BLOCK, HTML_BLOCK, BLOCK_QUOTE, UL_LIST, OL_LIST, LIST_ITEM,
  HTML_INLINE, SOFTBREAK, LINEBREAK, HEADINGS
} from '../utilities/schema';
import {
  H1_STYLING,
  H2_STYLING,
  H3_STYLING,
  H4_STYLING,
  H5_STYLING,
  H6_STYLING,
  PARAGRAPH_STYLING
} from '../utilities/constants';
import generateId from '../utilities/generateId';

/**
 * Renders different elements according to the properties.
 * 
 * @param {Object} props Properties of the element
 * @return {React.ReactChild} JSX for the element
 */
const Element = (props) => {
  const {
    attributes, children, element, customElements, editor
  } = props;
  const { type, data } = element;
  const headingId = HEADINGS.includes(type) ? generateId(element) : null;
  const baseElementRenderer = {
    [PARAGRAPH]: () => (<p style={PARAGRAPH_STYLING} {...attributes}>{children}</p>),
    [H1]: () => (<Heading id={headingId} as="h1" style={H1_STYLING} {...attributes}>{children}</Heading>),
    [H2]: () => (<Heading id={headingId} as="h2" style={H2_STYLING} {...attributes}>{children}</Heading>),
    [H3]: () => (<Heading id={headingId} as="h3" style={H3_STYLING} {...attributes}>{children}</Heading>),
    [H4]: () => (<Heading id={headingId} as="h4" style={H4_STYLING} {...attributes}>{children}</Heading>),
    [H5]: () => (<Heading id={headingId} as="h5" style={H5_STYLING} {...attributes}>{children}</Heading>),
    [H6]: () => (<Heading id={headingId} as="h6" style={H6_STYLING} {...attributes}>{children}</Heading>),
    [SOFTBREAK]: () => (<span className={SOFTBREAK} {...attributes}> {children}</span>),
    [LINEBREAK]: () => (<span {...attributes}>
      <span contentEditable={false} style={{ userSelect: 'none' }}>
        <br />
      </span>
      {children}
    </span>),
    [LINK]: () => (<a {...attributes} href={data.href}>{children}</a>),
    [HTML_BLOCK]: () => (<pre className={HTML_BLOCK} {...attributes}>{children}</pre>),
    [CODE_BLOCK]: () => (<pre {...attributes}>{children}</pre>),
    [BLOCK_QUOTE]: () => (<blockquote {...attributes}>{children}</blockquote>),
    [OL_LIST]: () => (<ol {...attributes}>{children}</ol>),
    [UL_LIST]: () => (<ul {...attributes}>{children}</ul>),
    [LIST_ITEM]: () => (<li {...attributes}>{children}</li>),
    [IMAGE]: () => (<ImageElement {...props} />),
    [HR]: () => (<HorizontalRule {...props} />),
    [HTML_INLINE]: () => (<span className={HTML_INLINE} {...attributes}>
      {data.content}{children}
    </span>),
    default: () => {
      console.log(`Didn't know how to render ${JSON.stringify(element, null, 2)}`);
      return <p {...attributes}>{children}</p>;
    }
  };
  const elementRenderer = customElements
    ? { ...baseElementRenderer, ...customElements(attributes, children, element, editor) }
    : baseElementRenderer;
  return (elementRenderer[type] || elementRenderer.default)();
};

Element.propTypes = {
  children: PropTypes.node,
  element: PropTypes.shape({
    data: PropTypes.object,
    type: PropTypes.string
  }),
  attributes: PropTypes.any,
  editor: PropTypes.any
};

export default Element;
