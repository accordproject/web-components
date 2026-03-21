import type { Node, Edge } from '@xyflow/react';

interface Property {
  name: string;
  type: string;
  isOptional: boolean;
  isArray: boolean;
  isRelationship: boolean;
}

interface Declaration {
  name: string;
  type: 'concept' | 'enum' | 'asset' | 'participant' | 'event' | 'transaction';
  isAbstract: boolean;
  superType?: string;
  properties: Property[];
  enumValues: string[];
}

const PRIMITIVE_TYPES = new Set([
  'String', 'Integer', 'Long', 'Double', 'Boolean', 'DateTime',
]);

/**
 * Simple CTO parser — extracts declarations, properties, enums.
 * For a real implementation, use @accordproject/concerto-core's parser.
 */
export function parseCto(cto: string): Declaration[] {
  const declarations: Declaration[] = [];
  const lines = cto.split('\n');

  let current: Declaration | null = null;
  let braceDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('namespace') || trimmed.startsWith('import')) {
      continue;
    }

    // Declaration start
    const declMatch = trimmed.match(
      /^(abstract\s+)?(concept|enum|asset|participant|event|transaction)\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{?/
    );
    if (declMatch && braceDepth === 0) {
      current = {
        name: declMatch[3],
        type: declMatch[2] as Declaration['type'],
        isAbstract: !!declMatch[1],
        superType: declMatch[4] || undefined,
        properties: [],
        enumValues: [],
      };
      declarations.push(current);
      if (trimmed.includes('{')) braceDepth = 1;
      continue;
    }

    if (trimmed === '{') {
      braceDepth++;
      continue;
    }

    if (trimmed === '}') {
      braceDepth--;
      if (braceDepth === 0) current = null;
      continue;
    }

    if (!current || braceDepth !== 1) continue;

    // Enum value
    if (current.type === 'enum') {
      const enumMatch = trimmed.match(/^o\s+(\w+)/);
      if (enumMatch) {
        current.enumValues.push(enumMatch[1]);
      }
      continue;
    }

    // Property: o Type name optional
    const propMatch = trimmed.match(
      /^(-->)?\s*o\s+(\w+)(\[\])?\s+(\w+)\s*(optional)?/
    );
    if (propMatch) {
      current.properties.push({
        name: propMatch[4],
        type: propMatch[2],
        isArray: !!propMatch[3],
        isOptional: !!propMatch[5],
        isRelationship: !!propMatch[1],
      });
    }

    // Relationship: --> Type name
    const relMatch = trimmed.match(/^-->\s+(\w+)(\[\])?\s+(\w+)\s*(optional)?/);
    if (relMatch) {
      current.properties.push({
        name: relMatch[3],
        type: relMatch[1],
        isArray: !!relMatch[2],
        isOptional: !!relMatch[4],
        isRelationship: true,
      });
    }
  }

  return declarations;
}

export function declarationsToGraph(declarations: Declaration[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const declNames = new Set(declarations.map((d) => d.name));

  // Layout: arrange nodes in a grid
  const cols = Math.ceil(Math.sqrt(declarations.length));
  const spacingX = 320;
  const spacingY = 280;

  declarations.forEach((decl, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);

    nodes.push({
      id: decl.name,
      type: decl.type === 'enum' ? 'enumNode' : 'conceptNode',
      position: { x: col * spacingX, y: row * spacingY },
      data: {
        label: decl.name,
        declaration: decl,
      },
    });

    // Inheritance edge
    if (decl.superType && declNames.has(decl.superType)) {
      edges.push({
        id: `${decl.name}-extends-${decl.superType}`,
        source: decl.name,
        target: decl.superType,
        type: 'smoothstep',
        animated: true,
        label: 'extends',
        style: { stroke: '#805ad5', strokeWidth: 2 },
      });
    }

    // Property/relationship edges to other declarations
    for (const prop of decl.properties) {
      if (declNames.has(prop.type) && !PRIMITIVE_TYPES.has(prop.type)) {
        edges.push({
          id: `${decl.name}-${prop.name}-${prop.type}`,
          source: decl.name,
          target: prop.type,
          label: prop.name + (prop.isArray ? '[]' : ''),
          type: 'smoothstep',
          style: {
            stroke: prop.isRelationship ? '#e53e3e' : '#3182ce',
            strokeWidth: 1.5,
            strokeDasharray: prop.isRelationship ? '5 5' : undefined,
          },
        });
      }
    }
  });

  return { nodes, edges };
}
