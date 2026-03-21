import type { Node, Edge } from '@xyflow/react';
import type { Declaration, ConcertoModel } from './types';
import { PRIMITIVE_TYPES } from './types';

export function parseCto(cto: string): ConcertoModel {
  const declarations: Declaration[] = [];
  const lines = cto.split('\n');
  let namespace = 'org.example@1.0.0';

  let current: Declaration | null = null;
  let braceDepth = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;

    const nsMatch = trimmed.match(/^namespace\s+(.+)/);
    if (nsMatch) { namespace = nsMatch[1].trim(); continue; }
    if (trimmed.startsWith('import')) continue;

    // Map declaration: map MapName { ... }
    const mapMatch = trimmed.match(/^map\s+(\w+)\s*\{?/);
    if (mapMatch && braceDepth === 0) {
      current = {
        name: mapMatch[1], type: 'map', isAbstract: false,
        properties: [], enumValues: [],
        mapDeclaration: { keyType: 'String', valueType: 'String' },
      };
      declarations.push(current);
      if (trimmed.includes('{')) braceDepth = 1;
      continue;
    }

    // Regular declaration
    const declMatch = trimmed.match(
      /^(abstract\s+)?(concept|enum|asset|participant|event|transaction)\s+(\w+)(?:\s+extends\s+(\w+))?\s*\{?/
    );
    if (declMatch && braceDepth === 0) {
      current = {
        name: declMatch[3],
        type: declMatch[2] as Declaration['type'],
        isAbstract: !!declMatch[1],
        superType: declMatch[4] || undefined,
        properties: [], enumValues: [],
      };
      declarations.push(current);
      if (trimmed.includes('{')) braceDepth = 1;
      continue;
    }

    if (trimmed === '{') { braceDepth++; continue; }
    if (trimmed === '}') { braceDepth--; if (braceDepth === 0) current = null; continue; }
    if (!current || braceDepth !== 1) continue;

    // Map key/value: o Type
    if (current.type === 'map' && current.mapDeclaration) {
      const mapFieldMatch = trimmed.match(/^o\s+(\w+)/);
      if (mapFieldMatch) {
        if (current.mapDeclaration.keyType === 'String' && current.properties.length === 0) {
          current.mapDeclaration.keyType = mapFieldMatch[1];
          current.properties.push({ name: '_key', type: mapFieldMatch[1], isOptional: false, isArray: false, isRelationship: false });
        } else {
          current.mapDeclaration.valueType = mapFieldMatch[1];
          current.properties.push({ name: '_value', type: mapFieldMatch[1], isOptional: false, isArray: false, isRelationship: false });
        }
      }
      continue;
    }

    // Enum value
    if (current.type === 'enum') {
      const enumMatch = trimmed.match(/^o\s+(\w+)/);
      if (enumMatch) current.enumValues.push(enumMatch[1]);
      continue;
    }

    // Relationship
    const relMatch = trimmed.match(/^-->\s+(\w+)(\[\])?\s+(\w+)\s*(optional)?/);
    if (relMatch) {
      current.properties.push({
        name: relMatch[3], type: relMatch[1],
        isArray: !!relMatch[2], isOptional: !!relMatch[4], isRelationship: true,
      });
      continue;
    }

    // Property
    const propMatch = trimmed.match(/^o\s+(\w+)(\[\])?\s+(\w+)\s*(optional)?/);
    if (propMatch) {
      current.properties.push({
        name: propMatch[3], type: propMatch[1],
        isArray: !!propMatch[2], isOptional: !!propMatch[4], isRelationship: false,
      });
    }
  }

  return { namespace, declarations };
}

export function declarationsToGraph(declarations: Declaration[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const declNames = new Set(declarations.map((d) => d.name));

  const cols = Math.ceil(Math.sqrt(declarations.length)) || 1;
  const spacingX = 320;
  const spacingY = 300;

  declarations.forEach((decl, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);

    let nodeType = 'conceptNode';
    if (decl.type === 'enum') nodeType = 'enumNode';
    else if (decl.type === 'map') nodeType = 'mapNode';

    nodes.push({
      id: decl.name,
      type: nodeType,
      position: { x: col * spacingX, y: row * spacingY },
      data: { label: decl.name, declaration: decl },
    });

    // Inheritance edge
    if (decl.superType && declNames.has(decl.superType)) {
      edges.push({
        id: `${decl.name}-extends-${decl.superType}`,
        source: decl.name, target: decl.superType,
        type: 'smoothstep', animated: true,
        label: 'extends',
        style: { stroke: '#805ad5', strokeWidth: 2 },
        labelStyle: { fill: '#b794f4', fontSize: 11 },
        labelBgStyle: { fill: '#1a202c' },
      });
    }

    // Property/relationship edges
    const propsToEdge = decl.type === 'map'
      ? decl.properties.filter((p) => p.name === '_value')
      : decl.properties;

    for (const prop of propsToEdge) {
      if (declNames.has(prop.type) && !PRIMITIVE_TYPES.has(prop.type)) {
        edges.push({
          id: `${decl.name}-${prop.name}-${prop.type}`,
          source: decl.name, target: prop.type,
          label: prop.name.startsWith('_') ? '' : prop.name + (prop.isArray ? '[]' : ''),
          type: 'smoothstep',
          style: {
            stroke: prop.isRelationship ? '#e53e3e' : '#3182ce',
            strokeWidth: 1.5,
            strokeDasharray: prop.isRelationship ? '5 5' : undefined,
          },
          labelStyle: { fill: prop.isRelationship ? '#fc8181' : '#90cdf4', fontSize: 11 },
          labelBgStyle: { fill: '#1a202c' },
        });
      }
    }
  });

  return { nodes, edges };
}
