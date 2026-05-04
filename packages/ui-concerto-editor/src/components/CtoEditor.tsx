import { useRef, useCallback } from 'react';

interface CtoEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  error?: string | null;
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
  try {
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

    // Decorator
    const decoMatch = trimmed.match(/^(@\w+(?:\([^)]*\))?)$/);
    if (decoMatch) {
      return `${getIndent(line)}<span style="color:#fbb6ce">${esc(decoMatch[1])}</span>`;
    }

    // Scalar
    const scalarMatch = trimmed.match(/^(scalar)\s+(\w+)\s+(extends)\s+(\w+)(.*)$/);
    if (scalarMatch) {
      let result = getIndent(line);
      result += `<span style="color:${COLORS.keyword}">scalar</span> `;
      result += `<span style="color:${COLORS.identifier};font-weight:700">${scalarMatch[2]}</span> `;
      result += `<span style="color:${COLORS.extends}">extends</span> `;
      result += `<span style="color:${colorForType(scalarMatch[4])}">${scalarMatch[4]}</span>`;
      if (scalarMatch[5]) result += `<span style="color:${COLORS.optional}">${esc(scalarMatch[5])}</span>`;
      return result;
    }

    // Declaration line
    const declMatch = trimmed.match(
      /^(abstract\s+)?(concept|enum|asset|participant|event|transaction|map)\s+(\w+)(.*?)\s*(\{)?$/
    );
    if (declMatch) {
      let result = getIndent(line);
      if (declMatch[1]) result += `<span style="color:${COLORS.abstract}">abstract</span> `;
      result += `<span style="color:${COLORS.keyword}">${declMatch[2]}</span> `;
      result += `<span style="color:${COLORS.identifier};font-weight:700">${declMatch[3]}</span>`;
      const rest = declMatch[4] || '';
      // Escape first, then inject styled spans via regex replace. This preserves
      // partial text during typing (e.g. "identi" before full "identified") instead
      // of dropping unmatched portions from the highlighted output.
      let styledRest = esc(rest);
      styledRest = styledRest.replace(
        /(identified\s+by)\s+(\w+)/,
        `<span style="color:#68d391">$1</span> <span style="color:${COLORS.propName}">$2</span>`
      );
      if (!/identified\s+by/.test(rest)) {
        styledRest = styledRest.replace(
          /\bidentified\b/,
          `<span style="color:#68d391">identified</span>`
        );
      }
      styledRest = styledRest.replace(
        /(extends)\s+(\w+)/,
        `<span style="color:${COLORS.extends}">$1</span> <span style="color:${COLORS.identifier}">$2</span>`
      );
      result += styledRest;
      if (declMatch[5]) result += ` <span style="color:${COLORS.brace}">{</span>`;
      return result;
    }

    // Braces
    if (trimmed === '{') return `${getIndent(line)}<span style="color:${COLORS.brace}">{</span>`;
    if (trimmed === '}') return `${getIndent(line)}<span style="color:${COLORS.brace}">}</span>`;

    // Relationship: --> Type[] name ...
    const relMatch = trimmed.match(/^(-->)\s+(\w+)(\[\])?\s+(\w+)(.*?)$/);
    if (relMatch) {
      let result = getIndent(line);
      result += `<span style="color:${COLORS.relationship};font-weight:700">--&gt;</span> `;
      result += `<span style="color:${colorForType(relMatch[2])}">${relMatch[2]}</span>`;
      if (relMatch[3]) result += `<span style="color:${COLORS.typeInteger}">[]</span>`;
      result += ` <span style="color:${COLORS.propName}">${relMatch[4]}</span>`;
      if (relMatch[5]) result += highlightModifiers(relMatch[5]);
      return result;
    }

    // Property: o Type[] name ...
    const propMatch = trimmed.match(/^(o)\s+(\w+)(\[\])?\s+(\w+)(.*?)$/);
    if (propMatch) {
      let result = getIndent(line);
      result += `<span style="color:${COLORS.o}">o</span> `;
      result += `<span style="color:${colorForType(propMatch[2])}">${propMatch[2]}</span>`;
      if (propMatch[3]) result += `<span style="color:${COLORS.typeInteger}">[]</span>`;
      result += ` <span style="color:${COLORS.propName}">${propMatch[4]}</span>`;
      if (propMatch[5]) result += highlightModifiers(propMatch[5]);
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
  } catch {
    return esc(cto);
  }
}

