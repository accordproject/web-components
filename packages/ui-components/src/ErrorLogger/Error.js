/* React */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

/* Actions */
import * as ACT from './actions';

/* Styling */
import * as SC from './styles';

const ErrorComponent = (props) => {
  const { error, errorNav } = props;
  const [specErrorVisible, setspecErrorVisible] = useState(false);

  const handleClickSpecError = () => {
    setspecErrorVisible(!specErrorVisible);
  };

  const typeProps = {
    onClick: handleClickSpecError,
    className: 'ui-components__error-type'
  };

  const shortMessageProps = {
    onClick: handleClickSpecError,
  };

  const errorArrowProps = {
    expanded: specErrorVisible,
    onClick: handleClickSpecError,
    className: specErrorVisible
      ? 'ui-components__error-arrow-expanded'
      : 'ui-components__error-arrow-collapsed'
  };

  return (
    <SC.ErrorComponent className="ui-components__error-component">

      <SC.ArrowDiv {...errorArrowProps} />
      <SC.ErrorFile onClick={() => errorNav(error)} className="ui-components__error-file">
        {ACT.typeSwitchCase(error || {})}
      </SC.ErrorFile>

      <SC.ErrorType {...typeProps} >
        {ACT.overalltypeSwitchCase(error).name || 'Unknown Error'}:
      </SC.ErrorType>

      <SC.ErrorShortMessage {...shortMessageProps} className="ui-components__error-short-message" >
        {ACT.truncateMessage(ACT.overalltypeSwitchCase(error).shortMessage || 'Unknown Error')}
      </SC.ErrorShortMessage>

      {specErrorVisible
        && <SC.ErrorFullMessage className="ui-components__error-full-message" >
            {ACT.overalltypeSwitchCase(error).message || 'Unknown Error'}
          </SC.ErrorFullMessage>}
    </SC.ErrorComponent>
  );
};

ErrorComponent.propTypes = {
  error: PropTypes.object.isRequired,
  errorNav: PropTypes.func,
};

export default ErrorComponent;
