## Cicero-UI - ErrorLogger

### Usage

```shell
npm install @accordproject/cicero-ui
```

```js
import { ErrorLogger } from '@accordproject/cicero-ui';

const navigateToClauseError = // Insert your navigation function here.

const errorsPropsObject = {
    ERRORS_HEADER_BACKGROUND (string),
    ERRORS_HEADER_BACKGROUND_HOVER (string),
    ERRORS_HEADER_EXPAND_ARROW (string),
    ERRORS_HEADER_BORDER_TOP (string),
    ERRORS_HEADER_SHADOW (string),
    ERRORS_DISPLAY_BACKGROUND (string),
    ERRORS_DISPLAY_SHADOW (string),
    ERRORS_DISPLAY_Z_INDEX (string),
    ERROR_BORDER_BOTTOM (string),
    ERROR_EXPAND_ARROW (string),
    ERROR_FILE (string),
    ERROR_FILE_HOVER (string),
    ERROR_TYPE (string),
    ERROR_FULL_MESSAGE (string),
    ERROR_SHORT_MESSAGE (string),
};

const ErrorContainer = props => (
    <ErrorLogger errors={props.errors} errorsProps={errorsPropsObject} errorNav={navigateToClauseError}/>
);
```

### Props

#### Expected to be Provided

- `errors` : An `object` with unique key and error's data.

#### Require Provision

- `errorsProps` : An optional `object`, see below.
- `errorNav` : An optional `function` which will navigate to the corresponding error.

### Specifications

This component is built to have the following dimensions:

```js
width: '100%';
```

You can style the error component, as well as the individual errors. An object may be passed down this component with the following possible CSS inputs as strings:
- `ERRORS_HEADER_BACKGROUND`
- `ERRORS_HEADER_BACKGROUND_HOVER`
- `ERRORS_HEADER_EXPAND_ARROW`
- `ERRORS_HEADER_BORDER_TOP`
- `ERRORS_HEADER_SHADOW`
- `ERRORS_DISPLAY_BACKGROUND`
- `ERRORS_DISPLAY_SHADOW`
- `ERRORS_DISPLAY_Z_INDEX`
- `ERROR_BORDER_BOTTOM`
- `ERROR_EXPAND_ARROW`
- `ERROR_FILE`
- `ERROR_FILE_HOVER`
- `ERROR_TYPE`
- `ERROR_FULL_MESSAGE`
- `ERROR_SHORT_MESSAGE`
