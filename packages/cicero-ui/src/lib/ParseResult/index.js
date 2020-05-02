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
import PropTypes from 'prop-types';

import { Icon, Message } from 'semantic-ui-react';

/**
 * Displays the results of parsing
 * @param {*} props
 */
function ParseResult(props) {
  let message = null;

  if (props.parseResult) {
    if (props.parseResult.toString().startsWith('Error')) {
      message = <Message negative>
    <Icon name='warning sign'/>
    {props.parseResult.toString()}
  </Message>;
    } else {
      message = <Message positive>
    <Icon name='check square'/>
    {JSON.stringify(props.parseResult, null, 2)}
  </Message>;
    }
  }

  if (!props.parseResult) {
    message = <Message positive>
    <Icon name='circle notched' loading />
    Waiting...
  </Message>;
  }

  return (
    <div>
    { message }
    </div>
  );
}

/**
 * The property types for this component
 */
ParseResult.propTypes = {
  parseResult: PropTypes.object,
};

export default ParseResult;
