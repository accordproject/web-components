## UI Components - ErrorLogger

### Usage

```shell
npm install @accordproject/ui-components
```

```js
import { ErrorLogger } from '@accordproject/ui-components';

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

- `ui-components__error-wrapper`: Component wrapper
- `ui-components__error-component`: Individual error component
- `ui-components__error-header`: Summary of number of errors
- `ui-components__error-display`: Component displaying when expanded
- `ui-components__error-bar-arrow`: Arrow on the right to indicate expand / collapse display
- `ui-components__error-arrow-div`: Arrow to indicate expand / collapse individual error
- `ui-components__error-symbol`: Symbol indicating errors exist
- `ui-components__error-file`: File in which error stems from
- `ui-components__error-type`: Type of error generated
- `ui-components__error-short-message`: Short summary
- `ui-components__error-full-message`: Detailed summary