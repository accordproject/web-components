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

/**
 * Inserts correct spacing and capitalization to a camelCase label
 * @param {string} labelName - the label text to be transformed
 * @returns {string} - The label text formatted for rendering
 */
export const normalizeLabel = labelName => labelName
  .replace(/([a-z])([A-Z])/g, '$1 $2')
  .replace(/([A-Z])([a-z])/g, ' $1$2')
  .replace(/ +/g, ' ')
  .replace(/^./, str => str.toUpperCase())
  .trim();

/**
 * Converts a Concerto type to a Form field type. Primitive types are converted
 * everything else is passed through unchanged.
 * @param {string} type  - the Concerto type
 * @return {string} the corresponding Form field type
 * @private
 */
export const toFieldType = type => {
  switch (type) {
    case 'DateTime':
      return 'datetime-local';
    case 'Boolean':
      return 'boolean';
    case 'String':
      return 'text';
    case 'Double':
      return 'number';
    case 'Long':
      return 'number';
    case 'Integer':
      return 'number';
    default:
      return type;
  }
};

/**
 * Helper function to cast the string value of a change event to it's true type
 * @param {Event} e - the event associated with the field change
 * @return {Event} e - the modified event
 * @private
 */
export const parseValue = (value, type) => {
  switch (type) {
    case 'Boolean':
      return value === 'true';
    case 'Double':
      return parseFloat(value);
    case 'Long':
    case 'Integer':
      return parseInt(value, 10);
    default:
      return value;
  }
};

/**
 * Converts to JSON safe format.
 *
 * @param {Field} field - the field declaration of the object
 * @return {Object} the text JSON safe representation
 */
export const convertToJSON = field => {
  switch (field.getType()) {
    case 'DateTime': {
      return new Date().toISOString();
    }
    case 'Integer':
      return 0;
    case 'Long':
    case 'Double':
      return 0.0;
    case 'Boolean':
      return false;
    default:
      return '';
  }
};

/**
 * Find a concrete type that extends the provided type. If the supplied type argument is
 * not abstract then it will be returned.
 * TODO: work out whether this has to be a leaf node or whether the closest type can be used
 * It depends really since the closest type will satisfy the model but whether it satisfies
 * any transaction code which attempts to use the generated resource is another matter.
 * @param {ClassDeclaration} declaration the class declaration.
 * @return {ClassDeclaration} the closest extending concrete class definition.
 * @throws {Error} if no concrete subclasses exist.
 */
export const findConcreteSubclass = declaration => {
  if (!declaration.isAbstract()) {
    return declaration;
  }

  const concreteSubclasses = declaration
    .getAssignableClassDeclarations()
    .filter(subclass => !subclass.isAbstract())
    .filter(subclass => !subclass.isSystemType());

  if (concreteSubclasses.length === 0) {
    throw new Error('No concrete subclasses found');
  }

  return concreteSubclasses[0];
};

/**
 * Helper function to determine whether to hide a property from the rendering
 * @param {Property} property - the object being visited, either a field or a resource
 * @param {Object} parameters  - the parameter
 * @return {boolean} - true if the property should be hidden, false otherwise
 * @private
 */
export const hideProperty = (property, parameters) => {
  if (
    parameters.hiddenFields
    && parameters.hiddenFields.find(f => {
      if (typeof f === 'function') {
        return f(property);
      }
      if (typeof f === 'string') {
        return f === property.getFullyQualifiedName();
      }
      return false;
    })
  ) {
    parameters.stack.pop();
    return true;
  }
  return false;
};

/**
 * Helper function to generate default JSON values
 * @param {Property} field - the object being visited, either a field or a resource
 * @param {Object} parameters  - the parameter
 * @return {Object} - A default JSON serialization of the field
 * @private
 */
export const getDefaultValue = (field, parameters) => {
  if (field.isPrimitive()) {
    return convertToJSON(field);
  }
  let type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
  type = findConcreteSubclass(type);
  if (type.isConcept()) {
    const concept = parameters.modelManager
      .getFactory()
      .newConcept(type.getNamespace(), type.getName(), {
        includeOptionalFields: true,
        generate: 'sample',
      });
    return parameters.modelManager.getSerializer().toJSON(concept);
  }
  const resource = parameters.modelManager
    .getFactory()
    .newResource(type.getNamespace(), type.getName(), 'resource1', {
      includeOptionalFields: true,
      generate: 'sample',
    });
  return parameters.modelManager.getSerializer().toJSON(resource);
};
