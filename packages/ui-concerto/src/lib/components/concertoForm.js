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
import isEqual from 'lodash.isequal';

import ReactFormVisitor from '../reactformvisitor';
import FormGenerator from '../formgenerator';
import './concertoForm.css';

/**
 * This React component generates a React object for a bound model.
 */
const ConcertoForm = (props) => {
  const [value, setValue] = useState(typeof props.json === 'string' ? JSON.parse(props.json) : JSON.parse(JSON.stringify(props.json)));
  console.log('value at beginning - ', value);
  const [modelTypes, setModelTypes] = useState();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const { onValueChange } = props;

  const onFieldValueChange = useCallback((e, key) => {
    const fieldValue = e.type === 'checkbox' ? e.checked : e.value;
    console.log('value before clone - ', value);
    const valueClone = set({ ...value }, key, fieldValue);
    console.log('valueClone - ', valueClone);
    setValue(valueClone);
    // onValueChange(valueClone);
  }, [value]);

  const removeElement = useCallback((e, key, index) => {
    const array = get(value, key);
    array.splice(index, 1);
    // onValueChange(value);
  }, [onValueChange, value]);

  const addElement = useCallback((e, key, elementValue) => {
    const array = get(value, key) || [];
    const valueClone = set(
      { ...value },
      [...key, array.length],
      elementValue
    );
    // setValue(valueClone);
    // onValueChange(valueClone);
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

  const generator = React.useMemo(() => new FormGenerator(options), [options]);

  const loadModelFiles = useCallback(async (files) => {
    let types;
    try {
      types = await generator.loadFromText(files);
      // The model file was invalid
    } catch (error) {
      console.error(error.message);
      // Set default values to avoid trying to render a bad model
      // Don't change the JSON, it might be valid once the model file is fixed
      return [];
    }

    if (types.length === 0) {
      return [];
    }

    try {
      if (
        !types.map(t => t.getFullyQualifiedName()).includes(props.type)
      ) {
        return types;
      }
    } catch (err) {
      console.error(err);
    }
    return types;
  }, [generator, props.type]);

  useEffect(() => {
    setLoading(true);
    loadModelFiles(props.models, 'text').then(modelTypes => {
      console.log('modelTypes -- ', modelTypes);
      setModelTypes(modelTypes);
      setLoading(false);
    });
  }, [loadModelFiles, props.models]);

  const isInstanceOf = useCallback(
    (model, type) => generator.isInstanceOf(model, type), [generator]
  );

  useEffect(() => {
    if (props.type && modelTypes) {
      const isValid = modelTypes
        .filter((model) => model.getFullyQualifiedName() === props.type).length;
      if (!isValid || !value || !isInstanceOf(value, props.type)) {
        console.log('model value', value);
        console.log('type', props.type);
        console.log('modelTypes', modelTypes);
        console.log('isValid', isValid);
        console.log('generating new json', isInstanceOf(value, props.type));
        const newJSON = generator.generateJSON(props.type);
        console.log('newJSON - ', newJSON);
        setValue(newJSON);
        setForm(generator.generateHTML(props.type, newJSON));
      }
    }
  }, [generator, isInstanceOf, modelTypes, props.type, value]);

  // useEffect(() => {
  //   console.log('setting the form...');
  //   setForm(generator.generateHTML(props.type, value));
  // }, [props.type, modelTypes]);

  if (loading || !form) {
    return (
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
    );
  }

  if (props.type && value) {
    try {
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
