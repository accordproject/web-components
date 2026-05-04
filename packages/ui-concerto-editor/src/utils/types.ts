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

/**
 * Get all available types for property/map dropdowns.
 * Includes primitives + all declaration names (concepts, enums, scalars, etc.)
 */
export function getAvailableTypes(declarations: Declaration[], exclude?: string): string[] {
  const declNames = declarations.map((d) => d.name).filter((n) => n !== exclude);
  return [...ALL_TYPES, ...declNames];
}

/**
 * Map key/value type constraints per Concerto spec.
 * Keys: primitives String/DateTime, plus scalars extending them.
 * Values: primitives String/DateTime/Integer/Long/Double/Boolean, plus
 * scalars extending String/Integer/Long/Double/Boolean, plus concepts.
 */
export const MAP_KEY_PRIMITIVES = ['String', 'DateTime'];
export const MAP_VALUE_PRIMITIVES = ['String', 'DateTime', 'Integer', 'Long', 'Double', 'Boolean'];
const MAP_KEY_SCALAR_BASES = new Set(['String', 'DateTime']);
const MAP_VALUE_SCALAR_BASES = new Set(['String', 'Integer', 'Long', 'Double', 'Boolean']);
const CLASS_DECL_TYPES = new Set(['concept', 'asset', 'participant', 'event', 'transaction']);

export function getMapKeyTypes(declarations: Declaration[]): string[] {
  const scalars = declarations
    .filter((d) => d.type === 'scalar' && d.scalarExtends && MAP_KEY_SCALAR_BASES.has(d.scalarExtends))
    .map((d) => d.name);
  return [...MAP_KEY_PRIMITIVES, ...scalars];
}

export function getMapValueTypes(declarations: Declaration[]): string[] {
  const scalars = declarations
    .filter((d) => d.type === 'scalar' && d.scalarExtends && MAP_VALUE_SCALAR_BASES.has(d.scalarExtends))
    .map((d) => d.name);
  const concepts = declarations
    .filter((d) => CLASS_DECL_TYPES.has(d.type))
    .map((d) => d.name);
  return [...MAP_VALUE_PRIMITIVES, ...scalars, ...concepts];
}

/**
 * Get valid candidates for "extends" on a given declaration.
 * Only same-kind declarations (no enums, no maps, no scalars), excluding self and checking for cycles.
 */
export function getExtendsCandidates(declarations: Declaration[], declName: string): string[] {
  const decl = declarations.find((d) => d.name === declName);
  if (!decl) return [];

  // Build ancestor set to prevent cycles
  const ancestors = new Set<string>();
  const collectDescendants = (name: string) => {
    for (const d of declarations) {
      if (d.superType === name && !ancestors.has(d.name)) {
        ancestors.add(d.name);
        collectDescendants(d.name);
      }
    }
  };
  collectDescendants(declName);

  return declarations
    .filter((d) =>
      d.name !== declName &&
      d.type !== 'enum' &&
      d.type !== 'map' &&
      d.type !== 'scalar' &&
      !ancestors.has(d.name)
    )
    .map((d) => d.name);
}
