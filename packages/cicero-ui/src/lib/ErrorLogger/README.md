## Cicero-UI - ErrorLogger

### Usage

```shell
npm install @accordproject/cicero-ui
```

```js
import { ErrorLogger } from '@accordproject/cicero-ui';

const navigateToClauseError = // Insert your navigation function here.

const ErrorContainer = props => (
    <ErrorLogger errors={props.errors} errorNav={navigateToClauseError}/>
);
```

## Props

### Expected Properties

#### Values

- `errors` [REQUIRED]: An `object` with unique key and error's data

#### Functionality

- `errorNav` [OPTIONAL]: An optional `function` which will navigate to the corresponding error

### Custom Styling

The component provides classes which can be used to apply custom styles to its individual parts.

- `cicero-ui__error-wrapper`: Component wrapper
- `cicero-ui__error-component`: Individual error component
- `cicero-ui__error-header`: Summary of number of errors
- `cicero-ui__error-display`: Component displaying when expanded
- `cicero-ui__error-bar-arrow`: Arrow on the right to indicate expand / collapse display
- `cicero-ui__error-arrow-div`: Arrow to indicate expand / collapse individual error
- `cicero-ui__error-symbol`: Symbol indicating errors exist
- `cicero-ui__error-file`: File in which error stems from
- `cicero-ui__error-type`: Type of error generated
- `cicero-ui__error-short-message`: Short summary
- `cicero-ui__error-full-message`: Detailed summary