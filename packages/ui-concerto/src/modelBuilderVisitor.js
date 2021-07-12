/* eslint-disable class-methods-use-this */
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
import ReactFormVisitor from './reactformvisitor';

/**
 * Convert the contents of a ModelManager to React compnents.
 * @class
 */
class ModelBuilderVisitor extends ReactFormVisitor {
  /**
   * Visitor design pattern
   * @param {ClassDeclaration} classDeclaration - the object being visited
   * @param {Object} parameters  - the parameter
   * @return {Object} the result of visiting or null
   * @private
   */
  visitClassDeclaration(classDeclaration, parameters) {
    if (classDeclaration.getFullyQualifiedName() === 'concerto.metamodel.AssetDeclaration') {
      return this.visitAssetDeclaration(classDeclaration, parameters);
    }

    if (classDeclaration.getFullyQualifiedName() === 'concerto.metamodel.TypeIdentifier') {
      parameters.skipLabel = true;
      const component = super.visitClassDeclaration(classDeclaration, parameters);
      parameters.skipLabel = false;
      return component;
    }

    if (classDeclaration.getFullyQualifiedName() === 'concerto.metamodel.BooleanFieldDeclaration') {
      return this.visitFieldDeclaration(classDeclaration, parameters);
    }

    return super.visitClassDeclaration(classDeclaration, parameters);
  }

  visitAssetDeclaration(declaration, parameters) {
    const props = declaration.getProperties();
    const identifier = props.find(({ name }) => name === 'identifier');
    const superType = props.find(({ name }) => name === 'superType');
    const fields = props.find(({ name }) => name === 'fields');

    return <div>
      <div>{identifier.accept(this, parameters)}</div>
      <div>{superType.accept(this, parameters)}</div>
      <div>{fields.accept(this, parameters)}</div>
    </div>;
  }

  visitFieldDeclaration(declaration, parameters) {
    const props = declaration.getProperties();

    const name = props.find(({ name }) => name === 'name');
    const isOptional = props.find(({ name }) => name === 'isOptional');
    const isArray = props.find(({ name }) => name === 'isArray');

    const component = (
      <div className='fieldDeclaration' key={declaration.getName().toLowerCase()}>
        <div>{name.accept(this, parameters)}</div>
        <div>{isArray.accept(this, parameters)}</div>
        <div>{isOptional.accept(this, parameters)}</div>
      </div>
    );
    return component;
  }
}
export default ModelBuilderVisitor;
