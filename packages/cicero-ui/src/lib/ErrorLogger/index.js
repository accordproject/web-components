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
  const errorsProps = props.errorsProps || Object.create(null);

  const [errorsVisible, setErrorsVisible] = useState(false);

  const handleClickErrorsBar = () => {
    if (ACT.gtZero(errorLength)) { setErrorsVisible(!errorsVisible); }
  };

  const headerProps = {
    id: 'ErrorComponentHeader',
    errors: ACT.errorsExist(errors),
    onClick: handleClickErrorsBar,
    headerBackground: errorsProps.ERRORS_HEADER_BACKGROUND,
    headerBackgroundHover: errorsProps.ERRORS_HEADER_BACKGROUND_HOVER,
    headerShadow: errorsProps.ERRORS_HEADER_SHADOW,
    headerTop: errorsProps.ERRORS_HEADER_BORDER_TOP,
    zIndexInput: errorsProps.ERRORS_DISPLAY_Z_INDEX,
  };

  const displayProps = {
    id: 'ErrorComponentDisplay',
    errorDisplay: errorsVisible,
    displayBackground: errorsProps.ERRORS_DISPLAY_BACKGROUND,
    displayShadow: errorsProps.ERRORS_DISPLAY_SHADOW,
    zIndexInput: errorsProps.ERRORS_DISPLAY_Z_INDEX,
  };

  const barArrowProps = {
    errorDisplay: errorsVisible,
    headerBarArrow: errorsProps.ERRORS_HEADER_EXPAND_ARROW,
  };

  const symbolProps = {
    name: 'exclamation triangle',
    size: 'small'
  };

  const errorComponentGenerator = errors => Object.values(errors)
    .map(errorValue => <ErrorComponent
      errorProps={errorsProps}
      error={errorValue}
      errorNav={errorNav}
      key={ACT.keySwitchCase(errorValue)} />);

  return (
    <div>
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
  errorsProps: PropTypes.shape({
    ERRORS_HEADER_BACKGROUND: PropTypes.string,
    ERRORS_HEADER_BACKGROUND_HOVER: PropTypes.string,
    ERRORS_HEADER_EXPAND_ARROW: PropTypes.string,
    ERRORS_HEADER_BORDER_TOP: PropTypes.string,
    ERRORS_HEADER_SHADOW: PropTypes.string,
    ERRORS_DISPLAY_BACKGROUND: PropTypes.string,
    ERRORS_DISPLAY_SHADOW: PropTypes.string,
    ERRORS_DISPLAY_Z_INDEX: PropTypes.string,
    ERROR_BORDER_BOTTOM: PropTypes.string,
    ERROR_EXPAND_ARROW: PropTypes.string,
    ERROR_FILE: PropTypes.string,
    ERROR_FILE_HOVER: PropTypes.string,
    ERROR_TYPE: PropTypes.string,
    ERROR_FULL_MESSAGE: PropTypes.string,
    ERROR_SHORT_MESSAGE: PropTypes.string,
  }),
};

export default ErrorLogger;
