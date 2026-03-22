import type { ConcertoModel, Declaration, PropertyValidator } from './types';

export function declarationsToCto(model: ConcertoModel): string {
  const lines: string[] = [];
  lines.push(`namespace ${model.namespace}`);

  // Imports
  if (model.imports.length > 0) {
    lines.push('');
    for (const imp of model.imports) {
      let line = 'import ';
      if (imp.types.length === 1) {
        line += `${imp.namespace}.${imp.types[0]}`;
      } else {
        line += `${imp.namespace}.{${imp.types.join(', ')}}`;
      }
      if (imp.uri) line += ` from ${imp.uri}`;
      lines.push(line);
    }
  }

  lines.push('');

  for (const decl of model.declarations) {
    lines.push(declarationToCto(decl));
    lines.push('');
  }

  return lines.join('\n');
}

function validatorsToCto(v: PropertyValidator): string {
  let s = '';
  if (v.default != null) s += ` default=${v.default}`;
  if (v.regex) s += ` regex=${v.regex}`;
  if (v.range) s += ` range=${v.range}`;
  if (v.length) s += ` length=${v.length}`;
  return s;
}

function decoratorsToCto(decorators: { name: string; args: string[] }[], indent: string): string[] {
  return decorators.map((d) => {
    if (d.args.length > 0) {
      return `${indent}@${d.name}(${d.args.join(', ')})`;
    }
    return `${indent}@${d.name}`;
  });
}

function declarationToCto(decl: Declaration): string {
  const lines: string[] = [];

  // Declaration-level decorators
  lines.push(...decoratorsToCto(decl.decorators, ''));

  // Scalar
  if (decl.type === 'scalar') {
    let line = `scalar ${decl.name} extends ${decl.scalarExtends || 'String'}`;
    if (decl.scalarValidators) line += validatorsToCto(decl.scalarValidators);
    lines.push(line);
    return lines.join('\n');
  }

  // Map
  if (decl.type === 'map') {
    lines.push(`map ${decl.name} {`);
    if (decl.mapDeclaration) {
      lines.push(`  o ${decl.mapDeclaration.keyType}`);
      lines.push(`  o ${decl.mapDeclaration.valueType}`);
    }
    lines.push('}');
    return lines.join('\n');
  }

  // Regular declarations
  let header = '';
  if (decl.isAbstract) header += 'abstract ';
  header += `${decl.type} ${decl.name}`;

  // Identity
  if (decl.identified === 'identified-by' && decl.identifiedBy) {
    header += ` identified by ${decl.identifiedBy}`;
  } else if (decl.identified === 'identified') {
    header += ' identified';
  }

  if (decl.superType) header += ` extends ${decl.superType}`;
  header += ' {';
  lines.push(header);

  if (decl.type === 'enum') {
    for (const val of decl.enumValues) {
      lines.push(`  o ${val}`);
    }
  } else {
    for (const prop of decl.properties) {
      let line = '  ';
      if (prop.isRelationship) {
        line += `--> ${prop.type}`;
      } else {
        line += `o ${prop.type}`;
      }
      if (prop.isArray) line += '[]';
      line += ` ${prop.name}`;
      line += validatorsToCto(prop.validators);
      if (prop.isOptional) line += ' optional';
      lines.push(line);
    }
  }

  lines.push('}');
  return lines.join('\n');
}
