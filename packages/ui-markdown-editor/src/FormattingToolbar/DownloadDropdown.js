import React from 'react';
import PropTypes from 'prop-types';
import { useEditor } from 'slate-react';
import { Dropdown } from 'semantic-ui-react';
import { DROPDOWN_STYLE } from 'utilities/constants';
// import { transform } from '@accordproject/markdown-transform';
import { SlateTransformer } from '@accordproject/markdown-slate';
// import { PdfTransformer } from '@accordproject/markdown-pdf';

const DownloadDropdownItem = ({
  editor, format, style,
}) => {
  const save = (editor, format) => {
    // using markdown-transform as below causes an error
    // transform({ document: { children: editor.children } }, 'slate', [format.toLowerCase()]);

    const formattingOptions = {
      Markdown: {
        type: 'text/markdown',
        fileName: 'contract.md',
        getContent: (slateDoc) => {
          const slateTransformer = new SlateTransformer();
          return slateTransformer.toMarkdown(slateDoc);
        }
      },
      PDF: {
        type: 'application/pdf',
        fileName: 'contract.pdf',
        getContent: (slateDoc) => {
          const slateTransformer = new SlateTransformer();
          const ciceroMark = slateTransformer.toCiceroMark(slateDoc);
        }
      },
      DOCX: {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        fileName: 'contract.docx'
      }
    };
    const slateDoc = { document: { children: editor.children } };
    const result = formattingOptions[format].getContent(slateDoc);
    const blob = new Blob([result], { type: formattingOptions[format].type });
    const a = document.createElement('a');
    a.download = formattingOptions[format].fileName;
    a.href = window.URL.createObjectURL(blob);
    a.click();
  };

  return (
    <Dropdown.Item
        text={format}
        style={style}
        onClick={
          () => save(editor, format)}
    />

  );
};

DownloadDropdownItem.propTypes = {
  editor: PropTypes.object,
  format: PropTypes.string,
  style: PropTypes.object,
};

const DownloadDropdown = () => {
  const editor = useEditor();

  console.log('editor - ', editor);
  console.log('editor.children - ', editor.children);

  return (
    <Dropdown
        simple
        openOnFocus
        text="Export"
        style={DROPDOWN_STYLE}
      >
        <Dropdown.Menu>
        <DownloadDropdownItem
            editor={editor}
            format='Markdown'
          />
          <DownloadDropdownItem
            editor={editor}
            format='PDF'
          />
          <DownloadDropdownItem
            editor={editor}
            format='DOCX'
          />
        </Dropdown.Menu>
      </Dropdown>);
};

export default DownloadDropdown;
