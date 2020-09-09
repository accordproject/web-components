import _ from 'lodash';

/* React */
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/* Styling */
import styled from 'styled-components';
import { Input, Checkbox, Dropdown } from 'semantic-ui-react';

/* Internal */
import isQueryMatch from '../utilities/isQueryMatch';
import LibraryItemCard from './Components/LibraryItemCard';
import { ImportComponent, UploadComponent, NewItemComponent } from './Buttons';

const Wrapper = styled.div`
  font-family: 'IBM Plex Sans', sans-serif;
  position: relative;
  max-width: 355px;
  height: inherit;
  grid-template-areas:  "header" "functionTemps";
  grid-template-rows:    55px auto;
  grid-template-columns: 100%;
`;

const Header = styled.div`
  position: relative;
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 800;
  font-size: 1em;
  margin-bottom: 10px;

  display: grid;
  grid-area: header;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: "title imports";
`;

const HeaderImports = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Functionality = styled.div`
  font-family: 'IBM Plex Sans', sans-serif;
  max-width: 430px;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  grid-area: functionTemps;
  display: grid;
`;

const ItemTypeFilterContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
  margin-top: 15px;
`;

const searchInputStyles = {
  margin: '5px 0',
  width: '100%',
  maxHeight: '40px',
  borderRadius: '3px',
  boxShadow: 'inset 0 0 4px 0 #ABABAB',
};

const LibraryItemCards = styled.div`
  margin: 0;
  width: 100%;
  height: calc(100% - 54px);
  display: inherit;
  overflow-y: scroll;
`;

/**
 * A Library component that displays the filtered list of library items
 */

const LibraryComponent = (props) => {
  const [query, setQuery] = useState([]);
  const [ciceroVersion, setCiceroVersion] = useState([]);

  const [itemTypeFilter, setItemTypeFilter] = useState(
    props.itemTypes.reduce((acc, el) => ({ ...acc, [el.type]: true }), {})
  );

  const distinctCiceroVersions = props.items.reduce((acc, { version }) => {
    if (!acc[version]) {
      acc[version] = 1;
    }
    return acc;
  }, {});
  const distinctOptions = [{ key: '', value: '', text: '' }, ...Object.keys(distinctCiceroVersions).map(
    (version, index) => ({
      key: index,
      value: version,
      text: version
    })
  )];

  const onCiceroVersionChange = ({ value }) => {
    setCiceroVersion(value);
  };

  const onQueryChange = (e, input) => {
    const inputQuery = input.value.toLowerCase().trim().split(' ').filter(q => q.length);
    if (inputQuery !== query) {
      setQuery(inputQuery);
    }
  };

  const renderHeader = useCallback(() => {
    if (!props.onUploadItem && !props.onImportItem) return null;

    return (
      <Header>
        <HeaderImports>
          <ImportComponent onImportItem={props.onImportItem} />
          <UploadComponent onUploadItem={props.onUploadItem} />
        </HeaderImports>
      </Header>
    );
  }, [props.onImportItem, props.onUploadItem]);

  const filterItemsByQuery = useCallback(() => {
    let filtered = props.items;

    if (query.length) {
      filtered = _.filter(
        filtered,
        i => isQueryMatch([i.name, i.displayName, i.uri], query)
      );
    }

    return filtered;
  }, [props.items, query]);

  const filterItems = useCallback(() => {
    let filtered = filterItemsByQuery();

    const currentFilter = Object.keys(_.pickBy(itemTypeFilter));
    if (currentFilter.length !== props.itemTypes.length) {
      filtered = filtered.filter(item => currentFilter.indexOf(item.itemType) > -1);
    }

    if (ciceroVersion.length) {
      // pre-existinmg length for filtered present
      if (filtered.length < 1) {
        // populate filtered with available options again
        filtered = filterItemsByQuery();
      }
      filtered = filtered.filter((item) => item.version === ciceroVersion);
    }

    return filtered;
  }, [itemTypeFilter, ciceroVersion, props.itemTypes.length, filterItemsByQuery]);

  const renderItemTypeFilter = useCallback(() => {
    if (props.itemTypes.length === 1) return null;

    return (
      <ItemTypeFilterContainer>
        {
          props.itemTypes.map((itemType, idx) => (
            <Checkbox
              key={idx}
              label={itemType.filterName}
              style={{ marginRight: '10px' }}
              onChange={() => setItemTypeFilter({
                ...itemTypeFilter,
                [itemType.type]: !itemTypeFilter[itemType.type],
              })}
              checked={itemTypeFilter[itemType.type]}
            />
          ))
        }

        {
          distinctOptions.length > 1 ? (
            <Dropdown
              placeholder="Filter by cicero version"
              style={{ width: '200px' }}
              fluid
              onChange={(e, data) => onCiceroVersionChange(data)}
              options={distinctOptions}
            />
          ) : null
        }
      </ItemTypeFilterContainer>
    );
  }, [distinctOptions, itemTypeFilter, props.itemTypes]);

  const filtered = filterItems();
  const dislayedItemTypes = props.itemTypes.reduce(
    (acc, el) => ({ ...acc, [el.type]: el.name }),
    {}
  );

  return (
    <Wrapper>
      {renderHeader()}
      <Functionality>
        {renderItemTypeFilter()}
        <Input
          className="ui-components__library-search-input"
          fluid
          icon="search"
          placeholder="Search..."
          onChange={onQueryChange}
          style={searchInputStyles}
        />
        <NewItemComponent onAddItem={props.onAddItem} />
      </Functionality>
      <LibraryItemCards className="ui-components__library-cards-wrapper">
        {filtered.length ? (
          filtered.map((item) => (
            <LibraryItemCard
              key={item.uri}
              item={item}
              itemTypeName={dislayedItemTypes[item.itemType] || 'ITEM'}
              onPrimaryButtonClick={props.onPrimaryButtonClick}
              onSecondaryButtonClick={props.onSecondaryButtonClick}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>No results found</p>
        )}
      </LibraryItemCards>
    </Wrapper>
  );
};

LibraryComponent.propTypes = {
  onUploadItem: PropTypes.func,
  onImportItem: PropTypes.func,
  onAddItem: PropTypes.func,
  onPrimaryButtonClick: PropTypes.func.isRequired,
  onSecondaryButtonClick: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  itemTypes: PropTypes.arrayOf(PropTypes.object).isRequired
};

LibraryComponent.defaultProps = {
  itemTypes: [
    { name: 'CLAUSE TEMPLATE', type: 'template', filterName: 'Templates' }
  ]
};

export default LibraryComponent;
