## Cicero-UI - Navigation

### Usage

```
npm install @accordproject/cicero-ui
```

```js
import { Navigation } from '@accordproject/cicero-ui';

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

- `cicero-ui__navigation-wrapper`: Component wrapper
- `cicero-ui__navigation-contract`: Contract navigation component
- `cicero-ui__navigation-file`: File navigation component
- `cicero-ui__navigation-switch-title-active`: Title for active component
- `cicero-ui__navigation-switch-title-inactive`: Title for inactive component
- `cicero-ui__navigation-header-clause`: Clause template heading
- `cicero-ui__navigation-header-one`: Header one heading
- `cicero-ui__navigation-header-two`: Header two heading
- `cicero-ui__navigation-header-three`: Header three heading