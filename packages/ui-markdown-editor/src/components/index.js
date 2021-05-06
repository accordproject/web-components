/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import ImageElement from '../plugins/withImages';
import { Heading } from './Node';
import { HorizontalRule } from './Span';
import {
  PARAGRAPH, LINK, IMAGE, H1, H2, H3, H4, H5, H6, HR,
  CODE_BLOCK, HTML_BLOCK, BLOCK_QUOTE, UL_LIST, OL_LIST, LIST_ITEM,
  HTML_INLINE, HEADINGS, LINEBREAK, PARAGRAPH_BREAK
} from '../utilities/schema';
import {
  DROPDOWN_STYLE_H1,
  DROPDOWN_STYLE_H2,
  DROPDOWN_STYLE_H3,
  DROPDOWN_STYLE_H4,
  DROPDOWN_STYLE_H5,
  DROPDOWN_STYLE_H6
} from '../utilities/constants';
import generateId from '../utilities/generateId';

const Element = (props) => {
  const {
    attributes, children, element, customElements, editor
  } = props;
  const { type, data } = element;
  const headingId = HEADINGS.includes(type) ? generateId(element) : null;
  const baseElementRenderer = {
    [PARAGRAPH]: () => (<p {...attributes}>{children}</p>),
    [H1]: () => (<Heading id={headingId} as="h1" style={DROPDOWN_STYLE_H1} {...attributes}>{children}</Heading>),
    [H2]: () => (<Heading id={headingId} as="h2" style={DROPDOWN_STYLE_H2} {...attributes}>{children}</Heading>),
    [H3]: () => (<Heading id={headingId} as="h3" style={DROPDOWN_STYLE_H3} {...attributes}>{children}</Heading>),
    [H4]: () => (<Heading id={headingId} as="h4" style={DROPDOWN_STYLE_H4} {...attributes}>{children}</Heading>),
    [H5]: () => (<Heading id={headingId} as="h5" style={DROPDOWN_STYLE_H5} {...attributes}>{children}</Heading>),
    [H6]: () => (<Heading id={headingId} as="h6" style={DROPDOWN_STYLE_H6} {...attributes}>{children}</Heading>),
    [LINEBREAK]: () => (<span {...attributes}>
      <span contentEditable={false} style={{ userSelect: 'none' }}>
        <br />
      </span>
      {children}
    </span>),
    [PARAGRAPH_BREAK]: () => (<span {...attributes}>
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
