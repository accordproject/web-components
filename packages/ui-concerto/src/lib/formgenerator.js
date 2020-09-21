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

import { ModelManager, Factory, Serializer } from '@accordproject/concerto-core';
import ReactFormVisitor from './reactformvisitor';

const entities = {
  amp: '&',
  apos: '\'',
  '#x27': '\'',
  '#x2F': '/',
  '#39': '\'',
  '#47': '/',
  lt: '<',
  gt: '>',
  nbsp: ' ',
  quot: '"'
};

function decodeHTMLEntities(text) {
  return text.replace(/&([^;]+);/gm, (match, entity) => entities[entity] || match);
}


/**
 * Used to generate a web from from a given composer model. Accepts string or file
 * and assets.
 *
 * @class
 * @memberof module:composer-form
 */
class FormGenerator {
  /**
   * Create the FormGenerator.
   *
   * @param {object} options - form options
   * @param {boolean} options.includeOptionalFields - if true,
   *  optional fields will be generated
   * @param {boolean} options.includeSampleData - if set, this
   *  defines the kind of default values for a generated form
   * 'sample' uses random well-typed values
   * 'empty' provides sensible empty values
   * @param {object} options.disabled - if true, all form fields will be disabled
   * @param {object} options.visitor - a class that extends HTMLFormVisitor
   *  that generates HTML, defaults to HTMLFormVisitor
   * @param {object} options.customClasses - a custom CSS classes that can be
   *  applied to generated HTML
   * @param {ModelManager} options.modelManager - An optional custom model manager
   */
  constructor(options) {
    this.modelManager = new ModelManager();
    // TODO Refactor this to an option to make this independent of Cicero
    this.modelManager.addModelFile(
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

    this.options = {
      includeSampleData: 'empty',
      updateExternalModels: false,
      ...options,
    };

    this.factory = new Factory(this.modelManager);
    this.serializer = new Serializer(this.factory, this.modelManager);
    this.loaded = false;
  }

  /**
   * Load models from text.
   * @param {array} texts  - the models
   * @returns {array} - A list of the types in the loaded model
   */
  async loadFromText(texts) {
    this.loaded = false;
    this.modelManager.clearModelFiles();
    try {
      texts.forEach(text => {
        const model = decodeHTMLEntities(text);
        this.modelManager.addModelFile(model, null, true);
      });
      if (this.options.updateExternalModels) {
        await this.modelManager.updateExternalModels();
      }
      this.modelManager.validateModelFiles();
    } catch (error) {
      this.modelManager.clearModelFiles();
      throw error;
    }
    this.loaded = true;
    return this.getTypes();
  }

  /**
   * @returns {array} A list of types stored in the model manager
   */
  getTypes() {
    if (this.loaded) {
      return this.modelManager
        .getModelFiles()
        .reduce(
          (classDeclarations, modelFile) => classDeclarations
            .concat(modelFile.getAllDeclarations()),
          []
        )
        .filter(
          classDeclaration => !classDeclaration.isEnum() && !classDeclaration.isAbstract()
        );
    }
    return [];
  }

  /**
   * Returns a validation error message if the provided JSON object is
   * not a valid instance of a model
   * @param {object} json - a JSON instance of a model
   * @returns {string} - the validation message, or null if the object is valid
   */
  validateInstance(json) {
    try {
      this.modelManager.getSerializer().fromJSON(json);
    } catch (error) {
      return error.message;
    }
    return null;
  }

  /**
   * Returns true if the provided JSON object is an instance a specified type
   * @param {object} model - a JSON instance of a model
   * @param {string} type - a fully qualified type name
   * @returns {boolean} - true if the provided JSON object is an instance a specified type
   */
  isInstanceOf(model, type) {
    if (!model || !type) {
      return false;
    }
    try {
      return this.modelManager.getSerializer().fromJSON(model).instanceOf(type);
    } catch (error) {
      return false;
    }
  }

  /**
   * @param {Object} type - The type from the model source to generate a JSON for
   * @return {object} the generated JSON instance
   */
  generateJSON(type) {
    if (this.loaded) {
      const classDeclaration = this.modelManager.getType(type);

      if (classDeclaration.isEnum()) {
        throw new Error(
          'Cannot generate JSON for an enumerated type directly, the type should be contained in Concept, Asset, Transaction or Event declaration'
        );
      }

      if (classDeclaration.isAbstract()) {
        throw new Error('Cannot generate JSON for abstract types');
      }

      if (!this.options.includeSampleData) {
        throw new Error(
          'Cannot generate form values when the component is configured not to generate sample data.'
        );
      }

      const ns = classDeclaration.getNamespace();
      const name = classDeclaration.getName();
      const factoryOptions = {
        includeOptionalFields: this.options.includeOptionalFields,
        generate: this.options.includeSampleData,
      };

      if (classDeclaration.isConcept()) {
        const concept = this.factory.newConcept(ns, name, factoryOptions);
        return this.serializer.toJSON(concept);
      }
      const resource = this.factory.newResource(
        ns,
        name,
        'resource1',
        factoryOptions
      );
      return this.serializer.toJSON(resource);
    }
    return null;
  }

  /**
   * @param {Object} type - The type from the model source to generate a form for
   * @param {Object} json - A JSON instance that provides values for the form fields
   * @return {object} the generated HTML string
   */
  generateHTML(type, json) {
    if (this.loaded) {
      const classDeclaration = this.modelManager.getType(type);

      if (!classDeclaration) {
        throw new Error(`${type} not found`);
      }

      if (classDeclaration.isEnum()) {
        throw new Error(
          'Cannot generate forms for an enumerated type directly, the type should be contained in Concept, Asset, Transaction or Event declaration'
        );
      }

      if (classDeclaration.isAbstract()) {
        throw new Error('Cannot generate forms for abstract types');
      }

      const params = {
        customClasses: {},
        timestamp: Date.now(),
        modelManager: this.modelManager,
        json,
        stack: [],
        ...this.options,
      };
      let { visitor } = params;
      if (!visitor) {
        visitor = new ReactFormVisitor();
        params.wrapHtmlForm = true;
      }

      const form = classDeclaration.accept(visitor, params);
      if (params.wrapHtmlForm) {
        return visitor.wrapHtmlForm(form, params);
      }

      return classDeclaration.accept(params.visitor, params);
    }
    return null;
  }
}

export default FormGenerator;
