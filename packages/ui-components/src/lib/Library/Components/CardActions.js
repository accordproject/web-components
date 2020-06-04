import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ActionsContainer = styled.div`
  padding: 0;
  background-color: #F9F9F9;
  max-height: 30px;
`;

const Btn = styled.a`
  padding: 5px 10px;
  display: inline-block;
  color: #484848;
  font-family: "IBM Plex Sans";
  font-size: 0.75em;
  font-weight: bold;
`;

const PrimaryBtn = styled(Btn)`
  width: 60%;
  border-right: 1px solid #E1E5EB;
  cursor: pointer;
  &:hover {
    color: #3087CB;
  }
`;

const SecondaryBtn = styled(Btn)`
  float: right;
  width: 40%;
  font-size: 0.75em;
  font-weight: 300;
  text-align: center;
`;

/**
 * A Card Actions component that renders buttons inside Library Item Card.
 */
const CardActions = props => (
  <ActionsContainer className='cicero-ui__library-card-actions'>
    <PrimaryBtn
      onClick={() => props.onPrimaryButtonClick(props.item)}
      className='cicero-ui__library-card-primary-btn'
    >
       + Add to contract
    </PrimaryBtn>
    <SecondaryBtn
      onClick={() => props.onSecondaryButtonClick(props.item)}
      className='cicero-ui__library-card-secondary-btn'
    >
      Details
    </SecondaryBtn>
  </ActionsContainer>
);

CardActions.propTypes = {
  item: PropTypes.object.isRequired,
  onPrimaryButtonClick: PropTypes.func.isRequired,
  onSecondaryButtonClick: PropTypes.func.isRequired,
};

export default CardActions;
