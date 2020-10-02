## UI Components - Library

### Usage

```shell
npm install @accordproject/ui-components
```

```js
import { Library } from '@accordproject/ui-components';

const LibraryComponent = props => (
    <Library
        onUploadItem={props.onUploadItem}
        onImportItem={props.onImportItem}
        onAddItem={props.onAddItem}
        items={props.items}
        onPrimaryButtonClick={props.onPrimaryButtonClick}
        onSecondaryButtonClick={props.onSecondaryButtonClick}
        itemTypes={props.itemTypes}
    />
);
```

## Props

### Expected Properties

#### Values

- `items` [REQUIRED]: An `array` which contains library item objects. Required keys are: `uri`, `name`, `version` and `description`
  - Optional keys are: `displayName`, `logoUrl` and `itemType` (for heterogeneous libraries)
- `itemTypes` [OPTIONAL]: An `array` of item types, default
  - `[{ name: 'CLAUSE TEMPLATE', type: 'template', filterName: 'Templates' }]`
  - `name` field is shown on the second line of the library card
  - `type` field corresponds to `item.itemType` attribute and is used to match a given `item` to its itemType in the `itemTypes` array
  - `filterName` field is shown as a label for the type filter checkbox. This filter is ommited if the library is homogeneous

#### Functionality

- `onPrimaryButtonClick` [REQUIRED]: A `function` callback which is called when a primary button in a library item card is clicked. A single argument is passed - the item object
- `onSecondaryButtonClick` [REQUIRED]: A `function` callback which is called when a secondary button in a library item card is clicked. A single argument is passed - the item object
- `onUploadItem` [OPTIONAL]: A `function` callback which is called when a link to upload a new library item is clicked
- `onImportItem` [OPTIONAL]: A `function` callback which is called when a link to import a new library item is clicked
- `onAddItem` [OPTIONAL]: A `function` callback which is called when a link to add a new library item is clicked

### Custom Styling

The component provides classes which can be used to apply custom styles to its individual parts.

- `ui-components__library-search-input`: Search input
- `ui-components__library-cards-wrapper`: Library cards wrapper element
- `ui-components__library-card`: Library card. An additional class of `item.itemType` will be added to the card,
so different CSS selectors can be used based on the item's `itemType` value
- `ui-components__library-card-content`: Content element inside a library item card
- `ui-components__library-card-logo`: Logo element inside a library item card
- `ui-components__library-card-header`: Header element inside a library item card
- `ui-components__library-card-meta`: Meta element inside a library item card
- `ui-components__library-card-type`: Item type name element inside a library item card
- `ui-components__library-card-item-version`: Version element inside a library item card
- `ui-components__library-card-actions`: Actions element inside a library item card
- `ui-components__library-card-primary-btn`: Primary button inside a library item card
- `ui-components__library-card-secondary-btn`: Secondary button inside a library item card
- `ui-components__library-add-item-button`: Add new library item button
- `ui-components__library-upload-button`: Upload new library item button
- `ui-components__library-import-button`: Import new library item button
