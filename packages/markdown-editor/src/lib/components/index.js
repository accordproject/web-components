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
import generateId from '../utilities/generateId';

const Element = (props) => {
  const {
    attributes, children, element, customElements
  } = props;
  const { type, data } = element;
  const headingId = HEADINGS.includes(type) ? generateId(element) : null;
  const baseElementRenderer = {
    [PARAGRAPH]: () => (<p {...attributes}>{children}</p>),
    [H1]: () => (<Heading id={headingId} as="h1" {...attributes}>{children}</Heading>),
    [H2]: () => (<Heading id={headingId} as="h2" {...attributes}>{children}</Heading>),
    [H3]: () => (<Heading id={headingId} as="h3" {...attributes}>{children}</Heading>),
    [H4]: () => (<Heading id={headingId} as="h4" {...attributes}>{children}</Heading>),
    [H5]: () => (<Heading id={headingId} as="h5" {...attributes}>{children}</Heading>),
    [H6]: () => (<Heading id={headingId} as="h6" {...attributes}>{children}</Heading>),
    [SOFTBREAK]: () => (<span className={SOFTBREAK} {...attributes}>{children}</span>),
    [LINEBREAK]: () => (<br className={LINEBREAK} {...attributes} />),
    [LINK]: () => (<a {...attributes} href={data.href}>{children}</a>),
    [HTML_BLOCK]: () => (<pre className={HTML_BLOCK} {...attributes}>{children}</pre>),
    [CODE_BLOCK]: () => (<pre {...attributes}>{children}</pre>),
    [BLOCK_QUOTE]: () => (<blockquote {...attributes}>{children}</blockquote>),
    [OL_LIST]: () => (<ol {...attributes}>{children}</ol>),
    [UL_LIST]: () => (<ul {...attributes}>{children}</ul>),
    [LIST_ITEM]: () => (<li {...attributes}>{children}</li>),
    [IMAGE]: () => (<ImageElement {...props} />),
    [HR]: () => (<HorizontalRule {...attributes}>{children}</HorizontalRule>),
    [HTML_INLINE]: () => (<span className={HTML_INLINE} {...attributes}>
      {data.content}{children}
    </span>),
    default: () => {
      console.log(`Didn't know how to render ${JSON.stringify(element, null, 2)}`);
      return <p {...attributes}>{children}</p>;
    }
  };
  const elementRenderer = customElements
    ? { ...baseElementRenderer, ...customElements(attributes, children, element) }
    : baseElementRenderer;
  return (elementRenderer[type] || elementRenderer.default)();
};

Element.propTypes = {
  children: PropTypes.node,
  element: PropTypes.shape({
    data: PropTypes.object,
    type: PropTypes.string
  }),
  attributes: PropTypes.any
};

export default Element;
