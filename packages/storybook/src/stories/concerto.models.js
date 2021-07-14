export const TestModel = `namespace test 

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
`;

export const ConcertoMetamodel = `/*
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
   @FormEditor("selectOptions", "types")
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
 
 @FormEditor("defaultSubclass","concerto.metamodel.ConceptDeclaration")
 abstract concept ClassDeclaration {
   @FormEditor("hide", true)
   o Decorator[] decorators optional
   o Boolean isAbstract default=false
   // TODO use regex /^(?!null|true|false)(\\p{Lu}|\\p{Ll}|\\p{Lt}|\\p{Lm}|\\p{Lo}|\\p{Nl}|\\$|_|\\\\u[0-9A-Fa-f]{4})(?:\\p{Lu}|\\p{Ll}|\\p{Lt}|\\p{Lm}|\\p{Lo}|\\p{Nl}|\\$|_|\\\\u[0-9A-Fa-f]{4}|\\p{Mn}|\\p{Mc}|\\p{Nd}|\\p{Pc}|\\u200C|\\u200D)*/u
   @FormEditor("title", "name")
   o String identifier default="className" regex=/^(?!null|true|false)(\\w|\\d|\\$|_|\\\\u[0-9A-Fa-f]{4})(?:\\w|\\d|\\$|_|\\\\u[0-9A-Fa-f]{4}|\\S|\\u200C|\\u200D)*$/
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
 
 // TODO this decorator doesn't work because Concerto's version of 'findConcreteSubclass' doesn't support it yet. 
 @FormEditor("defaultSubclass","concerto.metamodel.StringFieldDeclaration")
 abstract concept FieldDeclaration {
   // TODO Allow regex modifiers e.g. //ui
   // regex /^(?!null|true|false)(\\p{Lu}|\\p{Ll}|\\p{Lt}|\\pLm}|\\p{Lo}|\\p{Nl}|\\$|_|\\\\u[0-9A-Fa-f]{4})(?:\\p{Lu}|\\p{Ll}|\\p{Lt}|\\p{Lm}|\\p{Lo}|\\p{Nl}|\\$|_|\\\\u[0-9A-Fa-f]{4}|\\p{Mn}|\\p{Mc}|\\p{Nd}|\\p{Pc}|\\u200C|\\u200D)*/u
   // This regex is an approximation of what the parser accepts without using unicode character classes
   o String name default="fieldName" regex=/^(?!null|true|false)(\\w|\\d|\\$|_|\\\\u[0-9A-Fa-f]{4})(?:\\w|\\d|\\$|_|\\\\u[0-9A-Fa-f]{4}|\\S|\\u200C|\\u200D)*$/
   @FormEditor("title", "isArray?")
   o Boolean isArray optional
   @FormEditor("title", "isOptional?")
   o Boolean isOptional optional 
   @FormEditor("hide", true)
   o Decorator[] decorators optional
 }
 
 concept ObjectFieldDeclaration extends FieldDeclaration {
   @FormEditor("hide", true)
   o StringDefault defaultValue optional
   @FormEditor("title", "typeIdentifier", "selectOptions", "types")
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
   @FormEditor("title", "typeIdentifier", "selectOptions", "types")
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
   @FormEditor("title", "classes")
   o ClassDeclaration[] declarations optional
 }
`;