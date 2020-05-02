export const gtZero = input => input > 0;

export const typeSwitchCase = (input) => {
  switch (true) {
    case ('modelError' in input):
      return 'Model';
    case ('parseError' in input):
      return 'Grammar';
    default:
      return 'Unknown';
  }
};

export const keySwitchCase = (input) => {
  switch (true) {
    case ('modelError' in input):
      return input.clauseTemplateId;
    case ('parseError' in input):
      return input.clauseId;
    default:
      return null;
  }
};

export const overalltypeSwitchCase = (input) => {
  switch (true) {
    case ('modelError' in input):
      return input.modelError;
    case ('parseError' in input):
      return input.parseError;
    default:
      return null;
  }
};

export const errorsExist = errors => gtZero(Object.keys(errors).length);

export const errorArrayLength = errors => (errorsExist(errors) ? Object.keys(errors).length : 'No');

export const isMultipleErrors = errors => ((Object.keys(errors).length > 1) ? 'Errors' : 'Error');

export const truncateMessage = string => ((string.length > 200)
  ? `${string.substring(0, 200)}...` : string);
