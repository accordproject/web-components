import React from "react";
import { withA11y } from "@storybook/addon-a11y";
import { ErrorLogger } from '@accordproject/cicero-ui';
import { withKnobs } from "@storybook/addon-knobs";

export default { title: 'Error Logger' };

export const errorLogger = () => {
  const errors = {
    error_1: {
      modelError: "Some Error"
    }
  };
  const mockNavigateToClauseError = () => alert('Insert your navigation function here.')
  return (
    <ErrorLogger
      errors={errors}
      errorNav={mockNavigateToClauseError}
    />
  );
};
errorLogger.story = {
  component: errorLogger,
  decorators: [withA11y, withKnobs],

  parameters: {
    notes: "Notes ...."
  }
};
