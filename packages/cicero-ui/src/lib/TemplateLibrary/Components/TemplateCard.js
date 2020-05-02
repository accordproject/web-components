import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Image } from 'semantic-ui-react';

import TemplateActions from './TemplateActions';

const CardContainer = styled(Card)`
  margin: 10px 0 !important;
  border: ${props => props.tempborder || 'none'};
  border-radius: 6px !important;
  background-color: ${props => props.color || '#fff'} !important;
  text-align: left;
  box-shadow: 0 1px 9px 0 rgba(0,0,0,0.1) !important;
`;

const Title = styled.div`
  display: inline;
  color: ${props => props.color || null};
  font-size: medium;
  font-weight: 600;
  line-height: 16px;
`;

const TemplateLogo = styled(Image)`
  position: absolute !important;
  top: 13px;
  right: 16px;
  max-height: 23px;
`;

const Version = styled.span`
  margin-left: 10px;
  font-size: 0.75em;
  font-weight: 300;
`;

const DescriptionContainer = styled(Card.Description)`
  max-width: 400px;
  margin: auto;
  font-size: 0.79em;
  color: ${props => props.color || null} !important;
`;

/**
 * A Template Card component that will display the each template
 * and it's details.
 */
const TemplateCard = props => (
    <CardContainer fluid
      key={props.template.uri}
      color={props.libraryProps.TEMPLATE_BACKGROUND}
      tempborder={props.libraryProps.TEMPLATE_BORDER}
    >
        <Card.Content>
          <TemplateLogo src={props.template.icon} />
          <Title color={props.libraryProps.TEMPLATE_TITLE}>
            {
              props.template.displayName
                ? props.template.displayName
                : props.template.name
            }
            <Version>v {props.template.version}</Version>
          </Title>
          <DescriptionContainer color={props.libraryProps.TEMPLATE_DESCRIPTION}>
            {props.template.description}
          </DescriptionContainer>
        </Card.Content>
        <TemplateActions
          libraryProps={props.libraryProps}
          addToCont={props.addToCont}
          uriKey={props.template.uri}
          handleViewDetails={props.handleViewTemplate}
          className="templateAction"
        />
    </CardContainer>
);

TemplateCard.propTypes = {
  template: PropTypes.object,
  addToCont: PropTypes.func,
  handleViewTemplate: PropTypes.func,
  libraryProps: PropTypes.shape({
    ACTION_BUTTON: PropTypes.string,
    ACTION_BUTTON_BG: PropTypes.string,
    ACTION_BUTTON_BORDER: PropTypes.string,
    HEADER_TITLE: PropTypes.string,
    TEMPLATE_BACKGROUND: PropTypes.string,
    TEMPLATE_BORDER: PropTypes.string,
    TEMPLATE_DESCRIPTION: PropTypes.string,
    TEMPLATE_TITLE: PropTypes.string,
  }),
};

export default TemplateCard;
