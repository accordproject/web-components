/**
 * Type constants for template variables and formulas.
 * 
 * Defines primitive types and Accord Project complex types used in TemplateMark.
 * The editor stores full qualified names (FQN) for Accord Project types,
 * but displays friendly names in the UI.
 */

/** Primitive types supported in TemplateMark */
export const PRIMITIVE_TYPES = [
  'String',
  'Integer',
  'Double',
  'Boolean',
  'DateTime',
  'Long',
] as const;

/** Accord Project complex types with their full qualified names */
export const ACCORD_PROJECT_TYPES = {
  'MonetaryAmount': 'org.accordproject.money@0.3.0.MonetaryAmount',
  'Duration': 'org.accordproject.time@0.3.0.Duration',
  'Period': 'org.accordproject.time@0.3.0.Period',
} as const;

export type PrimitiveType = typeof PRIMITIVE_TYPES[number];
export type AccordProjectTypeName = keyof typeof ACCORD_PROJECT_TYPES;
export type AccordProjectTypeFQN = typeof ACCORD_PROJECT_TYPES[AccordProjectTypeName];

/** Reverse mapping from FQN to friendly name */
const FQN_TO_FRIENDLY: Record<string, AccordProjectTypeName> = Object.entries(ACCORD_PROJECT_TYPES)
  .reduce((acc, [friendly, fqn]) => {
    acc[fqn] = friendly as AccordProjectTypeName;
    return acc;
  }, {} as Record<string, AccordProjectTypeName>);

/**
 * Get the friendly display name for a type.
 * Returns the FQN suffix for Accord Project types, or the type as-is for primitives.
 * @example getFriendlyTypeName('org.accordproject.money@0.3.0.MonetaryAmount') → 'MonetaryAmount'
 * @example getFriendlyTypeName('String') → 'String'
 */
export function getFriendlyTypeName(typeOrFqn: string): string {
  // Check if it's a known Accord Project FQN
  if (FQN_TO_FRIENDLY[typeOrFqn]) {
    return FQN_TO_FRIENDLY[typeOrFqn];
  }
  // For unknown FQNs, extract the last segment after @version.
  if (typeOrFqn.includes('@') && typeOrFqn.includes('.')) {
    const parts = typeOrFqn.split('.');
    return parts[parts.length - 1];
  }
  return typeOrFqn;
}

/**
 * Get the full qualified name for a type.
 * Returns the FQN for Accord Project friendly names, or the type as-is for primitives.
 * @example getFullTypeName('MonetaryAmount') → 'org.accordproject.money@0.3.0.MonetaryAmount'
 * @example getFullTypeName('String') → 'String'
 */
export function getFullTypeName(friendlyOrType: string): string {
  // Check if it's an Accord Project friendly name
  if (friendlyOrType in ACCORD_PROJECT_TYPES) {
    return ACCORD_PROJECT_TYPES[friendlyOrType as AccordProjectTypeName];
  }
  return friendlyOrType;
}

/**
 * Check if a type is an Accord Project complex type (by FQN or friendly name).
 */
export function isAccordProjectType(typeOrFqn: string): boolean {
  return typeOrFqn in ACCORD_PROJECT_TYPES || typeOrFqn in FQN_TO_FRIENDLY;
}

/**
 * Get the badge CSS modifier class based on the element type.
 * @example getBadgeModifier('org.accordproject.money@0.3.0.MonetaryAmount') → 'monetary'
 * @example getBadgeModifier('String') → 'variable'
 */
export function getBadgeModifier(elementType: string | undefined): string {
  if (!elementType) return 'variable';
  
  const friendly = getFriendlyTypeName(elementType);
  switch (friendly) {
    case 'MonetaryAmount': return 'monetary';
    case 'Duration': return 'duration';
    case 'Period': return 'period';
    default: return 'variable';
  }
}

/**
 * Default format strings for Accord Project types.
 * These are hints shown in the format input placeholder.
 */
export const DEFAULT_FORMATS: Record<AccordProjectTypeName, string> = {
  'MonetaryAmount': '0,0.00 CCC',
  'Duration': '',
  'Period': '',
};
