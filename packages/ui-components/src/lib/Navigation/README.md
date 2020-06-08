## UI Components - Navigation

### Usage

```
npm install @accordproject/ui-components
```

```js
import { Navigation } from '@accordproject/ui-components';

const navigateToHeader = // Insert your navigation function here

const NavigationContainer = props => (
    <Navigation
        headers={props.headers}
        navigateHeader={navigateToHeader}
    >
);
```

## Props

### Expected Properties

#### Values

- `headers` [REQUIRED]: An `array` which contains header objects, each appearing as such:

```js
    {
        key: node.key,
        text: node.text,
        type: node.type
    };
```

#### Functionality

- `navigateHeader` [OPTIONAL]: An optional `function` which will navigate to the corresponding header

### Custom Styling

The component provides classes which can be used to apply custom styles to its individual parts.

- `ui-components__navigation-wrapper`: Component wrapper
- `ui-components__navigation-contract`: Contract navigation component
- `ui-components__navigation-file`: File navigation component
- `ui-components__navigation-switch-title-active`: Title for active component
- `ui-components__navigation-switch-title-inactive`: Title for inactive component
- `ui-components__navigation-header-clause`: Clause template heading
- `ui-components__navigation-header-one`: Header one heading
- `ui-components__navigation-header-two`: Header two heading
- `ui-components__navigation-header-three`: Header three heading