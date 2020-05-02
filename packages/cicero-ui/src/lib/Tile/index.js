import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TextForm from './TextForm';
import CurrentTextValue from './CurrentTextValue';

const TileWrapper = styled.div`
  border: 2px solid #F9F9F9;
  margin: 10px;
  padding: 15px;
  width: 350px;
`;

const Tile = props => (
  <TileWrapper>
    <h3>{props.header}</h3>
    <TextForm
    handleSubmit={props.handleSubmit}
    label={props.label}
    />
    <CurrentTextValue
      textValue={props.textValue}
      textLabel={props.textLabel}
    />
  </TileWrapper>
);


Tile.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  header: PropTypes.string,
  label: PropTypes.string.isRequired,
  textValue: PropTypes.string,
  textLabel: PropTypes.string,
};

export default React.memo(Tile);
