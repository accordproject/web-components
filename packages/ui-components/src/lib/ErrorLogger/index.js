/* React */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

/* Styling */
import * as ACT from './actions';

/* Actions */
import * as SC from './styles';

/* Component */
import ErrorComponent from './Error';

const ErrorLogger = (props) => {
  const { errors, errorNav } = props;
  const errorLength = Object.keys(errors).length ? Object.keys(errors).length : 0;

  const [errorsVisible, setErrorsVisible] = useState(false);

  const handleClickErrorsBar = () => {
    if (ACT.gtZero(errorLength)) { setErrorsVisible(!errorsVisible); }
  };

  const headerProps = {
    className: 'cicero-ui__error-header',
    errors: ACT.errorsExist(errors),
    onClick: handleClickErrorsBar,
  };

  const displayProps = {
    className: 'cicero-ui__error-display',
    errorDisplay: errorsVisible,
  };

  const barArrowProps = {
    errorDisplay: errorsVisible,
    className: 'cicero-ui__error-bar-arrow',
  };

  const symbolProps = {
    name: 'exclamation triangle',
    size: 'small'
  };

  const errorComponentGenerator = errors => Object.values(errors)
    .map(errorValue => <ErrorComponent
      error={errorValue}
      errorNav={errorNav}
      key={ACT.keySwitchCase(errorValue)} />);

  return (
    <div className="cicero-ui__error-wrapper">
      {errorsVisible
        && <SC.ErrorDisplay {...displayProps} >
            {errorComponentGenerator(errors)}
        </SC.ErrorDisplay>
    }
      <SC.ErrorsHeader {...headerProps} >
        {ACT.gtZero(errorLength)
          && <SC.ErrorSymbol {...symbolProps} />}
        {ACT.errorArrayLength(errors)} {ACT.isMultipleErrors(errors)}
        <SC.ErrorBarArrow {...barArrowProps} />
      </SC.ErrorsHeader>
    </div>
  );
};

ErrorLogger.propTypes = {
  errors: PropTypes.object.isRequired,
  errorNav: PropTypes.func,
};

export default ErrorLogger;
