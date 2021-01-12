import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Image } from 'semantic-ui-react';

import CardActions from './CardActions';

const cardStyle = {
  margin: '10px 0',
  border: '1px solid #7B8084',
  borderRadius: '6px',
  backgroundColor: '#fff',
  textAlign: 'left',
  boxShadow: '0 1px 9px 0 rgba(0,0,0,0.1)',
};

const itemLogoStyle = {
  maxHeight: '20px',
  display: 'inline-block',
  objectFit: 'contain',
  float: 'right',
};

const DescriptionContainer = styled(Card.Description)``;

/**
 * A Library Item Card component that displays each library item and it's details.
 */
const LibraryItemCard = (props) => (
  <Card
    fluid
    key={props.item.uri}
    style={cardStyle}
    className={`ui-components__library-card ${props.item.itemType}`}
  >
    <Card.Content className="ui-components__library-card-content">
      <Image
        style={itemLogoStyle}
        src={props.item.logoUrl}
        className="ui-components__library-card-logo"
      />
      <Card.Header className="ui-components__library-card-header">
        {props.item.displayName || props.item.name}
      </Card.Header>
      <Card.Meta className="ui-components__library-card-meta">
        <span className="ui-components__library-card-item-type">
          {props.itemTypeName}
        </span>
        &nbsp;|&nbsp;
        <span className="ui-components__library-card-item-version">
          Version {props.item.version}
        </span>
      </Card.Meta>
      <DescriptionContainer>{props.item.description}</DescriptionContainer>
    </Card.Content>
    <CardActions
      item={props.item}
      onPrimaryButtonClick={props.onPrimaryButtonClick}
      onSecondaryButtonClick={props.onSecondaryButtonClick}
    />
  </Card>
);

LibraryItemCard.propTypes = {
  item: PropTypes.object.isRequired,
  onPrimaryButtonClick: PropTypes.func.isRequired,
  onSecondaryButtonClick: PropTypes.func.isRequired,
  itemTypeName: PropTypes.string.isRequired,
};

export default LibraryItemCard;
