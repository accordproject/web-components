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
import { Card } from 'semantic-ui-react';

import TextareaAutosize from 'react-textarea-autosize';
import PropTypes from 'prop-types';

import './styles.module.css';

/**
 * A Markdown editor that can convert the markdown contents
 * for a Slate DOM for WYSIWYG preview.
 *
 * @param {*} props the props for the component. See the declared PropTypes
 * for details.
 */
export function TextEditor({onChange, markdown, readOnly}) {

  const onChangeHandler = (evt) => {
    onChange(evt.target.value);
  };

  /**
   * Render the component, based on showSlate
   */
  const card = <Card className="ap-text-editor" fluid>
    <Card.Content>
    <TextareaAutosize
      className={'textarea'}
      width={'100%'}
      placeholder={markdown}
      value={markdown}
      onChange={onChangeHandler}
      readOnly={readOnly}
    />
    </Card.Content>
  </Card>;

  return (
    <div>
      <Card.Group>
        {card}
      </Card.Group>
    </div>
  );
}

/**
 * The property types for this component
 */
TextEditor.propTypes = {
  /**
   * Initial contents for the editor (markdown text)
   */
  markdown: PropTypes.string,

  /**
   * A callback that receives the markdown text
   */
  onChange: PropTypes.func.isRequired,

  /**
   * Boolean to make editor read-only (uneditable) or not (editable)
   */
  readOnly: PropTypes.bool,
};

/**
 * The default property values for this component
 */
TextEditor.defaultProps = {
  markdown: 'Welcome! Edit this text to begin.',
  readOnly: false,
};