import React from 'react';
import styled from 'styled-components';

const Menu = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  background-color: #FFF;
  padding: 15px;
  z-index: 10;
  display: flex;
  align-content: space-evenly;
  justify-content: center;
  margin-bottom: 20px;
  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
`;

const ToolbarMenu = React.forwardRef(
  ({ ...props }, ref) => (<Menu {...props} ref={ref} />)
);

ToolbarMenu.displayName = 'ToolbarMenu';

export default ToolbarMenu;