function highlightModifiers(str: string): string {
  let result = str;
  result = result.replace(/\boptional\b/g, `<span style="color:${COLORS.optional}">optional</span>`);
  result = result.replace(/\bdefault\s*=\s*("(?:[^"\\]|\\.)*"|\S+)/g, `<span style="color:${COLORS.optional}">default=$1</span>`);
  result = result.replace(/\bregex\s*=\s*(\/[^/]*\/)/g, `<span style="color:${COLORS.optional}">regex=$1</span>`);
  result = result.replace(/\brange\s*=\s*(\[[^\]]*\])/g, `<span style="color:${COLORS.optional}">range=$1</span>`);
  result = result.replace(/\blength\s*=\s*(\[[^\]]*\])/g, `<span style="color:${COLORS.optional}">length=$1</span>`);
  return result;
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

export function CtoEditor({ value, onChange, readOnly = false, error = null }: CtoEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const ta = e.currentTarget;
    const { selectionStart: start, selectionEnd: end, value: v } = ta;
    const INDENT = '  '; // 2 spaces, matches tabSize

    // Multi-line selection: indent / dedent each line
    if (start !== end && v.slice(start, end).includes('\n')) {
      const lineStart = v.lastIndexOf('\n', start - 1) + 1;
      const block = v.slice(lineStart, end);
      const lines = block.split('\n');
      const transformed = e.shiftKey
        ? lines.map((l) => l.startsWith(INDENT) ? l.slice(INDENT.length) : l.replace(/^\t/, ''))
        : lines.map((l) => INDENT + l);
      const newBlock = transformed.join('\n');
      const newValue = v.slice(0, lineStart) + newBlock + v.slice(end);
      const diff = newBlock.length - block.length;
      onChange(newValue);
      requestAnimationFrame(() => {
        ta.selectionStart = start + (e.shiftKey ? -INDENT.length : INDENT.length);
        ta.selectionEnd = end + diff;
      });
      return;
    }

    // Single caret / single-line selection: insert / remove indent at caret
    if (e.shiftKey) {
      const lineStart = v.lastIndexOf('\n', start - 1) + 1;
      const lineText = v.slice(lineStart, start);
      if (lineText.startsWith(INDENT)) {
        const newValue = v.slice(0, lineStart) + lineText.slice(INDENT.length) + v.slice(start);
        onChange(newValue);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start - INDENT.length;
        });
      }
      return;
    }
    const newValue = v.slice(0, start) + INDENT + v.slice(end);
    onChange(newValue);
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + INDENT.length;
    });
  }, [onChange]);

  return (
    <div style={containerStyle}>
      <style>{`
        .cto-editor-textarea::selection {
          background: rgba(99, 179, 237, 0.25);
          color: transparent;
        }
      `}</style>
      {/* Highlighted layer (behind) */}
      <pre
        ref={preRef}
        style={preStyle}
        dangerouslySetInnerHTML={{ __html: highlightCto(value) + '\n' }}
      />
      {/* Editable textarea (on top, transparent text) */}
      <textarea
        ref={textareaRef}
        className="cto-editor-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={handleScroll}
        style={textareaStyle}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        readOnly={readOnly}
      />
      {error && (
        <div style={errorBannerStyle} title={error}>
          <span style={{ fontWeight: 700, marginRight: 6 }}>!</span>
          {error.length > 120 ? error.slice(0, 120) + '...' : error}
        </div>
      )}
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
  overflow: 'auto',
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

const errorBannerStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 12,
  left: 12,
  right: 12,
  padding: '8px 12px',
  background: 'rgba(254, 178, 178, 0.12)',
  border: '1px solid #fc8181',
  borderRadius: 6,
  color: '#fc8181',
  fontFamily: font,
  fontSize: 11,
  lineHeight: 1.4,
  zIndex: 2,
  pointerEvents: 'auto',
  cursor: 'help',
  maxHeight: 80,
  overflow: 'hidden',
};
