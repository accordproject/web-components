import React from 'react';
import PropTypes from 'prop-types';
import { useEditor } from 'slate-react';
import { Dropdown } from 'semantic-ui-react';
import { DROPDOWN_STYLE } from 'utilities/constants';
import { transform } from '@accordproject/markdown-transform';
import { SlateTransformer } from '@accordproject/markdown-slate';
import { PdfTransformer, ToPdfMake } from '@accordproject/markdown-pdf';

const DownloadDropdownItem = ({
  editor, format, style,
}) => {
  const save = async (editor, format) => {
    const formattingOptions = {
      Markdown: {
        type: 'text/markdown',
        fileName: 'contract.md',
      },
      PDF: {
        type: 'application/pdf',
        fileName: 'contract.pdf',
      },
      HTML: {
        type: 'text/html',
        fileName: 'contract.html'
      }
    };
    const slateDoc = { document: { children: editor.children } };
    let result;
    if (format === 'PDF') {
      const slateTransformer = new SlateTransformer();
      const ciceroMark = slateTransformer.toCiceroMark(slateDoc);
      const pdfMakeDom = await ToPdfMake.CiceroMarkToPdfMake(ciceroMark);
      pdfMakeDom.styles.Code.font = 'Roboto';
      pdfMakeDom.styles.CodeBlock.font = 'Roboto';
      pdfMakeDom.styles.HtmlBlock.font = 'Roboto';
      pdfMakeDom.styles.HtmlInline.font = 'Roboto';

      result = await PdfTransformer.pdfMakeToPdfBuffer(pdfMakeDom);
    } else {
      result = await transform(slateDoc, 'slate', [format.toLowerCase()]);
    }
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
            format='HTML'
          />
        </Dropdown.Menu>
      </Dropdown>);
};

export default DownloadDropdown;
