import { Handle, Position } from '@xyflow/react';

interface Property {
  name: string;
  type: string;
  isOptional: boolean;
  isArray: boolean;
  isRelationship: boolean;
}

interface Declaration {
  name: string;
  type: string;
  isAbstract: boolean;
  superType?: string;
  properties: Property[];
}

const TYPE_COLORS: Record<string, string> = {
  String: '#48bb78',
  Integer: '#4299e1',
  Long: '#4299e1',
  Double: '#4299e1',
  Boolean: '#ed8936',
  DateTime: '#9f7aea',
};

export function ConceptNode({ data }: { data: { label: string; declaration: Declaration } }) {
  const { declaration } = data;

  return (
    <div style={nodeStyle}>
      <Handle type="target" position={Position.Top} style={handleStyle} />

      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {declaration.isAbstract && <span style={badgeStyle}>abstract</span>}
          <span style={typeTagStyle}>{declaration.type}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{declaration.name}</div>
        {declaration.superType && (
          <div style={{ fontSize: 11, color: '#b794f4', marginTop: 2 }}>
            extends {declaration.superType}
          </div>
        )}
      </div>

      {/* Properties */}
      <div style={bodyStyle}>
        {declaration.properties.map((prop) => (
          <div key={prop.name} style={propStyle}>
            <span style={{ color: TYPE_COLORS[prop.type] || '#63b3ed', fontSize: 11, fontFamily: 'monospace' }}>
              {prop.isRelationship ? '-->' : ''}{prop.type}{prop.isArray ? '[]' : ''}
            </span>
            <span style={{ fontSize: 12, color: '#e2e8f0', marginLeft: 8 }}>
              {prop.name}
            </span>
            {prop.isOptional && <span style={optionalBadge}>?</span>}
          </div>
        ))}
        {declaration.properties.length === 0 && (
          <div style={{ fontSize: 11, color: '#718096', fontStyle: 'italic', padding: '4px 0' }}>
            no properties
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
}

const nodeStyle: React.CSSProperties = {
  background: '#2d3748',
  borderRadius: 8,
  border: '1px solid #4a5568',
  minWidth: 220,
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  padding: '10px 12px',
  background: '#1a202c',
  borderBottom: '1px solid #4a5568',
  color: '#fff',
};

const typeTagStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#a0aec0',
  textTransform: 'uppercase',
  letterSpacing: 1,
};

const badgeStyle: React.CSSProperties = {
  fontSize: 9,
  background: '#805ad5',
  color: '#fff',
  padding: '1px 6px',
  borderRadius: 3,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const bodyStyle: React.CSSProperties = {
  padding: '8px 12px',
};

const propStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '3px 0',
  borderBottom: '1px solid #4a556833',
};

const optionalBadge: React.CSSProperties = {
  fontSize: 10,
  color: '#ed8936',
  marginLeft: 'auto',
  fontWeight: 700,
};

const handleStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  background: '#63b3ed',
};
