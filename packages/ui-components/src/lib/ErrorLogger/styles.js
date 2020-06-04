/* Styling */
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';

/* Components */
export const ErrorDisplay = styled.div`
    bottom: 25px;
    width: 100%;
    position: fixed;
    max-height: 300px;
    overflow-y: scroll;
    background-color: #1E2D53;
    box-shadow: 0 -2px 20px 0 rgba(20,31,60,0.65);
`;

ErrorDisplay.displayName = 'cicero-ui__error-display';

export const ErrorsHeader = styled.div`
    width: 100%;
    position: fixed;
    transition: 1s;
    padding: 0.1em 0.1em 0.1em 1em;
    bottom: 0;
    height: 25px;
    display: ${props => (props.errors ? 'inline' : 'none')};
    background-color: #1E2D53;
    box-shadow: 0 -2px 20px 0 rgba(20,31,60,0.65);
    border-top:  1px solid #50637F;

    color: #FF4242;
    font-family: "IBM Plex Sans";
    font-size: 1em;
    font-weight: bold;
    letter-spacing: -0.5px;
    line-height: 20px;

    &:hover {
        background-color: #364C77;
        cursor: pointer;
    }
`;

ErrorsHeader.displayName = 'cicero-ui__error-header';

export const ErrorSymbol = styled(Icon)`
    vertical-align: middle;
`;

ErrorSymbol.displayName = 'cicero-ui__error-symbol';

export const ErrorBarArrow = styled.div`
    float: right;
    margin: 5px 15px;

    border-top: ${props => (props.errorDisplay
    ? ('7px solid #7B9AD1') : '0')};

    border-right: 4px solid transparent;

    border-left: 4px solid transparent;

    border-bottom: ${props => (props.errorDisplay
    ? '0' : ('7px solid #7B9AD1'))};
`;

ErrorBarArrow.displayName = 'cicero-ui__error-bar-arrow';

export const ErrorComponent = styled.div`
    width: 100%;
    color: #F0F0F0;
    border-bottom: 1px solid #50637F;
    padding: 10px 16px;

    display: grid;
    grid-row-gap: 20px;
    grid-template-areas: "errorArrow errorFile errorType errorMessage"
                        "errorFull errorFull errorFull errorFull";
    grid-template-columns: 0.25fr 1fr 1fr 8fr;
    grid-template-rows: min-content auto;
`;

ErrorComponent.displayName = 'cicero-ui__error-component';

export const ErrorFile = styled.a`
    text-decoration: underline;

    color: #FFFFFF;
    font-family: "IBM Plex Sans";
    font-size: 0.81em;
    line-height: 13px;

    grid-area: errorFile;
    align-self: center;
    &:hover {
        cursor: pointer;
        color: #0066CC;
    }
`;

ErrorFile.displayName = 'cicero-ui__error-file';

export const ErrorType = styled.div`
    grid-area: errorType;
    color: #B9BCC4;
    font-family: "IBM Plex Sans";
    font-size: 0.81em;
    line-height: 13px;
    align-self: center;
    padding: 5px;
`;

ErrorType.displayName = 'cicero-ui__error-type';

export const ErrorShortMessage = styled.div`
    grid-area: errorMessage;
    color: #B9BCC4;
    font-family: "IBM Plex Sans";
    font-size: 0.81em;
    line-height: 13px;
    align-self: center;
    padding: 5px;
`;

ErrorShortMessage.displayName = 'cicero-ui__error-short-message';

export const ErrorFullMessage = styled.div`
    grid-area: errorFull;
    color: #FFFFFF;
    font-family: "IBM Plex Sans";
    font-size: 0.81em;
    line-height: 13px;
`;

ErrorFullMessage.displayName = 'cicero-ui__error-full-message';

export const ArrowDiv = styled.div`
    grid-area: errorArrow;
    place-self: center;
    width: 0;
    height: 0;
    margin: 5px;

    border-top: ${props => (props.expanded
    ? ('10px solid #50637F') : '4px solid transparent')};

    border-right: ${props => (props.expanded ? '4px solid transparent' : '0')};

    border-bottom: ${props => (props.expanded ? '0' : '4px solid transparent')};

    border-left: ${props => (props.expanded
    ? '4px solid transparent' : ('10px solid #50637F'))};

    &:hover {
        cursor: pointer;
    }
`;

ArrowDiv.displayName = 'cicero-ui__error-arrow-div';
