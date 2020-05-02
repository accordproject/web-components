/* React */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

/* Actions */
import * as ACT from './actions';

/* Styling */
import * as SC from './styles';

const ErrorComponent = (props) => {
  const { error, errorProps, errorNav } = props;
  const [specErrorVisible, setspecErrorVisible] = useState(false);

  const handleClickSpecError = () => {
    setspecErrorVisible(!specErrorVisible);
  };

  const componentProps = {
    borderBottom: errorProps.ERROR_BORDER_BOTTOM,
  };

  const fileProps = {
    errorFile: errorProps.ERROR_FILE,
    errorFileHover: errorProps.ERROR_FILE_HOVER,
  };

  const typeProps = {
    onClick: handleClickSpecError,
    errorType: errorProps.ERROR_TYPE,
  };

  const shortMessageProps = {
    onClick: handleClickSpecError,
    shortMessage: errorProps.ERROR_SHORT_MESSAGE,
  };

  const fullMessageProps = {
    fullMessage: errorProps.ERROR_FULL_MESSAGE,
  };

  const errorArrowProps = {
    expanded: specErrorVisible,
    onClick: handleClickSpecError,
    errorArrow: errorProps.ERROR_EXPAND_ARROW,
  };

  return (
    <SC.ErrorComponent {...componentProps}>

      <SC.ArrowDiv {...errorArrowProps} />
      <SC.ErrorFile {...fileProps} onClick={() => errorNav(error)} >
        {ACT.typeSwitchCase(error || {})}
      </SC.ErrorFile>

      <SC.ErrorType {...typeProps} >
        {ACT.overalltypeSwitchCase(error).name || 'Unknown Error'}:
      </SC.ErrorType>

      <SC.ErrorShortMessage {...shortMessageProps} >
        {ACT.truncateMessage(ACT.overalltypeSwitchCase(error).shortMessage || 'Unknown Error')}
      </SC.ErrorShortMessage>

      {specErrorVisible
        && <SC.ErrorFullMessage {...fullMessageProps} >
            {ACT.overalltypeSwitchCase(error).message || 'Unknown Error'}
          </SC.ErrorFullMessage>}
    </SC.ErrorComponent>
  );
};

ErrorComponent.propTypes = {
  error: PropTypes.object.isRequired,
  errorNav: PropTypes.func,
  errorProps: PropTypes.shape({
    ERRORS_HEADER_BACKGROUND: PropTypes.string,
    ERRORS_HEADER_BACKGROUND_HOVER: PropTypes.string,
    ERRORS_HEADER_EXPAND_ARROW: PropTypes.string,
    ERRORS_HEADER_BORDER_TOP: PropTypes.string,
    ERRORS_HEADER_SHADOW: PropTypes.string,
    ERRORS_DISPLAY_BACKGROUND: PropTypes.string,
    ERRORS_DISPLAY_SHADOW: PropTypes.string,
    ERROR_BORDER_BOTTOM: PropTypes.string,
    ERROR_EXPAND_ARROW: PropTypes.string,
    ERROR_FILE: PropTypes.string,
    ERROR_FILE_HOVER: PropTypes.string,
    ERROR_TYPE: PropTypes.string,
    ERROR_FULL_MESSAGE: PropTypes.string,
    ERROR_SHORT_MESSAGE: PropTypes.string,
  }),
};

export default ErrorComponent;
