import type { Node, Edge } from '@xyflow/react';
import type { Declaration, ConcertoModel, ImportStatement, Property, PropertyValidator, Decorator, IdentifiedKind } from './types';
import { PRIMITIVE_TYPES } from './types';

/**
 * Full CTO parser based on the Concerto specification.
 * https://concerto.accordproject.org/docs/category/specification
 */
export function parseCto(cto: string): ConcertoModel {
  const declarations: Declaration[] = [];
  const imports: ImportStatement[] = [];
  let namespace = 'org.example@1.0.0';

  const lines = cto.split('\n');
  let current: Declaration | null = null;
  let braceDepth = 0;
  let pendingDecorators: Decorator[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) continue;

    // Namespace
    const nsMatch = trimmed.match(/^namespace\s+(.+)/);
    if (nsMatch) { namespace = nsMatch[1].trim(); continue; }

    // Decorators: @Name or @Name(args)
    const decoMatch = trimmed.match(/^@(\w+)(?:\(([^)]*)\))?$/);
    if (decoMatch) {
      const args = decoMatch[2] ? decoMatch[2].split(',').map((a) => a.trim()) : [];
      pendingDecorators.push({ name: decoMatch[1], args });
      continue;
    }

    // Import: import ns.Type, import ns.{A, B}, import ns.Type from url
    const importMatch = trimmed.match(/^import\s+(\S+?)\.(\{[^}]+\}|\w+|\*)(?:\s+from\s+(\S+))?$/);
    if (importMatch) {
      const ns = importMatch[1];
      let types: string[];
      const typesPart = importMatch[2];
      if (typesPart.startsWith('{')) {
        types = typesPart.slice(1, -1).split(',').map((t) => t.trim().split(/\s+as\s+/)[0]);
      } else {
        types = [typesPart];
      }
      imports.push({ namespace: ns, types, uri: importMatch[3] });
      continue;
    }

    // Scalar: scalar Name extends PrimitiveType default="x" regex=/x/ range=[x,y] length=[x,y]
    const scalarMatch = trimmed.match(/^scalar\s+(\w+)\s+extends\s+(\w+)(.*?)$/);
    if (scalarMatch && braceDepth === 0) {
      const validators = parseValidators(scalarMatch[3]);
      declarations.push({
        name: scalarMatch[1], type: 'scalar', isAbstract: false,
        superType: undefined, properties: [], enumValues: [],
        scalarExtends: scalarMatch[2], scalarValidators: validators,
        identified: 'none', decorators: [...pendingDecorators],
      });
      pendingDecorators = [];
      continue;
    }

    // Map: map Name { ... }
    const mapMatch = trimmed.match(/^map\s+(\w+)\s*\{?$/);
    if (mapMatch && braceDepth === 0) {
      current = {
        name: mapMatch[1], type: 'map', isAbstract: false,
        properties: [], enumValues: [],
        mapDeclaration: { keyType: 'String', valueType: 'String' },
        identified: 'none', decorators: [...pendingDecorators],
      };
      declarations.push(current);
      pendingDecorators = [];
      if (trimmed.includes('{')) braceDepth = 1;
      continue;
    }

    // Regular declaration: [abstract] (concept|enum|asset|participant|event|transaction) Name [identified [by field]] [extends SuperType] {
    const declMatch = trimmed.match(
      /^(abstract\s+)?(concept|enum|asset|participant|event|transaction)\s+(\w+)(.*?)\s*\{?$/
    );
    if (declMatch && braceDepth === 0) {
      const rest = declMatch[4].trim();

      // Parse "identified by field" or "identified"
      let identified: IdentifiedKind = 'none';
      let identifiedBy: string | undefined;
      const idByMatch = rest.match(/identified\s+by\s+(\w+)/);
      if (idByMatch) {
        identified = 'identified-by';
        identifiedBy = idByMatch[1];
      } else if (/\bidentified\b/.test(rest)) {
        identified = 'identified';
      }

      // Parse "extends SuperType"
      let superType: string | undefined;
      const extendsMatch = rest.match(/extends\s+(\w+)/);
      if (extendsMatch) superType = extendsMatch[1];

      current = {
        name: declMatch[3],
        type: declMatch[2] as Declaration['type'],
        isAbstract: !!declMatch[1],
        superType,
        properties: [], enumValues: [],
        identified, identifiedBy,
        decorators: [...pendingDecorators],
      };
      declarations.push(current);
      pendingDecorators = [];
      if (trimmed.includes('{')) braceDepth = 1;
      continue;
    }

    if (trimmed === '{') { braceDepth++; continue; }
    if (trimmed === '}') { braceDepth--; if (braceDepth === 0) { current = null; pendingDecorators = []; } continue; }
    if (!current || braceDepth !== 1) continue;

    // Inside a declaration body

    // Property-level decorators
    if (decoMatch) continue; // already handled above

    // Map key/value: o Type
    if (current.type === 'map' && current.mapDeclaration) {
      const mapFieldMatch = trimmed.match(/^o\s+(\w+)/);
      if (mapFieldMatch) {
        if (current.properties.length === 0) {
          current.mapDeclaration.keyType = mapFieldMatch[1];
          current.properties.push({ name: '_key', type: mapFieldMatch[1], isOptional: false, isArray: false, isRelationship: false, validators: {} });
        } else {
          current.mapDeclaration.valueType = mapFieldMatch[1];
          current.properties.push({ name: '_value', type: mapFieldMatch[1], isOptional: false, isArray: false, isRelationship: false, validators: {} });
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

    // Relationship: --> Type[] name optional
    const relMatch = trimmed.match(/^-->\s+(\w+)(\[\])?\s+(\w+)(.*?)$/);
    if (relMatch) {
      const validators = parseValidators(relMatch[4]);
      const isOptional = /\boptional\b/.test(relMatch[4] || '');
      current.properties.push({
        name: relMatch[3], type: relMatch[1],
        isArray: !!relMatch[2], isOptional, isRelationship: true,
        validators,
      });
      continue;
    }

    // Property: o Type[] name [default="x"] [regex=/x/] [range=[x,y]] [length=[x,y]] [optional]
    const propMatch = trimmed.match(/^o\s+(\w+)(\[\])?\s+(\w+)(.*?)$/);
    if (propMatch) {
      const rest = propMatch[4] || '';
      const validators = parseValidators(rest);
      const isOptional = /\boptional\b/.test(rest);
      current.properties.push({
        name: propMatch[3], type: propMatch[1],
        isArray: !!propMatch[2], isOptional, isRelationship: false,
        validators,
      });
    }
  }

  return { namespace, imports, declarations };
}

function parseValidators(str: string): PropertyValidator {
  const v: PropertyValidator = {};
  if (!str) return v;

  const defaultMatch = str.match(/default\s*=\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\S+)/);
  if (defaultMatch) v.default = defaultMatch[1];

  const regexMatch = str.match(/regex\s*=\s*(\/[^/]*\/)/);
  if (regexMatch) v.regex = regexMatch[1];

  const rangeMatch = str.match(/range\s*=\s*(\[[^\]]*\])/);
  if (rangeMatch) v.range = rangeMatch[1];

  const lengthMatch = str.match(/length\s*=\s*(\[[^\]]*\])/);
  if (lengthMatch) v.length = lengthMatch[1];

  return v;
}

