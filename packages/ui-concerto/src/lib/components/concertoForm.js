/* eslint-disable no-use-before-define */
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
  let initialValue;
  if (typeof props.json === 'string') {
    try {
      initialValue = JSON.parse(props.json);
    } catch {
      // Do nothing
    }
  } else if (typeof props.json === 'object') {
    initialValue = { ...props.json };
  }
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

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

  // make sure we use the same generator instance on re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const generator = React.useMemo(() => new FormGenerator(options), []);

  const { onModelChange, onValueChange } = props;

  const usePrevious = val => {
    const ref = React.useRef();
    useEffect(() => {
      ref.current = val;
    }, [val]);
    return ref.current;
  };

  const prevModels = usePrevious(props.models);
  const [models, updateModels] = useState({});
  useEffect(() => {
    if (!isEqual(prevModels, props.models)) {
      updateModels(props.models);
    }
  }, [props.models, prevModels]);

  useEffect(() => {
    _loadAsyncData().then(modelProps => {
      onModelChange(modelProps);
    });
  }, [_loadAsyncData, models, onModelChange]);

  const onFieldValueChange = useCallback((e, key) => {
    const fieldValue = e.type === 'checkbox' ? e.checked : e.value;
    const valueClone = set({ ...value }, key, fieldValue);
    setValue(valueClone);
    onValueChange(valueClone);
  }, [onValueChange, value]);

  const _loadAsyncData = useCallback(async () => {
    setLoading(true);
    const modelProps = await loadModelFiles(props.models, 'text');
    setLoading(false);
    return modelProps;
  }, [loadModelFiles, props.models]);

  const loadModelFiles = useCallback(async (files) => {
    let types;
    let json;
    let fqn = props.type;
    try {
      types = await generator.loadFromText(files);
      // The model file was invalid
    } catch (error) {
      console.error(error.message);
      // Set default values to avoid trying to render a bad model
      // Don't change the JSON, it might be valid once the model file is fixed
      return { types: [] };
    }

    if (types.length === 0) {
      return { types: [] };
    }

    try {
      if (
        !types.map(t => t.getFullyQualifiedName()).includes(props.type)
      ) {
        fqn = types[0].getFullyQualifiedName();
        json = generateJSON(fqn);
        return { types, json };
      }
      json = generateJSON(props.type);
    } catch (err) {
      console.error(err);
    }
    return { types, json };
  }, [generateJSON, generator, props.type]);

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

  const isInstanceOf = useCallback(
    (model, type) => generator.isInstanceOf(model, type), [generator]
  );

  const generateJSON = useCallback((type) => {
    try {
      // The type changed so we have to generate a new instance
      if (props.json && !isInstanceOf(props.json, type)) {
        return generator.generateJSON(type);
      }
      // The instance is null so we have to create a new instance
      if (!props.json) {
        return generator.generateJSON(type);
      }
    } catch (err) {
      console.error(err);
    }
    // Otherwise, just use what we already have
    return props.json;
  }, [generator, isInstanceOf, props.json]);

  if (loading) {
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
            {generator.generateHTML(props.type, value)}
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
  onModelChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.shape(),
  readOnly: PropTypes.bool,
  style: PropTypes.shape()
};

export default ConcertoForm;
