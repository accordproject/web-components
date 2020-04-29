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



const {
    ModelManager,
    ModelFile,
    ClassDeclaration,
    Field,
    RelationshipDeclaration,
    EnumDeclaration,
    EnumValueDeclaration,
} = require('@accordproject/concerto-core');
const util = require('util');
const Writer = require('@accordproject/concerto-core').Writer;

/**
 * Convert the contents of a ModelManager to TypeScript code.
 * All generated code is placed into the 'main' package. Set a
 * fileWriter property (instance of FileWriter) on the parameters
 * object to control where the generated code is written to disk.
 *
 * @class
 * @memberof module:composer-common
 */
class HTMLFormVisitor {

    /**
     * Visitor design pattern
     * @param {Object} thing - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visit(thing, parameters) {
        if(!parameters.fileWriter) {
            parameters.fileWriter = new Writer();
        }

        if (thing instanceof ModelManager) {
            return this.visitModelManager(thing, parameters);
        } else if (thing instanceof ModelFile) {
            return this.visitModelFile(thing, parameters);
        } else if (thing instanceof EnumDeclaration) {
            return this.visitEnumDeclaration(thing, parameters);
        } else if (thing instanceof ClassDeclaration) {
            return this.visitClassDeclaration(thing, parameters);
        } else if (thing instanceof Field) {
            return this.visitField(thing, parameters);
        } else if (thing instanceof RelationshipDeclaration) {
            return this.visitRelationship(thing, parameters);
        } else if (thing instanceof EnumValueDeclaration) {
            return this.visitEnumValueDeclaration(thing, parameters);
        } else {
            throw new Error('Unrecognised type: ' + typeof thing + ', value: ' + util.inspect(thing, { showHidden: true, depth: 2 }));
        }
    }

    /**
     * Visitor design pattern
     * @param {EnumDeclaration} enumDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visitEnumDeclaration(enumDeclaration, parameters) {
        const styles = parameters.customClasses;
        const id = enumDeclaration.getName().toLowerCase() + '-' + parameters.timestamp;
        const div = `<div  class='${styles.field}' id="form-${id}" >`;
        const label = `<label for="${enumDeclaration.getName()}">${enumDeclaration.getName()}:</label>`;
        parameters.fileWriter.writeLine(1, div);
        parameters.fileWriter.writeLine(2, label);
        parameters.fileWriter.writeLine(2, '<select>');
        enumDeclaration.getOwnProperties().forEach((property) => {
            property.accept(this,parameters);
        });
        parameters.fileWriter.writeLine(2, '</select>');
        parameters.fileWriter.writeLine(1, '</div>' );
        return null;
    }

    /**
     * Visitor design pattern
     * @param {ClassDeclaration} classDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visitClassDeclaration(classDeclaration, parameters) {
        if(!classDeclaration.isSystemType() &&
        !classDeclaration.isAbstract()) {
            const id = classDeclaration.getName().toLowerCase() + '-' + parameters.timestamp;
            const form = `<h4>${classDeclaration.getName()}</h4>
            <div name="${classDeclaration.getName()}" id="form-${id}">`;

            parameters.fileWriter.writeLine(0, form );

            classDeclaration.getOwnProperties().forEach((property) => {
                property.accept(this,parameters);
            });

            parameters.fileWriter.writeLine(0, '</div>' );
        }
        return null;
    }

    /**
     * Visitor design pattern
     * @param {Field} field - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visitField(field, parameters) {
        const styles = parameters.customClasses;
        const div = `<div class="${styles.field} ${parameters.disabled ? 'disabled': ''}">`;
        const label = `<label for="${field.getName()}">${field.getName()}:</label>`;
        parameters.fileWriter.writeLine(1, div);
        parameters.fileWriter.writeLine(2, label);

        let formField;
        if (field.isPrimitive()) {
            formField = `<input type="${this.toFieldType(field.getType())}" class="${styles.input}" id="${field.getName()}">`;
            parameters.fileWriter.writeLine(2, formField);
        } else {
            parameters.fileWriter.writeLine(2, '<fieldset class="form-group">');

            let type = parameters.modelManager.getType(field.getFullyQualifiedTypeName());
            type.accept(this, parameters);

            parameters.fileWriter.writeLine(2, '</fieldset>');
        }

        parameters.fileWriter.writeLine(1, '</div>' );

        return null;
    }

    /**
     * Visitor design pattern
     * @param {EnumValueDeclaration} enumValueDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visitEnumValueDeclaration(enumValueDeclaration, parameters) {
        parameters.fileWriter.writeLine(2, `<option value="${enumValueDeclaration.getName()}">${enumValueDeclaration.getName()}</option>`);
        return null;
    }

    /**
     * Visitor design pattern
     * @param {Relationship} relationship - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visitRelationship(relationship, parameters) {
        const styles = parameters.customClasses;
        const div = `<div class="${''}">`;
        const label = `<label for="${relationship.getName()}">${relationship.getName()}:</label>`;
        let formField = `<input type="${this.toFieldType(relationship.getType())}" class='${styles.input}' id="${relationship.getName()}">`;


        parameters.fileWriter.writeLine(1, div);
        parameters.fileWriter.writeLine(2, label);
        parameters.fileWriter.writeLine(2, formField);
        parameters.fileWriter.writeLine(1, '</div>' );

        return null;
    }

    /**
     * Converts a Composer type to a Form field type. Primitive types are converted
     * everything else is passed through unchanged.
     * @param {string} type  - the composer type
     * @return {string} the corresponding Form field type
     * @private
     */
    toFieldType(type) {
        switch(type) {
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
    }

    /**
     * @param {object} result - the result of the visitor
     * @param {object} parameters - the visitor parameters
     * @returns {object} - a HTML string
     */
    wrapHtmlForm(result, parameters) {
        let html = '<form>';
        const text = parameters.fileWriter.getBuffer();
        html += `${text}
        </form>`;
        return html;
    }
}

export default  HTMLFormVisitor;
