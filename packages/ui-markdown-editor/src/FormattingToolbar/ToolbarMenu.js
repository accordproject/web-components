import React from 'react';
import styled from 'styled-components';

const Menu = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  min-width: 600px;
  background-color: #FFF;
  padding: 15px 15px 5px 15px;
  display: flex;
  align-content: space-evenly;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0px 0px 15px 15px rgba(255,255,255,1);
  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
  };
`;

const ToolbarMenu = React.forwardRef(
  ({ ...props }, ref) => (<Menu {...props} ref={ref} />)
);

ToolbarMenu.displayName = 'ToolbarMenu';

export default ToolbarMenu;

