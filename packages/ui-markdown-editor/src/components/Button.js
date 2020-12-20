import styled from 'styled-components';
import { BUTTON_COLORS } from '../utilities/constants';

const Button = styled.svg`
  place-self: center;
  user-select: none !important;
  width: ${props => props.width};
  min-width: 20px;
  min-height: 20px;
  height: ${props => props.height};
  padding: ${props => props.padding};
  background-color: ${props => props.background};
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${BUTTON_COLORS.BACKGROUND_ACTIVE};
  };
  @media (max-width:450px) {
    min-width:15px;
    min-height:15px;
    padding: ${props => props.paddingMob || props.padding};
  }
`;

export default Button;