// ── Layout ──────────────────────────────────────────────────────

function estimateNodeHeight(decl: Declaration): number {
  let headerHeight = 70;
  const rowHeight = 30;
  const buttonHeight = 36;
  const padding = 16;

  // Extra header space for decorators, identified, extends
  if (decl.decorators?.length > 0) headerHeight += 20;
  if (decl.identified !== 'none') headerHeight += 16;
  if (decl.superType) headerHeight += 16;

  if (decl.type === 'scalar') {
    const constraintRows = [decl.scalarValidators?.default, decl.scalarValidators?.regex, decl.scalarValidators?.range, decl.scalarValidators?.length].filter(Boolean).length;
    return 80 + Math.max(constraintRows, 1) * rowHeight;
  }
  if (decl.type === 'enum') return headerHeight + Math.max(decl.enumValues.length, 1) * rowHeight + buttonHeight + padding;
  if (decl.type === 'map') return headerHeight + 2 * rowHeight + padding;
  return headerHeight + Math.max(decl.properties.length, 1) * rowHeight + buttonHeight + padding;
}

function computeTreeLayout(declarations: Declaration[]): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  if (declarations.length === 0) return positions;

  const declNames = new Set(declarations.map((d) => d.name));

  const refsFrom = new Map<string, Set<string>>();
  const refsTo = new Map<string, Set<string>>();

  for (const decl of declarations) {
    if (!refsFrom.has(decl.name)) refsFrom.set(decl.name, new Set());

    if (decl.superType && declNames.has(decl.superType)) {
      refsFrom.get(decl.name)!.add(decl.superType);
      if (!refsTo.has(decl.superType)) refsTo.set(decl.superType, new Set());
      refsTo.get(decl.superType)!.add(decl.name);
    }

    if (decl.scalarExtends && declNames.has(decl.scalarExtends)) {
      refsFrom.get(decl.name)!.add(decl.scalarExtends);
    }

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

  let root = declarations[0].name;
  let maxScore = -Infinity;
  for (const decl of declarations) {
    const outCount = refsFrom.get(decl.name)?.size || 0;
    const inCount = refsTo.get(decl.name)?.size || 0;
    const score = outCount * 2 - inCount;
    if (score > maxScore) { maxScore = score; root = decl.name; }
  }

  const visited = new Set<string>();
  const layers: string[][] = [];
  let queue = [root];
  visited.add(root);

  while (queue.length > 0) {
    layers.push([...queue]);
    const nextQueue: string[] = [];
    for (const name of queue) {
      const outRefs = refsFrom.get(name) || new Set();
      const inRefs = refsTo.get(name) || new Set();
      for (const connected of new Set([...outRefs, ...inRefs])) {
        if (!visited.has(connected)) { visited.add(connected); nextQueue.push(connected); }
      }
    }
    queue = nextQueue;
  }

  const unvisited = declarations.filter((d) => !visited.has(d.name)).map((d) => d.name);
  if (unvisited.length > 0) layers.push(unvisited);

  const heights = new Map<string, number>();
  for (const decl of declarations) heights.set(decl.name, estimateNodeHeight(decl));

  const spacingX = 380;
  const gapY = 40;

  for (let depth = 0; depth < layers.length; depth++) {
    const layer = layers[depth];
    let totalHeight = 0;
    for (const name of layer) totalHeight += heights.get(name) || 150;
    totalHeight += (layer.length - 1) * gapY;
    let currentY = -totalHeight / 2;
    for (const name of layer) {
      const h = heights.get(name) || 150;
      positions.set(name, { x: depth * spacingX, y: currentY });
      currentY += h + gapY;
    }
  }

  return positions;
}

// ── Graph generation ──────────────────────────────────────────────

export function declarationsToGraph(declarations: Declaration[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const declNames = new Set(declarations.map((d) => d.name));
  const positions = computeTreeLayout(declarations);

  declarations.forEach((decl) => {
    let nodeType = 'conceptNode';
    if (decl.type === 'enum') nodeType = 'enumNode';
    else if (decl.type === 'map') nodeType = 'mapNode';
    else if (decl.type === 'scalar') nodeType = 'scalarNode';

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
        sourceHandle: 'right', targetHandle: 'left',
        type: 'default', animated: true,
        label: 'extends',
        style: { stroke: '#b794f4', strokeWidth: 1.5, opacity: 0.7 },
        labelStyle: { fill: '#b794f4', fontSize: 10, fontWeight: 600 },
        labelBgStyle: { fill: '#1a202c', fillOpacity: 0.8 },
        labelBgPadding: [6, 3] as [number, number],
        labelBgBorderRadius: 4,
      });
    }

    // Property/relationship edges
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
