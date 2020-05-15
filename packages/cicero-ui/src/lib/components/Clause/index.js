/* React */
import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

/* Styling */
import * as S from '../styles';

/* Icons */
import * as deleteIcon from '../../icons/trash';
import * as editIcon from '../../icons/edit';
import * as testIcon from '../../icons/testIcon';

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

  return (
    <ClauseContext.Provider value={hovering}>
      <S.ClauseWrapper
        src={props.templateUri}
        id={props.clauseId}
        className='cicero-ui__clause'
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
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
        <S.ClauseBackground className='cicero-ui__clause-background'/>
        <S.ClauseHeader
          className='cicero-ui__clause-header'
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
        <S.ClauseBody {...props.attributes} ref={ref}>
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
  clauseId: PropTypes.string,
  clauseProps: PropTypes.shape({
    CLAUSE_DELETE_FUNCTION: PropTypes.func,
    CLAUSE_EDIT_FUNCTION: PropTypes.func,
    CLAUSE_TEST_FUNCTION: PropTypes.func,
  }),
  editor: PropTypes.any,
  readOnly: PropTypes.bool,
  templateUri: PropTypes.string.isRequired,
};

export default ClauseComponent;
