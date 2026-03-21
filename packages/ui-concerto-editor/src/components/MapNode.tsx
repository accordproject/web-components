import { Handle, Position } from '@xyflow/react';
import type { Declaration } from '../utils/types';

interface MapNodeData {
  label: string;
  declaration: Declaration;
  onDeleteDeclaration?: (declName: string) => void;
}

export function MapNode({ data, selected }: { data: MapNodeData; selected?: boolean }) {
  const { declaration } = data;
  const map = declaration.mapDeclaration;

  return (
    <div style={{
      background: '#1e2533',
      borderRadius: 12,
      border: `2px solid ${selected ? '#fff' : '#38b2ac66'}`,
      minWidth: 210,
      boxShadow: selected
        ? '0 0 20px #38b2ac44, 0 8px 24px rgba(0,0,0,0.4)'
        : '0 4px 16px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}>
      <Handle type="target" position={Position.Top} id="top" style={handleStyle} />
      <Handle type="target" position={Position.Left} id="left" style={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" style={handleStyle} />

      <div style={{
        padding: '12px 14px 10px',
        background: 'linear-gradient(135deg, #234e52, #234e52cc)',
        borderBottom: '1px solid #38b2ac33',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: '#81e6d9', fontWeight: 700 }}>
            map
          </span>
          <button onClick={() => data.onDeleteDeclaration?.(declaration.name)}
            style={{ background: 'none', border: 'none', color: '#ffffff55', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0 }}>
            &times;
          </button>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4, color: '#b2f5ea' }}>
          {declaration.name}
        </div>
      </div>

      <div style={{ padding: '6px 6px 8px' }}>
        {map && (
          <>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '5px 8px', margin: '2px 0', background: '#161b27', borderRadius: 6,
            }}>
              <span style={{ fontSize: 10, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Key</span>
              <span style={{ fontSize: 12, color: '#81e6d9', fontFamily: 'monospace', fontWeight: 600 }}>{map.keyType}</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '5px 8px', margin: '2px 0', background: '#161b27', borderRadius: 6,
            }}>
              <span style={{ fontSize: 10, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Value</span>
              <span style={{ fontSize: 12, color: '#81e6d9', fontFamily: 'monospace', fontWeight: 600 }}>{map.valueType}</span>
            </div>
          </>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} id="bottom" style={handleStyle} />
    </div>
  );
}

const handleStyle: React.CSSProperties = {
  width: 10, height: 10, background: '#38b2ac', borderRadius: '50%', border: '2px solid #1e2533',
};
