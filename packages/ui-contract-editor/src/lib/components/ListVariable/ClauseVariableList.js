import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { ListIcon } from '../styles';
import * as addIcon from '../../icons/add';
import * as removeIcon from '../../icons/remove';

/**
 * Component to render a variable list inside a clause
 * This will have an id property of the clauseid
 * @param {*} props
 */
const ClauseVariableList = ({
  slateListKey, nodeValue, listIconStyle, currentHover, removeList, addList
}) => {
  const [hoveringRemoveIcon, setHoveringRemoveIcon] = useState(false);
  const [hoveringAddIcon, setHoveringAddIcon] = useState(false);
  const listIconProps = {
    viewBox: '0 0 18 18',
    className: 'listIcon',
    currentHover,
    style: listIconStyle,
    onMouseEnter: () => setHoveringRemoveIcon(true),
    onMouseLeave: () => setHoveringRemoveIcon(false),
    onClick: () => removeList(slateListKey)
  };

  const addIconProps = {
    ...listIconProps,
    className: `${listIconProps.className} + addListIcon`,
    onMouseEnter: () => setHoveringAddIcon(true),
    onMouseLeave: () => setHoveringAddIcon(false),
    onClick: () => addList(slateListKey, nodeValue.parentKey)
  };

  return (
        <>
           {!(nodeValue.head && nodeValue.tail) && <ListIcon {...listIconProps}>
                {removeIcon.icon(hoveringRemoveIcon)}
            </ListIcon>}
            {nodeValue.tail && <ListIcon { ...addIconProps}>
                {addIcon.icon(hoveringAddIcon)}
            </ListIcon>}

        </>
  );
};

ClauseVariableList.propTypes = {
  listIconStyle: PropTypes.object,
  currentHover: PropTypes.bool,
  nodeValue: PropTypes.object,
  slateListKey: PropTypes.string,
  removeList: PropTypes.func,
  addList: PropTypes.func,
};

export default ClauseVariableList;
