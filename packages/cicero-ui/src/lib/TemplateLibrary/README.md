## Cicero-UI - TemplateLibrary

### Usage

```shell
npm install @accordproject/cicero-ui
```

```js
import { TemplateLibrary } from '@accordproject/cicero-ui';

const libraryPropsObject = {
    ACTION_BUTTON (string),
    ACTION_BUTTON_BG (string),
    ACTION_BUTTON_BORDER (string),
    HEADER_TITLE (string),
    SEARCH_COLOR (string),
    TEMPLATE_BACKGROUND (string),
    TEMPLATE_DESCRIPTION (string),
    TEMPLATE_TITLE (string),
}

const LibraryComponent = props => (
    <TemplateLibrary
        templates={props.templatesArray}
        upload={props.uploadCTA}
        import={props.importTemplate}
        addTemp={props.addNewTemplate}
        addToCont={props.addToContract}
        libraryProps={libraryPropsObject}
    />
);
```

### Props

#### Expected to be Provided

- `templates` : An `array` which contains template objects with the following keys: `uir`, `name`, `version`, `description`.
- `upload` : A `function` which calls for upload functionality within the app this component is embedded in.
- `import` : A `function` which calls for import functionality within the app this component is embedded in.
- `addTemp` : A `function` which adds a new blank template to the array of templates in the Redux store of the app this component is embedded in.
- `addToCont` : A `function` which calls for adding the selected template to the Redux store in the app this component is embedded in. This will result in another component having use of its data.

#### Require Provision

- `libraryProps` : An optional `object`, see below.

### Specifications

This component is built to have the following dimensions:

```js
height: 700px;
width: 485px;
```

You can style the template card components, as well as the header. An object may be passed down this component with the following possible CSS inputs as strings:
- `ACTION_BUTTON`
- `ACTION_BUTTON_BG`
- `ACTION_BUTTON_BORDER`
- `HEADER_TITLE`
- `SEARCH_COLOR`
- `TEMPLATE_BACKGROUND`
- `TEMPLATE_DESCRIPTION`
- `TEMPLATE_TITLE`