/* React */
import React, { useState, createContext } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import PropTypes from 'prop-types';

/* Styling */
import * as S from '../styles';

/* Icons */
import * as deleteIcon from '../../icons/trash';
import * as editIcon from '../../icons/edit';
import * as testIcon from '../../icons/testIcon';
import * as dragIcon from '../../icons/drag';
import * as upIcon from '../../icons/move_up';
import * as downIcon from '../../icons/move_down';

/* Actions */
import { headerGenerator, titleGenerator } from '../actions';

/**
 * A React context for sharing the clause object,
 * in a way that re-renders the context whenever changes occur.
 */
export const ClauseContext = createContext(null);

/**
 * Component to render a clause
 * This will have an id property of the clauseid
 * @param {*} props
 */
const ClauseComponent = React.forwardRef((props, ref) => {
  const clauseProps = props.clauseProps || Object.create(null);

  // Tooltip visibility controls
  const [hovering, setHovering] = useState(false);
  const [hoveringHeader, setHoveringHeader] = useState(false);
  const [hoveringTestIcon, setHoveringTestIcon] = useState(false);
  const [hoveringEditIcon, setHoveringEditIcon] = useState(false);
  const [hoveringDeleteIcon, setHoveringDeleteIcon] = useState(false);
  // const [listVariables, setListVariables] = useState({});

  const title = titleGenerator(props.templateUri);
  const header = headerGenerator(props.templateUri, clauseProps.HEADER_TITLE);

  const iconWrapperProps = {
    currentHover: hovering,
    contentEditable: false,
    suppressContentEditableWarning: true,
    style: { userSelect: 'none' },
  };

  const testIconProps = {
    'aria-label': testIcon.type,
    width: '19px',
    height: '19px',
    viewBox: '0 0 16 20',
    clauseIconColor: clauseProps.ICON_HOVER_COLOR,
  };

  const editIconProps = {
    'aria-label': editIcon.type,
    width: '19px',
    height: '19px',
    viewBox: '0 0 19 19',
    clauseIconColor: clauseProps.ICON_HOVER_COLOR,
  };

  const deleteIconProps = {
    'aria-label': deleteIcon.type,
    width: '19px',
    height: '19px',
    viewBox: '0 0 12 15',
    clauseIconColor: clauseProps.ICON_HOVER_COLOR,
  };

  const dragIconProps = {
    'aria-label': dragIcon.type,
    width: '12px',
    height: '22px',
    viewBox: '0 0 12 22',
  };

  const upIconProps = {
    'aria-label': upIcon.type,
    width: '16px',
    height: '12px',
    viewBox: '0 0 16 12',
  };

  const downIconProps = {
    'aria-label': downIcon.type,
    width: '16px',
    height: '12px',
    viewBox: '0 0 16 12',
  };

  const handleClick = (event, down) => {
    const node = ReactEditor.toSlateNode(props.editor, event.target);
    const path = ReactEditor.findPath(props.editor, node);
    const range = Editor.range(props.editor, path);
    const documentEnd = Editor.end(props.editor, []);
    const newPath = [Math.max(range.anchor.path[0], range.focus.path[0]) + (down ? 1 : -1)];
    if (newPath[0] >= 0 && newPath[0] <= documentEnd.path[0]) {
      Transforms.moveNodes(props.editor, { at: path, to: newPath });
    }
  };

  const setDraggable = (event, draggable) => event.target.closest('.ui-contract-editor__clause').setAttribute('draggable', draggable);

  return (
    <ClauseContext.Provider value={hovering}>
      <S.ClauseWrapper
        src={props.templateUri}
        id={props.name}
        className={`ui-contract-editor__clause ${props.error ? 'error' : ''}`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{ userSelect: 'none' }}
        draggable="true"
        ref={ref}
        error={props.error}
        {...props.attributes}
      >
      {/*
      {
        Object.entries(listVariables).map(([key, value]) => (
          <ClauseVariableList
                key={key}
                listIconStyle={value.position.popupStyle}
                slateListKey={key}
                nodeValue={value}
                {...ListIconProps}
              />
        ))
      } */}
        <S.ClauseHeader
          className='ui-contract-editor__clause-header'
          currentHover={hovering}
          contentEditable={false}
          suppressContentEditableWarning={true}
          style={{ userSelect: 'none' }}
        >
          {(hoveringHeader && header.length > 54)
            && <S.HeaderToolTipWrapper>
              <S.HeaderToolTip>
                {title + clauseProps.HEADER_TITLE}
              </S.HeaderToolTip>
            </S.HeaderToolTipWrapper>
          }
          <S.HeaderToolTipText
            onMouseEnter={() => setHoveringHeader(true)}
            onMouseLeave={() => setHoveringHeader(false)}
          >
            {header}
          </S.HeaderToolTipText>
        </S.ClauseHeader>
        { !props.readOnly
          && <>
              <S.DragWrapper
                {...iconWrapperProps}
              >
              <S.DragIcon
                {...upIconProps}
                onClick={handleClick}
              >
                {upIcon.icon()}
              </ S.DragIcon>
              <S.DragIcon {...dragIconProps} style={{ margin: '6px 0 0 2px' }}>
                {dragIcon.icon()}
              </ S.DragIcon>
              <S.DragIcon
                {...downIconProps}
                onClick={(e) => handleClick(e, true)}
              >
                {downIcon.icon()}
              </ S.DragIcon>
            </S.DragWrapper>
            <S.TestWrapper
              {...iconWrapperProps}
              onMouseEnter={() => setHoveringTestIcon(true)}
              onMouseLeave={() => setHoveringTestIcon(false)}
              onClick={() => clauseProps.CLAUSE_TEST_FUNCTION(props)}
            >
              <S.ClauseIcon
                {...testIconProps}
                hovering={hoveringTestIcon}
              >
                {testIcon.icon()}
              </ S.ClauseIcon>
              {(hoveringTestIcon)
                && <S.HeaderToolTipWrapper>
                  <S.HeaderToolTip>
                    Test
                  </S.HeaderToolTip>
                </S.HeaderToolTipWrapper>
              }
            </S.TestWrapper>
            <S.EditWrapper
              {...iconWrapperProps}
              onMouseEnter={() => setHoveringEditIcon(true)}
              onMouseLeave={() => setHoveringEditIcon(false)}
              onClick={() => clauseProps.CLAUSE_EDIT_FUNCTION(props)}
            >
              <S.ClauseIcon
                {...editIconProps}
                hovering={hoveringEditIcon}
              >
                {editIcon.icon()}
              </ S.ClauseIcon>
              {(hoveringEditIcon)
                && <S.HeaderToolTipWrapper>
                  <S.HeaderToolTip>
                    Edit
                  </S.HeaderToolTip>
                </S.HeaderToolTipWrapper>
              }
            </S.EditWrapper>
            <S.DeleteWrapper
              {...iconWrapperProps}
              onMouseEnter={() => setHoveringDeleteIcon(true)}
              onMouseLeave={() => setHoveringDeleteIcon(false)}
              onClick={() => clauseProps.CLAUSE_DELETE_FUNCTION(props)}
            >
              <S.ClauseIcon
                {...deleteIconProps}
                hovering={hoveringDeleteIcon}
              >
                {deleteIcon.icon()}
              </ S.ClauseIcon>
              {(hoveringDeleteIcon)
                && <S.HeaderToolTipWrapper>
                  <S.HeaderToolTip>
                    Delete
                  </S.HeaderToolTip>
                </S.HeaderToolTipWrapper>
              }
            </S.DeleteWrapper>
          </>
        }
        <S.ClauseBody
          onMouseEnter={(e) => setDraggable(e, false)}
          onMouseLeave={(e) => setDraggable(e, true)}
        >
            {props.children}
        </S.ClauseBody>
      </S.ClauseWrapper>
    </ClauseContext.Provider>
  );
});

ClauseComponent.displayName = 'ClauseComponent';

ClauseComponent.propTypes = {
  attributes: PropTypes.PropTypes.shape({
    'data-key': PropTypes.string,
  }),
  children: PropTypes.PropTypes.object.isRequired,
  name: PropTypes.string,
  clauseProps: PropTypes.shape({
    CLAUSE_DELETE_FUNCTION: PropTypes.func,
    CLAUSE_EDIT_FUNCTION: PropTypes.func,
    CLAUSE_TEST_FUNCTION: PropTypes.func,
  }),
  editor: PropTypes.any,
  error: PropTypes.bool,
  readOnly: PropTypes.bool,
  templateUri: PropTypes.string.isRequired,
};

export default ClauseComponent;
