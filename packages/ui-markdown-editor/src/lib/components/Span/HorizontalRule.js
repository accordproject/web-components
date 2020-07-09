import React from 'react';
import styled from 'styled-components';

const HorizontalRuleWrapper = styled.div`
  overflow: visible; /* For IE */
  padding: 0;
  border: none;
  text-align: center;
  display: grid;
  grid-template-columns: auto max-content auto;
`;

const HorizontalLine = styled.div`
  overflow: visible; /* For IE */
  display: grid;
  align-self: center;
  padding: 0;
  height: 1px;
  background-color: #333;
  text-align: center;
`;

const PageBreak = styled.span`
  overflow: visible; /* For IE */
  padding: 0 20px;
`;

const HorizontalRule = (props) => (
    <HorizontalRuleWrapper {...props}>
      <HorizontalLine />
      <PageBreak>PAGE BREAK</PageBreak>
      <HorizontalLine />
    </HorizontalRuleWrapper>
);

export default HorizontalRule;
