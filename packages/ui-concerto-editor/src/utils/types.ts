export interface Property {
  name: string;
  type: string;
  isOptional: boolean;
  isArray: boolean;
  isRelationship: boolean;
}

export interface MapDeclaration {
  keyType: string;
  valueType: string;
}

export interface Declaration {
  name: string;
  type: 'concept' | 'enum' | 'asset' | 'participant' | 'event' | 'transaction' | 'map';
  isAbstract: boolean;
  superType?: string;
  properties: Property[];
  enumValues: string[];
  mapDeclaration?: MapDeclaration;
}

export interface ConcertoModel {
  namespace: string;
  declarations: Declaration[];
}

export const PRIMITIVE_TYPES = new Set([
  'String', 'Integer', 'Long', 'Double', 'Boolean', 'DateTime',
]);

export const ALL_TYPES = [
  'String', 'Integer', 'Long', 'Double', 'Boolean', 'DateTime',
];

export const DECLARATION_TYPES = [
  'concept', 'enum', 'asset', 'participant', 'event', 'transaction', 'map',
] as const;
