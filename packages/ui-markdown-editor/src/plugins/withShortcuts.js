import { Transforms, Editor } from "slate";
import { SPACE_CHARACTER } from "../utilities/constants";
import { H1, H2, H3, H4, H5, H6, HR, BLOCK_QUOTE } from "../utilities/schema";
import { insertThematicBreak } from "../utilities/toolbarHelpers";

const SHORTCUTS = {
  '>': BLOCK_QUOTE,
  '#': H1,
  '##': H2,
  '###': H3,
  '####': H4,
  '#####': H5,
  '######': H6,
}

/**
*
* @param {Object} editor The editor Object
* @param {string} textToInsert The text that we want to format
* @param {Object} textFormats This is the format style of the text (bold, italic, code) we want to apply or remove as the key in an object and a boolean as the value. i.e. `{ bold: true }`
* @param {Integer} markdownCharacters The number of markdown characters that the user has to type to trigger WYSIWYG
*/
const insertFormattedInlineText = (editor, textToInsert, textFormats, markdownCharacters) => {
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

export const withShortcuts = (editor) => {
	const { insertText } = editor;
	editor.insertText = (text) => {
		const { selection } = editor

		onkeyup = (ev) => {
			if(ev.key === SPACE_CHARACTER){
				const { anchor } = selection
				const block = Editor.above(editor, {
					match: n => Editor.isBlock(editor, n),
				})
				const path = block ? block[1] : []
				const start = Editor.start(editor, path)
				const range = { anchor, focus: start }
				const prevTextFromSpace = Editor.string(editor, range)

				const offsetBeforeSpace = range.anchor.offset;
				const lastChar = prevTextFromSpace.charAt(offsetBeforeSpace-1);

				const type = SHORTCUTS[prevTextFromSpace]

				if (type) {
					Transforms.select(editor, range)
					Transforms.delete(editor)
					const newProperties = {
						type,
					}
					Transforms.setNodes(editor, newProperties, {
						match: n => Editor.isBlock(editor, n),
					})
					return
				}

				const matchPageBreak = () => {
					const pageBreakMatchCase = prevTextFromSpace.match(/(^\s*)([-])(?:[\t ]*\2){2,}/m);
					if (!pageBreakMatchCase) return;

					Editor.deleteBackward(editor, { unit: "word" });
					insertThematicBreak(editor, HR);

					return;
				};

				const matchCodeInline = () => {
					const codeInlineMatchCase = prevTextFromSpace.match(/\s?(`|``)((?!\1).)+?\1$/m);
					if (!lastChar === "`") return;
					if (!codeInlineMatchCase) return;

					const codeText = codeInlineMatchCase[0]
						.trim()
						.replace(new RegExp(codeInlineMatchCase[1], "g"), "");

					insertFormattedInlineText(
						editor,
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
								editor,
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
								editor,
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
								editor,
								italicText,
								{
									italic: true,
								},
								2
							);
						}
					}
				};

				matchPageBreak();
				matchBoldAndItalic();
				matchCodeInline();
				return;
			}
		}	
		insertText(text);
	}
	return editor;
}