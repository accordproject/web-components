import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { text, boolean, object } from '@storybook/addon-knobs';
import { ConcertoForm, ModelBuilderVisitor } from '@accordproject/ui-concerto';

export default {
  title: 'Concerto Form',
  component: ConcertoForm,
  parameters: {
    componentSubtitle: 'Create dynamic forms from Concerto models',
    knobs: {
      escapeHTML: false,
    },
  }
};

export const Demo = () => {
  const readOnly = boolean('Read-only', false);
  const type = text('Type', 'test.Person');
  const options = object('Options', {
    includeOptionalFields: true,
    includeSampleData: 'sample',
    updateExternalModels: true,
    hiddenFields: [
      'org.accordproject.base.Transaction.transactionId',
      'org.accordproject.cicero.contract.AccordContract.contractId',
      'org.accordproject.cicero.contract.AccordClause.clauseId',
      'org.accordproject.cicero.contract.AccordContractState.stateId',
    ],
  });
  const model = text('Model', `namespace test 

  enum Country {
    o USA
    o UK
    o France
    o Sweden
  }

  participant Person identified by name {
    o String name
    o Address address
    --> Person[] children optional
  }

  concept Address {
    o String street
    o String city
    @FormEditor( "hide", true)
    o String zipCode
    o Country country
  }
  `);

  const handleValueChange = (json) => {
    return action("value changed")(json);
  };

  options.relationshipProvider = {
    getOptions: (field) => {
      if (field.getFullyQualifiedTypeName() === 'test.Person') {
        return [{
          key: '001',
          value: 'test.Person#Marissa',
          text: 'Marissa Mayer'
        },
        {
          key: '002',
          value: 'test.Person#Ada',
          text: 'Ada Lovelace'
        },
        {
          key: '003',
          value: 'test.Person#Grace',
          text: 'Grace Hopper'
        },
        {
          key: '004',
          value: 'test.Person#Lynn',
          text: 'Lynn Conway'
        },

        {
          key: '005',
          value: 'test.Person#Rosalind',
          text: 'Rosalind Picard'
        }
        ]
      }
      else {
        return null;
      }
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <ConcertoForm
        readOnly={readOnly}
        models={[model]}
        options={options}
        type={type}
        json={null}
        onValueChange={handleValueChange}
      />
    </div>
  )
};


export const ModelBuilder = () => {
  const readOnly = boolean('Read-only', false);
  const type = text('Type', 'concerto.metamodel.ModelFile');
  const options = object('Options', {
    includeOptionalFields: false,
    includeSampleData: 'sample',
    updateExternalModels: false,
    hiddenFields: [
      'concerto.metamodel.Decorator'
    ],
    visitor: new ModelBuilderVisitor()
  });
  const model = text('Model', `     /*
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
 
 namespace concerto.metamodel
 
 /**
  * The metadmodel for Concerto files
  */
 
 abstract concept DecoratorLiteral {
 }
 
 concept DecoratorString extends DecoratorLiteral {
   o String value  
 }
 
 concept DecoratorNumber extends DecoratorLiteral {
   o Double value
 }
 
 concept DecoratorBoolean extends DecoratorLiteral {
   o Boolean value
 }
 
 concept TypeIdentifier {
   o String fullyQualifiedName
 }
 
 concept DecoratorIdentifier extends DecoratorLiteral {
   o TypeIdentifier identifier
   o Boolean isArray default=false
 }

 concept Decorator {
   o String name
   o DecoratorLiteral[] arguments optional
 }
 
 abstract concept ClassDeclaration {
   @FormEditor("hide", true)
   o Decorator[] decorators optional
   o Boolean isAbstract default=false
   @FormEditor("title", "name")
   o String identifier
   o String identifiedByField optional
   @FormEditor("title", "parentType")
   o TypeIdentifier superType optional
   o BooleanFieldDeclaration[] fields
 }
 
 concept AssetDeclaration extends ClassDeclaration {
 }
 
 concept ParticipantDeclaration extends ClassDeclaration {
 }
 
 concept TransactionDeclaration extends ClassDeclaration {
 }
 
 concept EventDeclaration extends ClassDeclaration {
 }
 
 concept ConceptDeclaration extends ClassDeclaration {
 }
 
 // TODO - enums do not support abstract or super types
 concept EnumDeclaration extends ClassDeclaration {
 }
 
 concept StringDefault {
   o String value
 }
 
 concept BooleanDefault {
   o Boolean value
 }
 
 concept IntegerDefault {
   o Integer value
 }
 
 concept RealDefault {
   o Double value
 }
 
 abstract concept FieldDeclaration {
   o String name
   o Boolean isArray optional
   o Boolean isOptional optional 
   @FormEditor("hide", true)
   o Decorator[] decorators optional
 }
 
 concept ObjectFieldDeclaration extends FieldDeclaration {
   @FormEditor("hide", true)
   o StringDefault defaultValue optional
   o TypeIdentifier type
 }
 
 concept BooleanFieldDeclaration extends FieldDeclaration {
  @FormEditor("hide", true)
  o BooleanDefault defaultValue optional
 }
 
 concept DateTimeFieldDeclaration extends FieldDeclaration {
 }
 
 concept StringFieldDeclaration extends FieldDeclaration {
   @FormEditor("hide", true)
   o StringDefault defaultValue optional
   @FormEditor("hide", true)
   o StringRegexValidator validator optional
 }
 
 concept StringRegexValidator {
   o String regex
 }
 
 concept RealDomainValidator {
   o Double lower optional
   o Double upper optional
 }
 
 concept IntegerDomainValidator {
   o Integer lower optional
   o Integer upper optional
 }
 
 concept RealFieldDeclaration extends FieldDeclaration {
   o RealDefault defaultValue optional
   o RealDomainValidator validator optional
 }
 
 concept IntegerFieldDeclaration extends FieldDeclaration {
   @FormEditor("hide", true)
   o IntegerDefault defaultValue optional
   @FormEditor("hide", true)
   o IntegerDomainValidator validator optional
 }
 
 concept RelationshipDeclaration extends FieldDeclaration {
   o TypeIdentifier type
 }
 
 abstract concept Import {
   o String uri optional
 }
 
 concept NamespaceImport extends Import {
   o String namespace
 }
 
 concept TypeImport extends Import {
   o TypeIdentifier identifier
 }
 
 concept ModelFile {
   @FormEditor("hide", true)
   o String namespace
   @FormEditor("hide", true)
   o Import[] imports optional
   @FormEditor("title", "class")
   o ClassDeclaration[] declarations optional
 }
     `);

  const handleValueChange = (json) => {
    return action("value changed")(json);
  };

  return (
    <div style={{ padding: '10px' }}>
      <ConcertoForm
        readOnly={readOnly}
        models={[model]}
        options={options}
        type={type}
        json={null}
        onValueChange={handleValueChange}
      />
    </div>
  )
};
