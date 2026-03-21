import { Handle, Position } from '@xyflow/react';

interface Declaration {
  name: string;
  type: string;
  enumValues: string[];
}

export function EnumNode({ data }: { data: { label: string; declaration: Declaration } }) {
  const { declaration } = data;

  return (
    <div style={nodeStyle}>
      <Handle type="target" position={Position.Top} style={handleStyle} />

      {/* Header */}
      <div style={headerStyle}>
        <span style={typeTagStyle}>enum</span>
        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{declaration.name}</div>
      </div>

      {/* Values */}
      <div style={bodyStyle}>
        {declaration.enumValues.map((val) => (
          <div key={val} style={valueStyle}>
            <span style={{ color: '#fbd38d', fontSize: 12 }}>{val}</span>
          </div>
        ))}
      </div>

      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
}

const nodeStyle: React.CSSProperties = {
  background: '#2d3748',
  borderRadius: 8,
  border: '1px solid #d69e2e',
  minWidth: 180,
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  padding: '10px 12px',
  background: '#744210',
  borderBottom: '1px solid #d69e2e',
  color: '#fefcbf',
};

const typeTagStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#fbd38d',
  textTransform: 'uppercase',
  letterSpacing: 1,
};

const bodyStyle: React.CSSProperties = {
  padding: '8px 12px',
};

const valueStyle: React.CSSProperties = {
  padding: '3px 0',
  borderBottom: '1px solid #4a556833',
};

const handleStyle: React.CSSProperties = {
  width: 8,
  height: 8,
  background: '#d69e2e',
};
