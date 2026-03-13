import type {
  TemplateMarkDocument,
  TemplateMarkNode,
  VariableDefinitionNode,
  FormattedVariableDefinitionNode,
  EnumVariableDefinitionNode,
  FormulaDefinitionNode,
} from '../types/TemplateMark';

interface CollectedVar {
  name: string;
  elementType?: string;
  format?: string;
  enumValues?: string[];
}

const TYPE_MAP: Record<string, string> = {
  String: 'String',
  Integer: 'Integer',
  Double: 'Double',
  Boolean: 'Boolean',
  DateTime: 'DateTime',
  Long: 'Long',
};

function mapType(elementType: string | undefined): string {
  return TYPE_MAP[elementType ?? 'String'] ?? 'String';
}

function collectVarsFromNodes(
  nodes: TemplateMarkNode[],
  acc: Map<string, CollectedVar>
): void {
  for (const node of nodes) {
    const $class = node.$class;
    if (
      $class === 'org.accordproject.templatemark@0.5.0.VariableDefinition' ||
      $class === 'org.accordproject.templatemark@0.5.0.FormattedVariableDefinition'
    ) {
      const v = node as VariableDefinitionNode | FormattedVariableDefinitionNode;
      if (!acc.has(v.name)) {
        acc.set(v.name, {
          name: v.name,
          elementType: v.elementType,
          format: (v as FormattedVariableDefinitionNode).format,
        });
      }
    } else if ($class === 'org.accordproject.templatemark@0.5.0.EnumVariableDefinition') {
      const v = node as EnumVariableDefinitionNode;
      if (!acc.has(v.name)) {
        acc.set(v.name, {
          name: v.name,
          elementType: v.elementType ?? 'String',
          enumValues: v.enumValues,
        });
      }
    } else if ($class === 'org.accordproject.templatemark@0.5.0.FormulaDefinition') {
      const v = node as FormulaDefinitionNode;
      if (!acc.has(v.name)) {
        acc.set(v.name, { name: v.name, elementType: v.elementType ?? 'Double' });
      }
    } else if ($class === 'org.accordproject.templatemark@0.5.0.ConditionalDefinition') {
      const cond = node as {
        whenTrue?: TemplateMarkNode[];
        whenFalse?: TemplateMarkNode[];
        name: string;
      };
      if (!acc.has(cond.name)) {
        acc.set(cond.name, { name: cond.name, elementType: 'Boolean' });
      }
      if (cond.whenTrue) collectVarsFromNodes(cond.whenTrue, acc);
      if (cond.whenFalse) collectVarsFromNodes(cond.whenFalse, acc);
    } else if ($class === 'org.accordproject.templatemark@0.5.0.OptionalDefinition') {
      const opt = node as {
        name: string;
        whenSome?: TemplateMarkNode[];
        whenNone?: TemplateMarkNode[];
      };
      if (!acc.has(opt.name)) {
        acc.set(opt.name, { name: opt.name, elementType: 'Boolean' });
      }
      if (opt.whenSome) collectVarsFromNodes(opt.whenSome, acc);
      if (opt.whenNone) collectVarsFromNodes(opt.whenNone, acc);
    } else if ($class === 'org.accordproject.templatemark@0.5.0.ConditionalBlockDefinition') {
      const cond = node as {
        name: string;
        whenTrue?: TemplateMarkNode[];
        whenFalse?: TemplateMarkNode[];
      };
      if (!acc.has(cond.name)) acc.set(cond.name, { name: cond.name, elementType: 'Boolean' });
      if (cond.whenTrue) collectVarsFromNodes(cond.whenTrue, acc);
      if (cond.whenFalse) collectVarsFromNodes(cond.whenFalse, acc);
    } else if ($class === 'org.accordproject.templatemark@0.5.0.OptionalBlockDefinition') {
      const opt = node as {
        name: string;
        whenSome?: TemplateMarkNode[];
        whenNone?: TemplateMarkNode[];
      };
      if (!acc.has(opt.name)) acc.set(opt.name, { name: opt.name, elementType: 'Boolean' });
      if (opt.whenSome) collectVarsFromNodes(opt.whenSome, acc);
      if (opt.whenNone) collectVarsFromNodes(opt.whenNone, acc);
    } else if (
      $class === 'org.accordproject.templatemark@0.5.0.WithBlockDefinition' ||
      $class === 'org.accordproject.templatemark@0.5.0.ClauseDefinition' ||
      $class === 'org.accordproject.templatemark@0.5.0.ContractDefinition'
    ) {
      if ('nodes' in node && Array.isArray(node.nodes)) {
        collectVarsFromNodes(node.nodes as TemplateMarkNode[], acc);
      }
    }

    // Recurse into child nodes (for types not handled above)
    if (
      $class !== 'org.accordproject.templatemark@0.5.0.ConditionalDefinition' &&
      $class !== 'org.accordproject.templatemark@0.5.0.OptionalDefinition' &&
      $class !== 'org.accordproject.templatemark@0.5.0.ConditionalBlockDefinition' &&
      $class !== 'org.accordproject.templatemark@0.5.0.OptionalBlockDefinition' &&
      $class !== 'org.accordproject.templatemark@0.5.0.WithBlockDefinition' &&
      $class !== 'org.accordproject.templatemark@0.5.0.ClauseDefinition' &&
      $class !== 'org.accordproject.templatemark@0.5.0.ContractDefinition' &&
      'nodes' in node && Array.isArray(node.nodes)
    ) {
      collectVarsFromNodes(node.nodes as TemplateMarkNode[], acc);
    }
  }
}

/** Walk a TemplateMark document and collect all declared variable definitions. */
export function collectVariables(doc: TemplateMarkDocument): CollectedVar[] {
  const acc = new Map<string, CollectedVar>();
  const nodes = 'nodes' in doc ? (doc.nodes as TemplateMarkNode[] | undefined) : undefined;
  if (nodes) collectVarsFromNodes(nodes, acc);
  return [...acc.values()];
}

/**
 * Generate a Concerto CTO model string from a TemplateMark document.
 * Walks the document tree to collect all variable definitions.
 */
export function generateConcertoModel(doc: TemplateMarkDocument): string {
  const vars = collectVariables(doc);
  const fields = vars.flatMap((v) => {
    const type = mapType(v.elementType);
    const lines: string[] = [];
    if (v.format) lines.push(`  @format("${v.format}")`);
    lines.push(`  o ${type} ${v.name} optional`);
    return lines;
  });
  return [
    'namespace com.template@1.0.0',
    '',
    '@template',
    'concept TemplateData {',
    ...fields,
    '}',
  ].join('\n');
}
