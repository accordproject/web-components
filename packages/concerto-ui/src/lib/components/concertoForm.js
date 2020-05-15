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
<<<<<<< HEAD:packages/concerto-ui/src/lib/components/concertoForm.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import set from 'lodash.set';
import { Form, Dimmer, Loader, Message } from 'semantic-ui-react';
import isEqual from 'lodash.isequal';

import ReactFormVisitor from '../reactformvisitor';
import FormGenerator from '../formgenerator';
=======
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import set from 'lodash.set';
import {Form, Dimmer, Loader, Message} from 'semantic-ui-react';
import isEqual from 'lodash.isequal';

import ReactFormVisitor from './reactformvisitor';
import FormGenerator from './formgenerator';
>>>>>>> 53e80f454edcd45e0764755d853bc5ad3f40da6b:packages/concerto-ui/src/lib/concertoForm.js
import './concertoForm.css';

/**
 * This React component generates a React object for a bound model.
 */
class ConcertoForm extends Component {
  constructor(props) {
    super(props);

    this.onFieldValueChange = this.onFieldValueChange.bind(this);

    this.state = {
      // A mutable copy of this.props.json
      // This is needed so that we can use the jsonpath library to change object properties by key
      // using the jsonpath module, without modifying the props object
      value: null,
      loading: true,
    };

    // Default values which can be overridden by parent components
    this.options = {
      includeOptionalFields: true,
      includeSampleData: 'sample',
      disabled: props.readOnly,
      visitor: new ReactFormVisitor(),
      onFieldValueChange: (e, key) => {
        this.onFieldValueChange(e, key);
      },
      addElement: (e, key, field) => {
        this.addElement(e, key, field);
      },
      removeElement: (e, key, index) => {
        this.removeElement(e, key, index);
      },
      ...props.options,
    };
    this.generator = new FormGenerator(this.options);
  }

  componentDidMount() {
    this._loadAsyncData().then(modelProps => {
      this.props.onModelChange(modelProps);
    });
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.models, prevProps.models)) {
      this._loadAsyncData().then(modelProps => {
        this.props.onModelChange(modelProps);
      });
    }
  }

  static getDerivedStateFromProps(props) {
    let shadowValue;
    if (typeof props.json === 'string') {
      try {
        shadowValue = JSON.parse(props.json);
<<<<<<< HEAD:packages/concerto-ui/src/lib/components/concertoForm.js
      } catch {
        // Do nothing
      }
    } else if (typeof props.json === 'object') {
      shadowValue = { ...props.json };
    }
    return { value: shadowValue };
=======
      } catch {}
    } else if (typeof props.json === 'object') {
      shadowValue = {...props.json};
    }
    return {value: shadowValue};
>>>>>>> 53e80f454edcd45e0764755d853bc5ad3f40da6b:packages/concerto-ui/src/lib/concertoForm.js
  }

  onFieldValueChange(e, key) {
    const value = e.type === 'checkbox' ? e.checked : e.value || e.target.value;
    // eslint-disable-next-line react/no-access-state-in-setstate
<<<<<<< HEAD:packages/concerto-ui/src/lib/components/concertoForm.js
    const valueClone = set({ ...this.state.value }, key, value);
    this.setState({ value: valueClone });
=======
    const valueClone = set({...this.state.value}, key, value);
    this.setState({value: valueClone});
>>>>>>> 53e80f454edcd45e0764755d853bc5ad3f40da6b:packages/concerto-ui/src/lib/concertoForm.js
    this.props.onValueChange(valueClone);
  }

  async _loadAsyncData() {
<<<<<<< HEAD:packages/concerto-ui/src/lib/components/concertoForm.js
    this.setState({ loading: true });
    const modelProps = await this.loadModelFiles(this.props.models, 'text');
    this.setState({ loading: false });
    return modelProps;
  }

  async loadModelFiles(files) {
=======
    this.setState({loading: true});
    const modelProps = await this.loadModelFiles(this.props.models, 'text');
    this.setState({loading: false});
    return modelProps;
  }

  async loadModelFiles(files, type) {
>>>>>>> 53e80f454edcd45e0764755d853bc5ad3f40da6b:packages/concerto-ui/src/lib/concertoForm.js
    let types;
    let json;
    let fqn = this.props.type;
    try {
      types = await this.generator.loadFromText(files);
      // The model file was invalid
    } catch (error) {
      console.error(error.message);
      // Set default values to avoid trying to render a bad model
      // Don't change the JSON, it might be valid once the model file is fixed
      return {types: []};
    }

    if (types.length === 0) {
<<<<<<< HEAD:packages/concerto-ui/src/lib/components/concertoForm.js
      return { types: [] };
=======
      return {types: []};
>>>>>>> 53e80f454edcd45e0764755d853bc5ad3f40da6b:packages/concerto-ui/src/lib/concertoForm.js
    }

    try {
      if (
        !types.map(t => t.getFullyQualifiedName()).includes(this.props.type)
      ) {
        fqn = types[0].getFullyQualifiedName();
        json = this.generateJSON(fqn);
        return {types, json};
      }
      json = this.generateJSON(this.props.type);
    } catch (err) {
      console.log(err);
    }
<<<<<<< HEAD:packages/concerto-ui/src/lib/components/concertoForm.js
    return { types, json };
=======
    return {types, json};
>>>>>>> 53e80f454edcd45e0764755d853bc5ad3f40da6b:packages/concerto-ui/src/lib/concertoForm.js
  }

  removeElement(e, key, index) {
    const array = get(this.state.value, key);
    array.splice(index, 1);
    this.props.onValueChange(this.state.value);
  }

  addElement(e, key, value) {
    const array = get(this.state.value, key) || [];
    const valueClone = set(
<<<<<<< HEAD:packages/concerto-ui/src/lib/components/concertoForm.js
      { ...this.state.value },
      [...key, array.length],
      value
    );
    this.setState({ value: valueClone });
=======
      {...this.state.value},
      [...key, array.length],
      value
    );
    this.setState({value: valueClone});
>>>>>>> 53e80f454edcd45e0764755d853bc5ad3f40da6b:packages/concerto-ui/src/lib/concertoForm.js
    this.props.onValueChange(valueClone);
  }

  isInstanceOf(model, type) {
    return this.generator.isInstanceOf(model, type);
  }

  generateJSON(type) {
    try {
      // The type changed so we have to generate a new instance
      if (this.props.json && !this.isInstanceOf(this.props.json, type)) {
        return this.generator.generateJSON(type);
        // The instance is null so we have to create a new instance
      }
      if (!this.props.json) {
        return this.generator.generateJSON(type);
      }
    } catch (err) {
      console.log(err);
    }
    // Otherwise, just use what we already have
    return this.props.json;
  }

  render() {
    if (this.state.loading) {
      return (
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      );
    }

    if (this.props.type && this.state.value) {
      try {
        return (
<<<<<<< HEAD:packages/concerto-ui/src/lib/components/concertoForm.js
          <Form style={{ minHeight: '100px', ...this.props.style }}>
=======
          <Form style={{minHeight: '100px', ...this.props.style}}>
>>>>>>> 53e80f454edcd45e0764755d853bc5ad3f40da6b:packages/concerto-ui/src/lib/concertoForm.js
            {this.generator.generateHTML(this.props.type, this.state.value)}
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
  }
}

ConcertoForm.propTypes = {
  models: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.string,
  json: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  onModelChange: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
  options: PropTypes.shape(),
  readOnly: PropTypes.bool,
  style: PropTypes.shape(),
};

export default ConcertoForm;
