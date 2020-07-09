import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const HorizontalRuleWrapper = styled.div`
  overflow: visible; /* For IE */
  padding: 0;
  border: none;
  text-align: center;
  display: grid;
  grid-template-columns: auto max-content auto;
  user-select: none;
`;

const HorizontalLine = styled.div`
  overflow: visible; /* For IE */
  display: grid;
  align-self: center;
  padding: 0;
  height: 1px;
  background-color: #333;
  text-align: center;
  user-select: none;
`;

const PageBreak = styled.span`
  overflow: visible; /* For IE */
  padding: 0 20px;
  user-select: none;
`;

const HorizontalRule = (props) => (
    <HorizontalRuleWrapper contentEditable={false} {...props.attributes}>
      <HorizontalLine />
      <PageBreak contentEditable={false}>{props.children}PAGE BREAK</PageBreak>
      <HorizontalLine />
    </HorizontalRuleWrapper>
);

HorizontalRule.propTypes = {
  attributes: PropTypes.any,
  children: PropTypes.any,
};

export default HorizontalRule;
