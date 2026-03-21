import type { ConcertoModel, Declaration } from './types';

export function declarationsToCto(model: ConcertoModel): string {
  const lines: string[] = [];
  lines.push(`namespace ${model.namespace}`);
  lines.push('');

  for (const decl of model.declarations) {
    lines.push(declarationToCto(decl));
    lines.push('');
  }

  return lines.join('\n');
}

function declarationToCto(decl: Declaration): string {
  const lines: string[] = [];

  if (decl.type === 'map') {
    lines.push(`map ${decl.name} {`);
    if (decl.mapDeclaration) {
      lines.push(`  o ${decl.mapDeclaration.keyType}`);
      lines.push(`  o ${decl.mapDeclaration.valueType}`);
    }
    lines.push('}');
    return lines.join('\n');
  }

  let header = '';
  if (decl.isAbstract) header += 'abstract ';
  header += `${decl.type} ${decl.name}`;
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
      if (prop.isOptional) line += ' optional';
      lines.push(line);
    }
  }

  lines.push('}');
  return lines.join('\n');
}
