import React from "react";
import PropTypes from "prop-types";
import { Popup } from "semantic-ui-react";
import { useEditor } from "slate-react";
import { Editor, Transforms, Range, Element, Point } from "slate";

import { POPUP_STYLE } from "../utilities/constants";
import Button from "../components/Button";

/**
 * Checks if the selection is a table or not.
 *
 * @param {Object} editor Editor in which the table is to be checked
 * @returns {boolean} Selection in editor is table or not
 */
export const isSelectionTable = (editor) => {
  const [tableNode] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === "table",
  });

  return !!tableNode;
};

/**
 * Extends the editor's features by including the table feature.
 *
 * @param {Object} editor Editor to be improved
 * @returns {Object} Editor with the table functionality
 */

export const withTables = (editor) => {
  const { deleteBackward, deleteForward, insertBreak } = editor;

  editor.deleteBackward = (unit) => {
    const { selection } = editor;
    if (selection) {
      const [cell] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === "table-cell",
      });
      const prevNodePath = Editor.before(editor, selection);

      const [tableNode] = Editor.nodes(editor, {
        at: prevNodePath,
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement && n.type === "table-cell",
      });

      if (cell) {
        const [, cellPath] = cell;

        const start = Editor.start(editor, cellPath);
        if (Point.equals(selection.anchor, start)) {
          return;
        }
      }
      if (!cell && tableNode) {
        return;
      }
    }

    deleteBackward(unit);
  };
  editor.deleteForward = (unit) => {
    const { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === "table-cell",
      });

      const prevNodePath = Editor.after(editor, selection);
      const [tableNode] = Editor.nodes(editor, {
        at: prevNodePath,
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement && n.type === "table-cell",
      });

      if (cell) {
        const [, cellPath] = cell;
        const end = Editor.end(editor, cellPath);

        if (Point.equals(selection.anchor, end)) {
          return;
        }
      }
      if (!cell && tableNode) {
        return;
      }
    }

    deleteForward(unit);
  };

  editor.insertBreak = () => {
    const { selection } = editor;
    if (selection) {
      const [table] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && n.type === "table",
      });

      if (table) {
        return;
      }
    }

    insertBreak();
  };
  return editor;
};

/**
 * Inserts and Deletes rows and columns into the editor
 *
 * @param {Object} editor    Editor which has to be improved
 * @param {Node}   tableNode table which has to be edited
 * @param {string} action    action to be performed
 * @param {Path}   path      the path of the table
 */
export const handleCells = (tableNode, path, action, editor) => {
  let existingText = Array.from(tableNode.children, (rows) =>
    Array.from(rows.children, (arr) => arr.children[0].text)
  );
  const columns = existingText[0].length;
  if (action === "row") {
    existingText.push(Array(columns).fill(""));
  } else if (action === "col") {
    existingText = Array.from(existingText, (item) => {
      item.push("");
      return item;
    });
  } else if (action === "drow") {
    existingText.pop();
  } else {
    existingText = Array.from(existingText, (item) => {
      item.pop("");
      return item;
    });
  }
  const newTable = createTableNode(existingText);
  Transforms.insertNodes(editor, newTable, {
    at: path,
  });
};

const createTableCell = (text) => {
  return {
    type: "table-cell",
    children: [{ text }],
  };
};

const createRow = (cellText) => {
  const newRow = Array.from(cellText, (value) => createTableCell(value));
  return {
    type: "table-row",
    children: newRow,
  };
};

const createTableNode = (cellText) => {
  const tableChildren = Array.from(cellText, (value) => createRow(value));
  let tableNode = { type: "table", children: tableChildren };
  return tableNode;
};

/**
 * Inserts a table into the editor
 *
 * @param {Object} editor  Editor in which image is to be inserted
 * @param {number} rows    rows of the table.
 * @param {number} columns columns of the table.
 */
export const insertTable = (editor, rows, columns) => {
  const [tableNode] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === "table",
    mode: "highest",
  });

  if (tableNode) return;
  if (!rows || !columns) {
    return;
  }
  const cellText = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => "")
  );
  const newTable = createTableNode(cellText);

  Transforms.insertNodes(editor, newTable, {
    mode: "highest",
  });
  Transforms.insertNodes(
    editor,
    { type: "paragraph", children: [{ text: "" }] },
    { mode: "highest" }
  );
};

export const InsertTableButton = ({
  showTableModal,
  setShowTableModal,
  type,
  label,
  icon,
  canBeFormatted,
  ...props
}) => {
  const isActive = showTableModal;
  const editor = useEditor();

  /**
   * Shows the modal on mouse click if the document is in editable mode.
   */
  const handleMouseDown = () => {
    if (!canBeFormatted(editor)) return;
    if (editor.selection) setShowTableModal(true);
  };
  return (
    <Popup
      content={label}
      style={POPUP_STYLE}
      position="bottom center"
      trigger={
        <Button
          aria-label={type}
          onMouseDown={handleMouseDown}
          isActive={isActive}
          {...props}
        >
          {icon()}
        </Button>
      }
    />
  );
};

InsertTableButton.displayName = "InsertTableButton";

InsertTableButton.propTypes = {
  showTableModal: PropTypes.bool,
  setShowTableModal: PropTypes.func,
  icon: PropTypes.func,
  type: PropTypes.string,
  label: PropTypes.string,
  canBeFormatted: PropTypes.func,
};
