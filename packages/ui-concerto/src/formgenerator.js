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

import { Factory, Serializer } from '@accordproject/concerto-core';
import ReactFormVisitor from './reactformvisitor';

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
   * @param {object} options.textOnly - if true, all form fields will appear as labels
   * @param {object} options.visitor - a class that extends HTMLFormVisitor
   *  that generates HTML, defaults to HTMLFormVisitor
   * @param {object} options.customClasses - a custom CSS classes that can be
   *  applied to generated HTML
   * @param {ModelManager} options.modelManager - An optional custom model manager
   * @param {object} options.relationshipProvider - An optional relationship provider,
   * used to get relationship IDs.
   */
  constructor(modelManager, options) {
    this.options = {
      includeSampleData: 'empty',
      updateExternalModels: false,
      ...options,
    };

    this.modelManager = modelManager;
    this.factory = new Factory(this.modelManager);
    this.serializer = new Serializer(this.factory, this.modelManager);
  }

  /**
   * @returns {array} A list of types stored in the model manager
   */
  getTypes() {
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

    const resource = this.factory.newResource(
      ns,
      name,
      classDeclaration.isIdentified() ? 'resource1' : null,
      factoryOptions
    );
    return this.serializer.toJSON(resource);
  }

  /**
   * @param {Object} type - The type from the model source to generate a form for
   * @param {Object} json - A JSON instance that provides values for the form fields
   * @return {object} the generated HTML string
   */
  generateHTML(type, json) {
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
    }

    return classDeclaration.accept(visitor, params);
  }
}

export default FormGenerator;
