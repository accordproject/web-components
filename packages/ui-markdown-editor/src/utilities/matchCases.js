import { Transforms, Editor } from "slate";
import { H1, H2, H3, H4, H5, H6, HR } from "./schema";
import { insertThematicBreak } from "./toolbarHelpers";

export const matchCases = (editor, currentLine) => {
  const offsetBeforeSpace = editor.selection.anchor.offset - 2;
  const lastChar = currentLine.charAt(offsetBeforeSpace);
  const prevTextFromSpace = currentLine.substr(0, offsetBeforeSpace + 1);

  const matchHeadings = () => {
    const headingMatchCase = currentLine.match(/(^\s*)#{1,6}\s/m);
    if (!headingMatchCase) return;

    const count = (headingMatchCase[0].match(/#/g) || []).length;
    if (count === 1) Transforms.setNodes(editor, { type: H1 });
    else if (count === 2) Transforms.setNodes(editor, { type: H2 });
    else if (count === 3) Transforms.setNodes(editor, { type: H3 });
    else if (count === 4) Transforms.setNodes(editor, { type: H4 });
    else if (count === 5) Transforms.setNodes(editor, { type: H5 });
    else if (count === 6) Transforms.setNodes(editor, { type: H6 });

    Editor.deleteBackward(editor, { unit: "word" });
    return;
  };

  const matchPageBreak = () => {
    const pageBreakMatchCase = currentLine.match(/(^\s*)([-])(?:[\t ]*\2){2,}/m);
    if (!pageBreakMatchCase) return;

    Editor.deleteBackward(editor, { unit: "word" });
    insertThematicBreak(editor, HR);

    return;
  };

  /**
   *
   * @param {string} textToInsert The text that we want to format
   * @param {Object} textFormats This is the format style of the text (bold, italic, code) we want to apply or remove as the key in an object and a boolean as the value. i.e. `{ bold: true }`
   * @param {Integer} markdownCharacters The number of markdown characters that the user has to type to trigger WYSIWYG
   */
  const insertFormattedInlineText = (textToInsert, textFormats, markdownCharacters) => {
    const currentRange = {
      anchor: editor.selection.anchor,
      focus: {
        path: editor.selection.focus.path,
        offset:
          editor.selection.focus.offset -
          (textToInsert.length + 1 + markdownCharacters),
      },
    };

    Transforms.insertText(editor, " ");

    Transforms.insertNodes(
      editor,
      {
        text: textToInsert,

        ...textFormats,
      },
      {
        at: currentRange,
      }
    );
  };

  const matchCodeInline = () => {
    const codeInlineMatchCase = prevTextFromSpace.match(/\s?(`|``)((?!\1).)+?\1$/m);
    if (!lastChar === "`") return;
    if (!codeInlineMatchCase) return;

    const codeText = codeInlineMatchCase[0]
      .trim()
      .replace(new RegExp(codeInlineMatchCase[1], "g"), "");

    insertFormattedInlineText(
      codeText,
      {
        code: true,
      },
      2
    );

    return;
  };

  const matchBoldAndItalic = () => {
    let boldAndItalicMatchCase;
    let boldMatchCase;
    let italicMatchCase;

    if (lastChar === "*" || lastChar === "_") {
      if (
        (boldAndItalicMatchCase = prevTextFromSpace.match(
          /\s?(\*\*\*|___)((?!\1).)+?\1$/m
        ))
      ) {
        // ***[bold + italic]***, ___[bold + italic]___
        const reg =
          boldAndItalicMatchCase[1] === "***" ? /\*\*\*/ : boldAndItalicMatchCase[1];
        const boldAndItalicText = boldAndItalicMatchCase[0]
          .trim()
          .replace(new RegExp(reg, "g"), "");
        insertFormattedInlineText(
          boldAndItalicText,
          {
            bold: true,
            italic: true,
          },
          6
        );
      } else if (
        (boldMatchCase = prevTextFromSpace.match(/\s?(\*\*|__)((?!\1).)+?\1$/m))
      ) {
        // **bold**, __bold__
        const reg = boldMatchCase[1] === "**" ? /\*\*/ : boldMatchCase[1];
        const boldText = boldMatchCase[0].replace(new RegExp(reg, "g"), "");
        insertFormattedInlineText(
          boldText,
          {
            bold: true,
          },
          4
        );
      } else if (
        (italicMatchCase = prevTextFromSpace.match(/\s?(\*|_)((?!\1).)+?\1$/m))
      ) {
        // *italic*, _italic_
        const reg = italicMatchCase[1] === "*" ? /\*/ : italicMatchCase[1];
        const italicText = italicMatchCase[0].replace(new RegExp(reg, "g"), "");
        insertFormattedInlineText(
          italicText,
          {
            italic: true,
          },
          2
        );
      }
    }
  };

  matchHeadings();
  matchPageBreak();
  matchBoldAndItalic();
  matchCodeInline();
  return;
};