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

/**
 * Tree layout: inheritance roots at the top, children below.
 * Nodes without relationships are placed to the side.
 */
function computeTreeLayout(declarations: Declaration[]): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const declMap = new Map(declarations.map((d) => [d.name, d]));
  const declNames = new Set(declarations.map((d) => d.name));

  // Build inheritance tree: parent → children[]
  const children = new Map<string, string[]>();
  const hasParent = new Set<string>();
  for (const decl of declarations) {
    if (decl.superType && declNames.has(decl.superType)) {
      hasParent.add(decl.name);
      const kids = children.get(decl.superType) || [];
      kids.push(decl.name);
      children.set(decl.superType, kids);
    }
  }

  // Build property/relationship references (non-inheritance connections)
  const referencedBy = new Map<string, string[]>();
  for (const decl of declarations) {
    const props = decl.type === 'map'
      ? decl.properties.filter((p) => p.name === '_value')
      : decl.properties;
    for (const prop of props) {
      if (declNames.has(prop.type) && !PRIMITIVE_TYPES.has(prop.type) && prop.type !== decl.name) {
        const refs = referencedBy.get(prop.type) || [];
        refs.push(decl.name);
        referencedBy.set(prop.type, refs);
      }
    }
  }

  // Find inheritance roots (nodes that have children but no parent)
  const inheritanceRoots: string[] = [];
  // Find standalone nodes (no inheritance at all)
  const standalone: string[] = [];

  for (const decl of declarations) {
    if (!hasParent.has(decl.name) && children.has(decl.name)) {
      inheritanceRoots.push(decl.name);
    } else if (!hasParent.has(decl.name) && !children.has(decl.name)) {
      standalone.push(decl.name);
    }
  }

  const spacingX = 300;
  const spacingY = 250;
  let currentX = 0;

  // Layout a subtree, returns width used
  function layoutSubtree(name: string, depth: number, startX: number): number {
    const kids = children.get(name) || [];
    if (kids.length === 0) {
      positions.set(name, { x: startX, y: depth * spacingY });
      return spacingX;
    }

    let childX = startX;
    let totalWidth = 0;
    for (const kid of kids) {
      const w = layoutSubtree(kid, depth + 1, childX);
      childX += w;
      totalWidth += w;
    }

    // Center parent above its children
    const firstChild = positions.get(kids[0])!;
    const lastChild = positions.get(kids[kids.length - 1])!;
    const centerX = (firstChild.x + lastChild.x) / 2;
    positions.set(name, { x: centerX, y: depth * spacingY });

    return Math.max(totalWidth, spacingX);
  }

  // Layout inheritance trees
  for (const root of inheritanceRoots) {
    const width = layoutSubtree(root, 0, currentX);
    currentX += width + spacingX * 0.5;
  }

  // Group standalone nodes: sort so that nodes that reference each other are nearby
  // Put enums and maps in separate columns from concepts
  const standaloneEnums = standalone.filter((n) => declMap.get(n)?.type === 'enum');
  const standaloneMaps = standalone.filter((n) => declMap.get(n)?.type === 'map');
  const standaloneConcepts = standalone.filter((n) => {
    const t = declMap.get(n)?.type;
    return t !== 'enum' && t !== 'map';
  });

  // Layout standalone concepts in rows
  if (standaloneConcepts.length > 0) {
    // If there were inheritance trees, add gap
    if (currentX > 0) currentX += spacingX * 0.5;

    const cols = Math.max(1, Math.ceil(Math.sqrt(standaloneConcepts.length)));
    standaloneConcepts.forEach((name, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      positions.set(name, { x: currentX + col * spacingX, y: row * spacingY });
    });
    const usedCols = Math.min(standaloneConcepts.length, cols);
    currentX += usedCols * spacingX + spacingX * 0.5;
  }

  // Layout enums in a column to the right
  if (standaloneEnums.length > 0) {
    if (currentX > 0) currentX += spacingX * 0.3;
    standaloneEnums.forEach((name, i) => {
      positions.set(name, { x: currentX, y: i * spacingY });
    });
    currentX += spacingX;
  }

  // Layout maps in a column to the right
  if (standaloneMaps.length > 0) {
    if (currentX > 0) currentX += spacingX * 0.3;
    standaloneMaps.forEach((name, i) => {
      positions.set(name, { x: currentX, y: i * spacingY });
    });
  }

  return positions;
}

export function declarationsToGraph(declarations: Declaration[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const declNames = new Set(declarations.map((d) => d.name));

  const positions = computeTreeLayout(declarations);

  declarations.forEach((decl) => {
    let nodeType = 'conceptNode';
    if (decl.type === 'enum') nodeType = 'enumNode';
    else if (decl.type === 'map') nodeType = 'mapNode';

    const pos = positions.get(decl.name) || { x: 0, y: 0 };

    nodes.push({
      id: decl.name,
      type: nodeType,
      position: pos,
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
