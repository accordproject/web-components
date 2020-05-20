## Cicero-UI - Library

### Usage

```shell
npm install @accordproject/cicero-ui
```

```js
import { Library } from '@accordproject/cicero-ui';

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

### Props

- `items` [REQUIRED] : An `array` which contains library item objects. Required keys are: `uri`, `name`, `version` and `description`.
Optional keys are: `displayName`, `logoUrl` and `itemType` (for heterogeneous libraries)
- `onPrimaryButtonClick` [REQUIRED] : A `function` callback which is called when a primary button in a library item card is clicked. A single argument is passed - the item object.
- `onSecondaryButtonClick` [REQUIRED] : A `function` callback which is called when a secondary button in a library item card is clicked. A single argument is passed - the item object.
- `onUploadItem` [OPTIONAL] : A `function` callback which is called when a link to upload a new library item is clicked.
- `onImportItem` [OPTIONAL] : A `function` callback which is called when a link to import a new library item is clicked.
- `onAddItem` [OPTIONAL] : A `function` callback which is called when a link to add a new library item is clicked.
- `itemTypes` [OPTIONAL] : An `array` of item types, default: `[{ name: 'CLAUSE TEMPLATE', type: 'template', filterName: 'Templates' }]`.
`name` field is shown on the second line of the library card.
`type` field corresponds to `item.itemType` attribute and is used to match a given `item` to its itemType in the `itemTypes` array.
`filterName` field is shown as a label for the type filter checkbox. This filter is ommited if the library is homogeneous.

### Custom styling

The component provides classes which can be used to apply custom styles to its individual parts.

- `cicero-ui__library-search-input` : search input.
- `cicero-ui__library-cards-wrapper` : library cards wrapper element.
- `cicero-ui__library-card` : library card. An additional class of `item.itemType` will be added to the card,
so different CSS selectors can be used based on the item's `itemType` value.
- `cicero-ui__library-card-content` : content element inside a library item card.
- `cicero-ui__library-card-logo` : logo element inside a library item card.
- `cicero-ui__library-card-header` : header element inside a library item card.
- `cicero-ui__library-card-meta` : meta element inside a library item card.
- `cicero-ui__library-card-type` : item type name element inside a library item card.
- `cicero-ui__library-card-item-version` : version element inside a library item card.
- `cicero-ui__library-card-actions` : actions element inside a library item card.
- `cicero-ui__library-card-primary-btn` : primary button inside a library item card.
- `cicero-ui__library-card-secondary-btn` : secondary button inside a library item card.
- `cicero-ui__library-add-item-button` : add new library item button.
- `cicero-ui__library-upload-button` : upload new library item button.
- `cicero-ui__library-import-button` : import new library item button.
