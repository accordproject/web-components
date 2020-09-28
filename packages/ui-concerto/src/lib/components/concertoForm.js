/* eslint-disable react/require-default-props */
/* eslint-disable no-underscore-dangle */
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
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import set from 'lodash.set';
import { Form, Dimmer, Loader, Message } from 'semantic-ui-react';
import { ModelManager } from '@accordproject/concerto-core';

import ReactFormVisitor from '../reactformvisitor';
import FormGenerator from '../formgenerator';
import { decodeHTMLEntities } from '../utilities';
import './concertoForm.css';

/**
 * This React component generates a React object for a bound model.
 */
const ConcertoForm = (props) => {
  const [value, setValue] = useState(typeof props.json === 'string' ? JSON.parse(props.json) : JSON.parse(JSON.stringify(props.json)));
  const [loading, setLoading] = useState(true);
  const [modelManager, setModelManager] = useState(null);
  const { onValueChange } = props;

  const onFieldValueChange = useCallback((e, key) => {
    const fieldValue = e.type === 'checkbox' ? e.checked : e.value;
    const valueClone = set({ ...value }, key, fieldValue);
    setValue(valueClone);
    onValueChange(valueClone);
  }, [onValueChange, value]);

  const removeElement = useCallback((e, key, index) => {
    const array = get(value, key);
    array.splice(index, 1);
    onValueChange(value);
  }, [onValueChange, value]);

  const addElement = useCallback((e, key, elementValue) => {
    const array = get(value, key) || [];
    const valueClone = set(
      { ...value },
      [...key, array.length],
      elementValue
    );
    setValue(valueClone);
    onValueChange(valueClone);
  }, [onValueChange, value]);

  // Default values which can be overridden by parent components
  const options = React.useMemo(() => ({
    includeOptionalFields: true,
    includeSampleData: 'sample',
    disabled: props.readOnly,
    visitor: new ReactFormVisitor(),
    onFieldValueChange: (e, key) => {
      onFieldValueChange(e, key);
    },
    addElement: (e, key, field) => {
      addElement(e, key, field);
    },
    removeElement: (e, key, index) => {
      removeElement(e, key, index);
    },
    ...props.options,
  }), [addElement, onFieldValueChange, removeElement, props.options, props.readOnly]);

  const generator = React.useMemo(() => {
    if (modelManager) {
      return new FormGenerator(modelManager, options);
    }
    return null;
  }, [modelManager, options]);

  useEffect(() => {
    setLoading(true);
    const modelManager = new ModelManager();
    // TODO Refactor this to an option to make this independent of Cicero
    modelManager.addModelFile(
      `namespace org.accordproject.base
    abstract asset Asset {  }
    abstract participant Participant {  }
    abstract transaction Transaction identified by transactionId {
      o String transactionId
    }
    abstract event Event identified by eventId {
      o String eventId
    }`,
      'org.accordproject.base.cto',
      false,
      true
    );
    props.models.forEach((model, idx) => {
      const decodedModel = decodeHTMLEntities(model);
      modelManager.addModelFile(decodedModel, `model-${idx}`, true);
    });
    modelManager.updateExternalModels().then(() => {
      setModelManager(modelManager);
      setLoading(false);
    });
  }, [props.models]);

  useEffect(() => {
    if (props.type && generator) {
      if (!value) {
        const newJSON = generator.generateJSON(props.type);
        setValue(newJSON);
      }
    }
  }, [generator, props.type, value]);

  if (loading) {
    return (
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
    );
  }

  if (props.type && value) {
    try {
      const form = generator.generateHTML(props.type, value);
      return (
          <Form style={{ minHeight: '100px', ...props.style }}>
            {form}
          </Form>
      );
    } catch (err) {
      console.error(err);
      return (
          <Message warning>
            <Message.Header>
              An error occured while generating this form
            </Message.Header>
            <pre>{err.message}</pre>
          </Message>
      );
    }
  }
  return (
      <Message warning>
        <Message.Header>Invalid JSON instance provided</Message.Header>
        <p>
          The JSON value does not match the model type associated with this
          form.
        </p>
      </Message>
  );
};

ConcertoForm.propTypes = {
  models: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string,
  json: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.shape(),
  readOnly: PropTypes.bool,
  style: PropTypes.shape()
};

export default ConcertoForm;
