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
  background-color: #979797;
  text-align: center;
  user-select: none;
`;

const PageBreak = styled.span`
  overflow: visible; /* For IE */
  padding: 0 15px;
  user-select: none;
  width: max-content !important;
  height: 14px;
  width: 83px;
  color: #949CA2;
  font-family: inherit;
  font-size: 13px;
  font-weight: bold;
  letter-spacing: 0.3px;
  line-height: 14px;
`;

const HorizontalRule = (props) => (
  <div contentEditable={false} {...props.attributes}>
    <br />
      <HorizontalRuleWrapper contentEditable={false}>
        <HorizontalLine />
        <PageBreak contentEditable={false}>{props.children}PAGE BREAK</PageBreak>
        <HorizontalLine />
      </HorizontalRuleWrapper>
    <br />
  </div>
);

HorizontalRule.propTypes = {
  attributes: PropTypes.any,
  children: PropTypes.any,
};

export default HorizontalRule;
