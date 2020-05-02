/* Styling */
import styled from 'styled-components';

/* Overall Navigation Component */

export const NavigationWrapper = styled.div`
    position: ${props => props.positionValue || 'static'};
    top: ${props => props.topValue || 'auto'};
    max-height: ${props => props.navMaxHeight || '80vh'};
    width: ${props => props.navWidth || 'inherit'};
    background-color: ${props => props.backgroundColor || 'inherit'};
    overflow-y: inherit;

    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 20px 1fr;
    grid-template-areas: "navigation files" "body body";
`;

/* Navigation Component Switch */

export const Title = styled.a`
    color: #FFFFFF;
    font-size: 1em;
    font-weight: bold;
    font-family: ${props => props.headerFont || 'serif'};
    &:hover {
        cursor: ${props => (props.filesVisible ? 'pointer' : 'auto')};
        color: ${props => props.titleActive || '#19C6C7'};
    }
`;

export const Navigation = styled(Title)`
    display: grid;
    grid-area: navigation;
    color: ${props => (props.navState === 'NAVIGATION'
    ? (props.titleActive || '#19C6C7')
    : (props.titleInactive || '#86888D'))};
`;

export const Files = styled(Title)`
    display: ${props => (props.filesVisible ? 'grid' : 'none')};
    grid-area: files;
    color: ${props => (props.navState === 'FILES'
    ? (props.titleActive || '#19C6C7')
    : (props.titleInactive || '#86888D'))};
`;

/* Contract Navigation */

export const ContractHeaders = styled.div`
    overflow: hidden;
    white-space: nowrap;
    padding-top: 10px;

    grid-area: body;

    &::-webkit-scrollbar-track {
        background: transparent !important;
    }
`;

export const HeaderOne = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
    margin-bottom: 2px;
    height: 24px;
    color: ${props => props.headerColor || '#B9BCC4'};
    font-family: "IBM Plex Sans";
    font-size: 1em;
    letter-spacing: -0.5px;
    line-height: 24px;
    &:hover {
        cursor: pointer;
        text-decoration: underline;
    }
`;

export const HeaderTwo = styled(HeaderOne)`
    margin-left: 20px;
`;

export const HeaderThree = styled(HeaderOne)`
    margin-left: 40px;
`;

export const HeaderClause = styled(HeaderOne)`
    color: ${props => props.clauseColor || '#FFFFFF'} !important;
    font-weight: bold;
`;
