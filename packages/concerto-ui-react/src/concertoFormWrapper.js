/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import ErrorBoundary from './errorBoundary';
import ConcertoForm from './concertoForm';
import PropTypes from 'prop-types';

/**
 * This React component generates a React object for a bound model.
 */
const ConcertoFormWrapper = (props) => <ErrorBoundary>
    <ConcertoForm key={props.type} {...props} />
  </ErrorBoundary>;

ConcertoFormWrapper.propTypes = {
  models: PropTypes.arrayOf(PropTypes.string).isRequired,
  type: PropTypes.string,
  json: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  onModelChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  readOnly: PropTypes.bool,
};

export default ConcertoFormWrapper;
