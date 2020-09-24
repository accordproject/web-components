import styled from 'styled-components';
import './index.css';

export const ClauseWrapper = styled.div`
  position: relative;
  margin: 10px -10px;
  display: grid;
  background-color: #F4F6FC;
  border: ${props => (props.error ? '1px solid #FF0000' : '1px solid #19C6C7')};
  border-radius: 3px;
  grid-template-columns: 10px 375px 1fr 25px 25px 25px 10px;
  grid-template-rows: 0px 10px 1fr;
  grid-template-areas: "one two three four five six seven"
                       "eight nine ten eleven twelve thirteen fourteen"
                       "fifteen sixteen seventeen eighteen nineteen twenty twentyone";
`;

export const ListIcon = styled.svg`
  visibility: ${props => (props.currentHover ? 'visible' : 'hidden')};
`;

export const ClauseConditional = styled.svg`
  visibility: ${props => (props.currentHover ? 'visible' : 'hidden')};
`;

export const ClauseConditionalTooltip = styled.span`
  visibility: ${props => (props.currentHover ? 'visible' : 'hidden')};
  margin-top: -${props => props.tooltipHeight}em;

  &:before {
    content: '';
    position: absolute;
    top: ${props => props.caretTop}px;
    left: ${props => props.caretLeft - 1}px;
    border-top: 5px solid #141F3C;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
  }

  &:after {
    content: '';
    position: absolute;
    top: ${props => props.caretTop}px;
    left: ${props => props.caretLeft}px;
    border-top: 4px solid #141F3C;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }
`;

export const ClauseOptional = styled.svg`
  visibility: ${props => (props.currentHover ? 'visible' : 'hidden')};
`;

export const ClauseOptionalTooltip = styled.span`
  visibility: ${props => (props.currentHover ? 'visible' : 'hidden')};
  margin-top: -${props => props.tooltipHeight}em;

  &:before {
    content: '';
    position: absolute;
    top: ${props => props.caretTop}px;
    left: ${props => props.caretLeft - 1}px;
    border-top: 5px solid #141F3C;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
  }

  &:after {
    content: '';
    position: absolute;
    top: ${props => props.caretTop}px;
    left: ${props => props.caretLeft}px;
    border-top: 4px solid #141F3C;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }
`;

export const ClauseHeader = styled.div`
  visibility: ${props => (props.currentHover ? 'visible' : 'hidden')};
  font-family: serif;
  grid-area: two / two / ten / ten;
  transition-duration: 0.5s;
  background: linear-gradient(180deg, #FFFFFF 0%, #F4F6FC 100%);
  align-self: center;
  justify-self: start;
  margin-bottom: 9px;
  padding: 3px;
  color: #696969;
  line-height: 14px;
  font-size: 0.87em;
  font-weight: 600;
`;

export const ClauseBody = styled.div`
  li {
    transition: none;
  }
  font-family: serif;
  grid-area: sixteen / sixteen / twenty / twenty;
  margin: 2px 0 10px;
  color: #141F3C;
  font-size: 1em;
  line-height: 22px;
`;

export const ClauseIcon = styled.svg`
  position: relative;
  z-index: 1;
  cursor: pointer;
  fill: ${props => (props.hovering ? props.clauseIconColor || '#19C6C7' : '#696969')};
`;

export const DragIcon = styled(ClauseIcon)`
  fill: #949CA2;
  &:hover {
    fill: #414F58;
  }
`;

const IconWrapper = styled.div`
  visibility: ${props => (props.currentHover ? 'visible' : 'hidden')};
  background: linear-gradient(180deg, #FFF 0%, #F4F6FC 100%);
  position: relative;
  z-index: 1;
  margin-bottom: 9px;
  padding: 4px;
  place-self: center;
  transition-duration: 0.5s;
  cursor: pointer;
`;

export const TestWrapper = styled(IconWrapper)`
  grid-area: four / four / eleven / eleven;
`;

export const EditWrapper = styled(IconWrapper)`
  grid-area: five / five / twelve / twelve;
`;

export const DeleteWrapper = styled(IconWrapper)`
  grid-area: six / six / thirteen / thirteen;
`;

export const DragWrapper = styled(IconWrapper)`
  grid-area: fifteen;
  background: linear-gradient(to right, #FFF 0%, #F4F6FC 100%);
  margin-right: 9px;
  padding: 4px 0 0 0;
  cursor: text;
`;

export const ClauseAdd = styled.svg`
  fill: #46608E;
  cursor: pointer;
  grid-area: editIcon;
  place-self: center;

  &:hover {
    fill: #FFFFFF;
  }
`;


export const HeaderToolTipWrapper = styled.div`
  position: absolute;
  top: -40px;
  z-index: 99;
`;

export const HeaderToolTip = styled.div.attrs({
  contentEditable: 'false',
  suppressContentEditableWarning: 'true'
})`
  background-color: #121212;
  padding: 10px;
  border-radius: 3px;
  color: #f0f0f0;
  z-index: 99;
  font-family: 'IBM Plex Sans', 'sans-serif';
  transition: all 0.3s ease;
  :after {
    content: " ";
    display: block;
    width: 0;
    height: 0;
    z-index: 99;
    position: absolute;
    top: 100%;
    left: 5px;
    border-radius: 0px;
    border-width: 6px;
    border-style: solid;
    border-color: #121212 transparent transparent transparent;
  }
`;

export const HeaderToolTipText = styled.span`
`;
