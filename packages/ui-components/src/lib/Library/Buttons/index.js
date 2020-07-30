/* React */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';

/* Styling */
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';

const ActionButton = styled.button.attrs({
  'aria-label': 'Upload Button',
})`
  position: relative;
  font-weight: 300;
  text-align: right;
  text-decoration: none;
  font-size: 0.87em;
  color: #76777D;
  background-color: inherit;
  border: 0;
  cursor: pointer;
  align-self: flex-start;
  &:hover {
    color: #0361DE;
    text-decoration: underline;
  }
  &:focus {
    outline: none;
    color: #3089FF;
    text-decoration: underline;
  }
  &:active {
    color: #3089FF;
    text-decoration: underline;
  }
`;

export const ImportComponent = props => {
  if (!props.onImportItem) return null;

  return (
    <ActionButton
      onClick={props.onImportItem}
      aria-label='Upload Button'
      className='ui-components__library-import-button'
    >
      Import from VS Code
    </ActionButton>
  );
};

export const UploadComponent = props => {
  const fileInputRef = useRef(null);

  if (!props.onUploadItem) return null;

  return (
    <ActionButton
      onClick={() => fileInputRef.current.click()}
      className='ui-components__library-upload-button'
    >
      Upload your tempate
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onClick={event => {
          // React doesn't automatically reset file input
          event.persist();
          event.target.value = null;
        }}
        onChange={props.onUploadItem}
      />
    </ActionButton>
  );
};

export const NewItemComponent = props => {
  if (!props.onAddItem) return null;

  return (
    <Button
      content="New library Item"
      aria-label='Add Library Item Button'
      color="blue"
      fluid
      icon="plus"
      onClick={props.onAddItem}
      className='ui-components__library-add-item-button'
      style={{ margin: '5px 0' }}
    />
  );
};

ImportComponent.propTypes = { onImportItem: PropTypes.func };
UploadComponent.propTypes = { onUploadItem: PropTypes.func };
NewItemComponent.propTypes = { onAddItem: PropTypes.func };
