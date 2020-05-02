import React from "react";
import docs from "../../TemplateLibrary/README.md";
import { withA11y } from "@storybook/addon-a11y";
import { withKnobs, text } from "@storybook/addon-knobs";
import TemplateLibrary from "../../TemplateLibrary";

export default { title: "'Components/Template Library" };
export const templateLibrary = () => {
  const libraryPropsObject = {
    ACTION_BUTTON: text("ACTION_BUTTON", ""),
    ACTION_BUTTON_BG: text("ACTION_BUTTON_BG", ""),
    ACTION_BUTTON_BORDER: text("ACTION_BUTTON_BORDER", ""),
    HEADER_TITLE: text("HEADER_TITLE", ""),
    SEARCH_COLOR: text("SEARCH_COLOR", ""),
    TEMPLATE_BACKGROUND: text("TEMPLATE_BACKGROUND", ""),
    TEMPLATE_DESCRIPTION: text("TEMPLATE_DESCRIPTION", ""),
    TEMPLATE_TITLE: text("TEMPLATE_TITLE", "")
  };
  const templates = [
    {
      uri: text(
        "First template's Uri",
        "https://templates.accordproject.org/archives/acceptance-of-delivery@0.13.1.cta"
      ),
      name: text("First template's Name", "Acceptance of Delivery"),
      version: text("First template's Version", "^0.20.10"),
      description: text(
        "First template's Description",
        "This clause allows the receiver of goods to inspect them for a given time period after delivery."
      )
    },
    {
      uri:
        "https://templates.accordproject.org/archives/car-rental-tr@0.10.1.cta",
      name: "Car Rental (TR)",
      version: "^0.20.10",
      description: "Ta Simple Car Rental Contract in Turkish Language"
    },
    {
      uri:
        "https://templates.accordproject.org/archives/certificate-of-incorporation@0.3.1.cta",
      name: "Certificate Of Incorporation",
      version: "^0.20.10",
      description: "This is a sample Certificate of Incorporation."
    }
  ];
  const mockImport = () => {
    alert(
      "A function which calls for import functionality within the app this component is embedded in"
    );
  };
  const mockUpload = () => {
    alert(
      "A function which calls for upload functionality within the app this component is embedded in"
    );
  };
  const mockAddTemp = () => {
    alert(
      "A function which adds a new blank template to the array of templates in the Redux store of the app this component is embedded in."
    );
  };
  const mockAddToCont = () => {
    alert(
      " A function which calls for adding the selected template to the Redux store in the app this component is embedded in. This will result in another component having use of its data."
    );
  };
  return (
    <TemplateLibrary
      templates={templates}
      upload={mockUpload}
      import={mockImport}
      addTemp={mockAddTemp}
      addToCont={mockAddToCont}
      libraryProps={libraryPropsObject}
    />
  );
};

templateLibrary.story = {
  component: templateLibrary,
  decorators: [withA11y, withKnobs],
  parameters: {
    notes: docs
  }
};
