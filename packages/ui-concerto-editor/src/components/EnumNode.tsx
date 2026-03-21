import { Handle, Position } from '@xyflow/react';
import type { Declaration } from '../utils/types';

interface EnumNodeData {
  label: string;
  declaration: Declaration;
  onAddEnumValue?: (declName: string) => void;
  onDeleteEnumValue?: (declName: string, value: string) => void;
  onDeleteDeclaration?: (declName: string) => void;
}

export function EnumNode({ data, selected }: { data: EnumNodeData; selected?: boolean }) {
  const { declaration } = data;

  return (
    <div style={{
      background: '#1e2533',
      borderRadius: 12,
      border: `2px solid ${selected ? '#fff' : '#d69e2e66'}`,
      minWidth: 200,
      boxShadow: selected
        ? '0 0 20px #d69e2e44, 0 8px 24px rgba(0,0,0,0.4)'
        : '0 4px 16px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}>
      <Handle type="target" position={Position.Top} style={handleStyle} />

      {/* Header */}
      <div style={{
        padding: '12px 14px 10px',
        background: 'linear-gradient(135deg, #744210, #744210cc)',
        borderBottom: '1px solid #d69e2e33',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: '#ecc94b', fontWeight: 700 }}>
            enum
          </span>
          <button onClick={() => data.onDeleteDeclaration?.(declaration.name)}
            style={{ background: 'none', border: 'none', color: '#ffffff55', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0 }}>
            &times;
          </button>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4, color: '#fefcbf' }}>
          {declaration.name}
        </div>
      </div>

      {/* Values */}
      <div style={{ padding: '6px 6px 8px' }}>
        {declaration.enumValues.map((val) => (
          <div key={val} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '5px 8px', margin: '2px 0', background: '#161b27', borderRadius: 6,
          }}>
            <span style={{ color: '#fbd38d', fontSize: 12 }}>{val}</span>
            <button onClick={() => data.onDeleteEnumValue?.(declaration.name, val)}
              style={{ background: 'none', border: 'none', color: '#ffffff22', cursor: 'pointer', fontSize: 13, padding: 0, lineHeight: 1 }}>
              &times;
            </button>
          </div>
        ))}
        <button onClick={() => data.onAddEnumValue?.(declaration.name)} style={{
          background: 'transparent', border: '1px dashed #d69e2e44',
          color: '#d69e2eaa', cursor: 'pointer', fontSize: 11, fontWeight: 600,
          padding: '5px 0', marginTop: 4, borderRadius: 6, width: '100%', textAlign: 'center',
        }}>
          + Add Value
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
}

const handleStyle: React.CSSProperties = {
  width: 10, height: 10, background: '#ecc94b', borderRadius: '50%', border: '2px solid #1e2533',
};
