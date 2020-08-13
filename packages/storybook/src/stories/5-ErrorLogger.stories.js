import React from "react";
import { ErrorLogger } from '@accordproject/ui-components';
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

errorLogger.decorators =  [withKnobs];
errorLogger.parameters = {
  notes: "Notes ...."
};
