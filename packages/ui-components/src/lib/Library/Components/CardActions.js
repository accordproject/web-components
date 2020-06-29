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
  <ActionsContainer className='ui-components__library-card-actions'>
    <PrimaryBtn
    onMouseDown={(e) => {
      // we use onMouseDown here so as not to lose Slate selection
      // https://slate-js.slack.com/archives/C1RH7AXSS/p1587510249444700
      e.preventDefault();
      props.onPrimaryButtonClick(props.item);
    }}
      className='ui-components__library-card-primary-btn'
    >
       + Add to contract
    </PrimaryBtn>
    <SecondaryBtn
      onMouseDown={(e) => {
        e.preventDefault();
        props.onSecondaryButtonClick(props.item);
      }}
      className='ui-components__library-card-secondary-btn'
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
