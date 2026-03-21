import { useRef, useCallback } from 'react';

interface CtoEditorProps {
  value: string;
  onChange: (value: string) => void;
}

// Colors matching our graph nodes
const COLORS = {
  keyword: '#63b3ed',      // concept, enum, asset, etc. (same as concept node accent)
  abstract: '#b794f4',     // abstract keyword (same as extends edge)
  namespace: '#718096',    // namespace, import
  typePrimitive: '#68d391', // String (green, same as String in nodes)
  typeInteger: '#63b3ed',   // Integer, Long, Double (blue)
  typeBoolean: '#fbd38d',   // Boolean (yellow)
  typeDateTime: '#d6bcfa',  // DateTime (purple)
  typeCustom: '#63b3ed',    // custom types (concept references)
  relationship: '#fc8181',  // --> (red, same as relationship edge)
  enumValue: '#fbd38d',     // enum values (yellow, same as enum node)
  propName: '#e2e8f0',      // property names (white)
  optional: '#ed8936',      // optional keyword (orange)
  extends: '#b794f4',       // extends keyword (purple, same as extends edge)
  brace: '#718096',         // { }
  comment: '#4a5568',       // comments
  identifier: '#fff',       // declaration names
  o: '#718096',             // the 'o' marker
};

function highlightCto(cto: string): string {
  return cto.split('\n').map((line) => {
    const trimmed = line.trim();

    // Comments
    if (trimmed.startsWith('//')) {
      return `<span style="color:${COLORS.comment}">${esc(line)}</span>`;
    }

    // Namespace / import
    if (trimmed.startsWith('namespace') || trimmed.startsWith('import')) {
      return `<span style="color:${COLORS.namespace}">${esc(line)}</span>`;
    }

    // Declaration line
    const declMatch = trimmed.match(
      /^(abstract\s+)?(concept|enum|asset|participant|event|transaction|map)\s+(\w+)(\s+extends\s+(\w+))?\s*(\{)?$/
    );
    if (declMatch) {
      let result = getIndent(line);
      if (declMatch[1]) result += `<span style="color:${COLORS.abstract}">abstract</span> `;
      result += `<span style="color:${COLORS.keyword}">${declMatch[2]}</span> `;
      result += `<span style="color:${COLORS.identifier};font-weight:700">${declMatch[3]}</span>`;
      if (declMatch[4]) {
        result += ` <span style="color:${COLORS.extends}">extends</span> `;
        result += `<span style="color:${COLORS.identifier}">${declMatch[5]}</span>`;
      }
      if (declMatch[6]) result += ` <span style="color:${COLORS.brace}">{</span>`;
      return result;
    }

    // Braces
    if (trimmed === '{') return `${getIndent(line)}<span style="color:${COLORS.brace}">{</span>`;
    if (trimmed === '}') return `${getIndent(line)}<span style="color:${COLORS.brace}">}</span>`;

    // Relationship: --> Type[] name optional
    const relMatch = trimmed.match(/^(-->)\s+(\w+)(\[\])?\s+(\w+)(\s+optional)?$/);
    if (relMatch) {
      let result = getIndent(line);
      result += `<span style="color:${COLORS.relationship};font-weight:700">--&gt;</span> `;
      result += `<span style="color:${colorForType(relMatch[2])}">${relMatch[2]}</span>`;
      if (relMatch[3]) result += `<span style="color:${COLORS.typeInteger}">[]</span>`;
      result += ` <span style="color:${COLORS.propName}">${relMatch[4]}</span>`;
      if (relMatch[5]) result += ` <span style="color:${COLORS.optional}">optional</span>`;
      return result;
    }

    // Property: o Type[] name optional
    const propMatch = trimmed.match(/^(o)\s+(\w+)(\[\])?\s+(\w+)?(\s+optional)?$/);
    if (propMatch) {
      let result = getIndent(line);
      result += `<span style="color:${COLORS.o}">o</span> `;
      result += `<span style="color:${colorForType(propMatch[2])}">${propMatch[2]}</span>`;
      if (propMatch[3]) result += `<span style="color:${COLORS.typeInteger}">[]</span>`;
      if (propMatch[4]) result += ` <span style="color:${COLORS.propName}">${propMatch[4]}</span>`;
      if (propMatch[5]) result += ` <span style="color:${COLORS.optional}">optional</span>`;
      return result;
    }

    // Enum value: o ValueName
    const enumValMatch = trimmed.match(/^(o)\s+(\w+)$/);
    if (enumValMatch) {
      let result = getIndent(line);
      result += `<span style="color:${COLORS.o}">o</span> `;
      result += `<span style="color:${COLORS.enumValue}">${enumValMatch[2]}</span>`;
      return result;
    }

    // Map field: o Type (no name)
    const mapFieldMatch = trimmed.match(/^(o)\s+(\w+)$/);
    if (mapFieldMatch) {
      let result = getIndent(line);
      result += `<span style="color:${COLORS.o}">o</span> `;
      result += `<span style="color:${colorForType(mapFieldMatch[2])}">${mapFieldMatch[2]}</span>`;
      return result;
    }

    return esc(line);
  }).join('\n');
}

function colorForType(type: string): string {
  switch (type) {
    case 'String': return COLORS.typePrimitive;
    case 'Integer': case 'Long': case 'Double': return COLORS.typeInteger;
    case 'Boolean': return COLORS.typeBoolean;
    case 'DateTime': return COLORS.typeDateTime;
    default: return COLORS.typeCustom;
  }
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getIndent(line: string): string {
  const match = line.match(/^(\s*)/);
  return match ? match[1] : '';
}

export function CtoEditor({ value, onChange }: CtoEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  return (
    <div style={containerStyle}>
      {/* Highlighted layer (behind) */}
      <pre
        ref={preRef}
        style={preStyle}
        dangerouslySetInnerHTML={{ __html: highlightCto(value) + '\n' }}
      />
      {/* Editable textarea (on top, transparent text) */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        style={textareaStyle}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />
    </div>
  );
}

const font = "'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Consolas', monospace";

const containerStyle: React.CSSProperties = {
  position: 'relative',
  flex: 1,
  overflow: 'hidden',
};

const sharedStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  padding: 16,
  fontFamily: font,
  fontSize: 13,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
  overflowWrap: 'break-word',
  tabSize: 2,
  margin: 0,
  border: 'none',
  outline: 'none',
};

const preStyle: React.CSSProperties = {
  ...sharedStyle,
  background: '#1a202c',
  color: '#e2e8f0',
  overflow: 'hidden',
  pointerEvents: 'none',
};

const textareaStyle: React.CSSProperties = {
  ...sharedStyle,
  background: 'transparent',
  color: 'transparent',
  caretColor: '#e2e8f0',
  resize: 'none',
  overflow: 'auto',
  zIndex: 1,
};
