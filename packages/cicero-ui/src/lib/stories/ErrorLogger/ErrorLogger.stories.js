import React from "react";
import docs from "../../ErrorLogger/README.md";
import { withA11y } from "@storybook/addon-a11y";
import ErrorLogger from "../../ErrorLogger";
import { withKnobs, text } from "@storybook/addon-knobs";

export default { title: "'Components/Error Logger" };

export const errorLogger = () => {
  const errors = {
    error_1: {
      modelError: "Some Error"
    }
  };
  const errorsPropsObject = {
    ERRORS_HEADER_BACKGROUND: text("ERRORS_HEADER_BACKGROUND", ""),
    ERRORS_HEADER_BACKGROUND_HOVER: text("ERRORS_HEADER_BACKGROUND_HOVER", ""),
    ERRORS_HEADER_EXPAND_ARROW: text("ERRORS_HEADER_EXPAND_ARROW", ""),
    ERRORS_HEADER_BORDER_TOP: text("ERRORS_HEADER_BORDER_TOP", ""),
    ERRORS_HEADER_SHADOW: text("ERRORS_HEADER_SHADOW", ""),
    ERRORS_DISPLAY_BACKGROUND: text("ERRORS_DISPLAY_BACKGROUND", ""),
    ERRORS_DISPLAY_SHADOW: text("ERRORS_DISPLAY_SHADOW", ""),
    ERRORS_DISPLAY_Z_INDEX: text("ERRORS_DISPLAY_Z_INDEX", ""),
    ERROR_BORDER_BOTTOM: text("ERROR_BORDER_BOTTOM", ""),
    ERROR_EXPAND_ARROW: text("ERROR_EXPAND_ARROW", ""),
    ERROR_FILE: text("ERROR_FILE", ""),
    ERROR_FILE_HOVER: text("ERROR_FILE_HOVER", ""),
    ERROR_TYPE: text("ERROR_TYPE", ""),
    ERROR_FULL_MESSAGE: text("ERROR_FULL_MESSAGE", ""),
    ERROR_SHORT_MESSAGE: text("ERROR_SHORT_MESSAGE", "")
  };
  const mockNavigateToClauseError = () => alert('Insert your navigation function here.')
  return (
    <ErrorLogger
      errors={errors}
      errorNav={mockNavigateToClauseError}
      errorsProps={errorsPropsObject}
    />
  );
};
errorLogger.story = {
  component: errorLogger,
  decorators: [withA11y, withKnobs],

  parameters: {
    notes: docs
  }
};
