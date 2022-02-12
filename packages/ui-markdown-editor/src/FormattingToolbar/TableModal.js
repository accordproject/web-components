import React, { useEffect, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { ReactEditor, useEditor } from "slate-react";
import { Editor, Transforms, Range, Element } from "slate";
import styled from "styled-components";
import { Form, Input, Popup } from "semantic-ui-react";

import Portal from "../components/Portal";
import { insertTable, handleCells, isSelectionTable } from "plugins/withTables";

import RowIcon from "../components/icons/row";
import ColumnIcon from "../components/icons/col";
import DeleteIcon from "../components/icons/deleteTable";
import DeleteRowIcon from "../components/icons/deleteRow";
import DeleteColIcon from "../components/icons/deleteCol";

const TableModalWrapper = styled.div`
  position: absolute;
  z-index: 3000;
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  opacity: 0;
  background-color: #ffffff;
  border: 1px solid #d4d4d5;
  border-radius: 0.3rem;
  line-height: 1.4285em;
  max-width: 300px;
  padding: 0.833em 1em;
  font-weight: 400;
  font-style: normal;
  color: rgba(0, 0, 0, 0.87);
  box-shadow: 0 2px 4px 0 rgba(34, 36, 38, 0.12),
    0 2px 10px 0 rgba(34, 36, 38, 0.15);
  & > * {
    display: inline-block;
  }
`;

const TableModalCaret = styled.div`
  position: absolute;
  z-index: 4000;
  left: calc(50% - 5px);
  top: -10px;
  height: 0;
  width: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 10px solid #d4d4d5;
  transition: opacity 0.75s;
`;

const TableIconHolder = styled.div`
  cursor: pointer;
  width: 25px;
  height: 25px;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: -2px 3px;
  margin: 5px;
  &:hover {
    background-color: #eee;
  }
`;

const InlineFormField = styled(Form.Field)`
  display: flex;
  flex-direction: row;
`;

const InputFieldWrapper = styled.div`
  width: 270px;
  display: flex;
  flex-direction: column;
`;

const InputFieldLabel = styled.label`
  font-weight: bold;
  font-size: 12px;
`;

const InlineFormButton = styled.button`
  margin-left: 10px;
  align-self: flex-end;
  height: 38px;
  width: 90px;
  border: none;
  color: #fff;
  border-radius: 3px;
  background-color: #0043ba;
  &:hover {
    background-color: #265fc4;
  }
`;

const popupStyles = {
  padding: "0.2em 0.5em 0.2em 0.5em",
  zIndex: "9999",
};

const TableMenu = React.forwardRef(({ ...props }, ref) => (
  <TableModalWrapper ref={ref} {...props} />
));

TableMenu.displayName = "TableMenu";

const TableModal = React.forwardRef(({ ...props }, ref) => {
  const editor = useEditor();
  const [originalSelection, setOriginalSelection] = useState(null);
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);

  const actionHandler = useCallback(
    (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        props.setShowTableModal(false);
      }
    },
    [props, ref]
  );

  useEffect(() => {
    document.addEventListener("mousedown", actionHandler);
    document.addEventListener("keydown", actionHandler);
    return () => {
      document.removeEventListener("mousedown", actionHandler);
      document.removeEventListener("keydown", actionHandler);
    };
  }, [actionHandler]);

  useEffect(() => {
    if (props.showTableModal) {
      setOriginalSelection(editor.selection);
      const x = window.scrollX;
      const y = window.scrollY;
      window.scrollTo(x, y);
    }
  }, [editor, props.showTableModal]);

  /**
   * Inserts the table in the document.
   */
  const createTable = () => {
    Transforms.select(editor, originalSelection);
    insertTable(editor, rows, cols);
    Transforms.collapse(editor, { edge: "end" });
    ReactEditor.focus(editor);
    props.setShowTableModal(false);
  };

  /**
   * Inserts and Deletes rows and columns from the table
   *  @param {string} action action to be performed
   */
  const handleClick = (action) => {
    Transforms.select(editor, originalSelection);

    const { selection } = editor;
    if (!!selection && Range.isCollapsed(selection)) {
      const [tableNode] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && n.type === "table",
      });
      if (tableNode) {
        const [oldTable, path] = tableNode;
        removeTable(editor);
        if (action === "row") {
          handleCells(oldTable, path, "row", editor);
        } else if (action === "col") {
          handleCells(oldTable, path, "col", editor);
        } else if (action === "drow") {
          handleCells(oldTable, path, "drow", editor);
        } else {
          handleCells(oldTable, path, "dcol", editor);
        }
      }
    }

    Transforms.deselect(editor);
    ReactEditor.focus(editor);
    props.setShowTableModal(false);
  };

  /**
   * Deletes the table from the document.
   */
  const removeTable = () => {
    Transforms.select(editor, originalSelection);
    Transforms.removeNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === "table",
      mode: "highest",
    });

    Transforms.deselect(editor);
    ReactEditor.focus(editor);
    props.setShowTableModal(false);
  };

  return (
    <Portal>
      <TableMenu ref={ref}>
        <TableModalCaret />
        <Form onSubmit={createTable}>
          {!isSelectionTable(editor) && (
            <InputFieldWrapper>
              <InputFieldLabel>Number of rows</InputFieldLabel>
              <Input
                placeholder="Rows"
                name="rows"
                type="number"
                min="1"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
              />
            </InputFieldWrapper>
          )}
          {!isSelectionTable(editor) && (
            <InlineFormField>
              <InputFieldWrapper>
                <InputFieldLabel>Number of columns</InputFieldLabel>
                <Input
                  placeholder="Columns"
                  name="columns"
                  type="number"
                  min="1"
                  value={cols}
                  onChange={(e) => setCols(e.target.value)}
                />
              </InputFieldWrapper>
              <InlineFormButton type="submit">Create Table</InlineFormButton>
            </InlineFormField>
          )}

          <InlineFormField>
            <Popup
              trigger={
                <TableIconHolder
                  onClick={() => handleClick("row")}
                  aria-label="Insert new row"
                >
                  <RowIcon />
                </TableIconHolder>
              }
              content="Insert new row"
              inverted
              position="bottom left"
              style={popupStyles}
            />
            <Popup
              trigger={
                <TableIconHolder
                  onClick={() => handleClick("col")}
                  aria-label="Insert new column"
                >
                  <ColumnIcon />
                </TableIconHolder>
              }
              content="Insert new column"
              inverted
              position="bottom left"
              style={popupStyles}
            />
            <Popup
              trigger={
                <TableIconHolder
                  onClick={() => handleClick("drow")}
                  aria-label="Delete a row"
                >
                  <DeleteRowIcon />
                </TableIconHolder>
              }
              content="Delete a row"
              inverted
              position="bottom left"
              style={popupStyles}
            />
            <Popup
              trigger={
                <TableIconHolder
                  onClick={() => handleClick("dcol")}
                  aria-label="Delete a column"
                >
                  <DeleteColIcon />
                </TableIconHolder>
              }
              content="Delete a column"
              inverted
              position="bottom left"
              style={popupStyles}
            />
            <Popup
              trigger={
                <TableIconHolder
                  onClick={removeTable}
                  aria-label="Delete table"
                >
                  <DeleteIcon />
                </TableIconHolder>
              }
              content="Delete table"
              inverted
              position="bottom left"
              style={popupStyles}
            />
          </InlineFormField>
        </Form>
      </TableMenu>
    </Portal>
  );
});

TableModal.displayName = "TableModal";

TableModal.propTypes = {
  setShowTableModal: PropTypes.func,
  showTableModal: PropTypes.bool,
};

export default TableModal;
