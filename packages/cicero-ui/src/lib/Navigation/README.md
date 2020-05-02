## Cicero-UI - Navigation

### Usage

```
npm install @accordproject/cicero-ui
```

```js
import { Navigation } from '@accordproject/cicero-ui';

const navigateToHeader = // Insert your navigation function here
const navigationPropsInput = {
    NAVIGATE_SWITCH_TITLE_ACTIVE_COLOR (string),
    NAVIGATE_SWITCH_TITLE_INACTIVE_COLOR (string),
    NAVIGATE_SWITCH_TITLE_FONT_FAMILY (string),
    NAVIGATE_SWITCH_FILES_VISIBLE (boolean) (REQUIRED),

    NAVIGATION_POSITION (string),
    NAVIGATION_TOP_VALUE (string),
    NAVIGATION_MAX_HEIGHT (string),
    NAVIGATION_WIDTH (string),
    NAVIGATION_BACKGROUND_COLOR (string),

    CONTRACT_NAVIGATION_HEADER_COLOR (string),
    CONTRACT_NAVIGATION_CLAUSE_COLOR (string),
    CONTRACT_NAVIGATION_CLAUSE_HEADER_COLOR (string),

    CLAUSE_NAVIGATION_TITLE_COLOR (string),
    CLAUSE_NAVIGATION_TITLE_HOVER_COLOR (string),
    CLAUSE_NAVIGATION_EXPANSION_ARROW_COLOR (string),
    CLAUSE_NAVIGATION_EXPANSION_ARROW_HOVER_COLOR (string),
    CLAUSE_NAVIGATION_FILE_DELETE_COLOR (string),
    CLAUSE_NAVIGATION_FILE_DELETE_HOVER_COLOR (string),
    CLAUSE_NAVIGATION_FILE_ADD_COLOR (string),
    CLAUSE_NAVIGATION_FILE_ADD_HOVER_COLOR (string),
}

const NavigationContainer = props => (
    <Navigation
        headers={props.headers}
        navigateHeader={navigateToHeader}
        navigationProps={navigationPropsInput}
    >
);
```

### Props

#### Expected to be Provided

- `headers` : An `array` which contains header objects, each appearing as such:

```js
    {
        key: node.key,
        text: node.text,
        type: node.type
    };
```

#### Require Provision

- `navigationProps` : An optional `object`, see below.
- `navigateHeader` : An optional `function` which will navigate to the corresponding header.

### Specifications

The `FILES` section of the navigation requires a `boolean` to render or not:
- `NAVIGATE_SWITCH_FILES_VISIBLE`

You can style the navigation component, as well as the individual headers. An object may be passed down this component with the following possible CSS inputs as strings:
- `NAVIGATE_SWITCH_TITLE_ACTIVE_COLOR`
- `NAVIGATE_SWITCH_TITLE_INACTIVE_COLOR`
- `NAVIGATE_SWITCH_TITLE_FONT_FAMILY`
- `NAVIGATE_SWITCH_FILES_VISIBLE`

- `NAVIGATION_POSITION`
- `NAVIGATION_TOP_VALUE`
- `NAVIGATION_MAX_HEIGHT`
- `NAVIGATION_WIDTH`
- `NAVIGATION_BACKGROUND_COLOR`

- `CONTRACT_NAVIGATION_HEADER_COLOR`
- `CONTRACT_NAVIGATION_CLAUSE_COLOR`
- `CONTRACT_NAVIGATION_CLAUSE_HEADER_COLOR`

- `CLAUSE_NAVIGATION_TITLE_COLOR`
- `CLAUSE_NAVIGATION_TITLE_HOVER_COLOR`
- `CLAUSE_NAVIGATION_EXPANSION_ARROW_COLOR`
- `CLAUSE_NAVIGATION_EXPANSION_ARROW_HOVER_COLOR`
- `CLAUSE_NAVIGATION_FILE_DELETE_COLOR`
- `CLAUSE_NAVIGATION_FILE_DELETE_HOVER_COLOR`
- `CLAUSE_NAVIGATION_FILE_ADD_COLOR`
- `CLAUSE_NAVIGATION_FILE_ADD_HOVER_COLOR`