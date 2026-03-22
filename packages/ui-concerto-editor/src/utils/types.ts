export interface PropertyValidator {
  default?: string;
  regex?: string;
  range?: string;      // e.g. "[1,100]"
  length?: string;     // e.g. "[1,100]"
}

export interface Property {
  name: string;
  type: string;
  isOptional: boolean;
  isArray: boolean;
  isRelationship: boolean;
  validators: PropertyValidator;
}

export interface MapDeclaration {
  keyType: string;
  valueType: string;
}

export interface Decorator {
  name: string;
  args: string[];
}

export type IdentifiedKind = 'none' | 'identified' | 'identified-by';

export interface Declaration {
  name: string;
  type: 'concept' | 'enum' | 'asset' | 'participant' | 'event' | 'transaction' | 'map' | 'scalar';
  isAbstract: boolean;
  superType?: string;
  properties: Property[];
  enumValues: string[];
  mapDeclaration?: MapDeclaration;
  // Scalar
  scalarExtends?: string;  // e.g. "String"
  scalarValidators?: PropertyValidator;
  // Identity
  identified: IdentifiedKind;
  identifiedBy?: string;   // field name for "identified by"
  // Decorators
  decorators: Decorator[];
}

export interface ImportStatement {
  namespace: string;
  types: string[];
  uri?: string;
}

export interface ConcertoModel {
  namespace: string;
  imports: ImportStatement[];
  declarations: Declaration[];
}

export const PRIMITIVE_TYPES = new Set([
  'String', 'Integer', 'Long', 'Double', 'Boolean', 'DateTime',
]);

export const ALL_TYPES = [
  'String', 'Integer', 'Long', 'Double', 'Boolean', 'DateTime',
];

export const DECLARATION_TYPES = [
  'concept', 'enum', 'asset', 'participant', 'event', 'transaction', 'map', 'scalar',
] as const;
