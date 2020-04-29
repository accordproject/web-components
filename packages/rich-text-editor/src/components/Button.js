import styled from 'styled-components';
import { BUTTON_COLORS } from '../utilities/constants';

const Button = styled.svg`
  place-self: center;
  user-select: none !important;
  width: ${props => props.width};
  height: ${props => props.height};
  padding: ${props => props.padding};
  background-color: ${props => props.background};
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${BUTTON_COLORS.BACKGROUND_ACTIVE};
  }
`;

export default Button;
