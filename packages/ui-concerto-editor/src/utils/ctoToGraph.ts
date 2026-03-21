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
 * Dendrogram tree layout.
 * - Finds the "root" node: the concept that is referenced the most but references the least
 * - Builds a tree from root by following property/relationship/inheritance connections
 * - Lays out as a top-down dendrogram (root centered at top, children spread below)
 * - Unconnected nodes placed at the bottom
 */
function computeTreeLayout(declarations: Declaration[]): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  if (declarations.length === 0) return positions;

  const declMap = new Map(declarations.map((d) => [d.name, d]));
  const declNames = new Set(declarations.map((d) => d.name));

  // Build adjacency: who references whom (all connection types)
  const refsFrom = new Map<string, Set<string>>(); // A → [B, C] means A has props of type B, C
  const refsTo = new Map<string, Set<string>>();   // B → [A] means B is referenced by A

  for (const decl of declarations) {
    if (!refsFrom.has(decl.name)) refsFrom.set(decl.name, new Set());

    // Inheritance
    if (decl.superType && declNames.has(decl.superType)) {
      refsFrom.get(decl.name)!.add(decl.superType);
      if (!refsTo.has(decl.superType)) refsTo.set(decl.superType, new Set());
      refsTo.get(decl.superType)!.add(decl.name);
    }

    // Properties/relationships
    const props = decl.type === 'map'
      ? decl.properties.filter((p) => p.name === '_value')
      : decl.properties;
    for (const prop of props) {
      if (declNames.has(prop.type) && !PRIMITIVE_TYPES.has(prop.type) && prop.type !== decl.name) {
        refsFrom.get(decl.name)!.add(prop.type);
        if (!refsTo.has(prop.type)) refsTo.set(prop.type, new Set());
        refsTo.get(prop.type)!.add(decl.name);
      }
    }
  }

  // Find root: node with most outgoing refs (it "uses" the most other types)
  // This is typically the main aggregate concept (e.g. NdaData)
  let root = declarations[0].name;
  let maxOut = -1;
  for (const decl of declarations) {
    const outCount = refsFrom.get(decl.name)?.size || 0;
    const inCount = refsTo.get(decl.name)?.size || 0;
    // Prefer nodes with most outgoing and least incoming
    const score = outCount * 2 - inCount;
    if (score > maxOut) {
      maxOut = score;
      root = decl.name;
    }
  }

  // BFS from root to build tree layers
  const visited = new Set<string>();
  const layers: string[][] = [];
  let queue = [root];
  visited.add(root);

  while (queue.length > 0) {
    layers.push([...queue]);
    const nextQueue: string[] = [];
    for (const name of queue) {
      // Add all connected nodes (both directions) that haven't been visited
      const outRefs = refsFrom.get(name) || new Set();
      const inRefs = refsTo.get(name) || new Set();
      const allConnected = new Set([...outRefs, ...inRefs]);
      for (const connected of allConnected) {
        if (!visited.has(connected)) {
          visited.add(connected);
          nextQueue.push(connected);
        }
      }
    }
    queue = nextQueue;
  }

  // Add any unvisited nodes as a final layer
  const unvisited = declarations.filter((d) => !visited.has(d.name)).map((d) => d.name);
  if (unvisited.length > 0) {
    layers.push(unvisited);
  }

  // Position: horizontal tree — root on the left, children spread to the right
  const nodeHeight = 200;
  const spacingX = 380;
  const spacingY = 80;

  for (let depth = 0; depth < layers.length; depth++) {
    const layer = layers[depth];
    const totalHeight = layer.length * nodeHeight + (layer.length - 1) * spacingY;
    const startY = -totalHeight / 2;

    layer.forEach((name, i) => {
      positions.set(name, {
        x: depth * spacingX,
        y: startY + i * (nodeHeight + spacingY),
      });
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

    // Inheritance edge — smooth bezier, subtle
    if (decl.superType && declNames.has(decl.superType)) {
      edges.push({
        id: `${decl.name}-extends-${decl.superType}`,
        source: decl.name, target: decl.superType,
        sourceHandle: 'right', targetHandle: 'left',
        type: 'default',
        animated: true,
        label: 'extends',
        style: { stroke: '#b794f4', strokeWidth: 1.5, opacity: 0.7 },
        labelStyle: { fill: '#b794f4', fontSize: 10, fontWeight: 600 },
        labelBgStyle: { fill: '#1a202c', fillOpacity: 0.8 },
        labelBgPadding: [6, 3] as [number, number],
        labelBgBorderRadius: 4,
      });
    }

    // Property/relationship edges — thin bezier curves
    const propsToEdge = decl.type === 'map'
      ? decl.properties.filter((p) => p.name === '_value')
      : decl.properties;

    for (const prop of propsToEdge) {
      if (declNames.has(prop.type) && !PRIMITIVE_TYPES.has(prop.type)) {
        const isRel = prop.isRelationship;
        edges.push({
          id: `${decl.name}-${prop.name}-${prop.type}`,
          source: decl.name, target: prop.type,
          sourceHandle: 'right', targetHandle: 'left',
          label: prop.name.startsWith('_') ? '' : prop.name + (prop.isArray ? '[]' : ''),
          type: 'default',
          style: {
            stroke: isRel ? '#fc8181' : '#90cdf4',
            strokeWidth: isRel ? 1.5 : 1.2,
            opacity: 0.6,
            strokeDasharray: isRel ? '6 4' : undefined,
          },
          labelStyle: { fill: isRel ? '#fc8181' : '#90cdf4', fontSize: 10, fontWeight: 500 },
          labelBgStyle: { fill: '#1a202c', fillOpacity: 0.8 },
          labelBgPadding: [6, 3] as [number, number],
          labelBgBorderRadius: 4,
        });
      }
    }
  });

  return { nodes, edges };
}
