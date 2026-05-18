import { Handle, Position } from '@xyflow/react';
import type { Declaration } from '../utils/types';

interface ScalarNodeData {
  label: string;
  declaration: Declaration;
  onDeleteDeclaration?: (declName: string) => void;
}

export function ScalarNode({ data, selected }: { data: ScalarNodeData; selected?: boolean }) {
  const { declaration } = data;
  const v = declaration.scalarValidators || {};

  return (
    <div style={{
      background: '#1e2533',
      borderRadius: 12,
      border: `2px solid ${selected ? '#fff' : '#ed64a666'}`,
      minWidth: 200,
      boxShadow: selected
        ? '0 0 20px #ed64a644, 0 8px 24px rgba(0,0,0,0.4)'
        : '0 4px 16px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}>
      <Handle type="target" position={Position.Top} style={handleStyle} />

      <div style={{
        padding: '10px 14px',
        background: 'linear-gradient(135deg, #702459, #702459cc)',
        borderBottom: '1px solid #ed64a633',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: '#ed64a6', fontWeight: 700 }}>
            scalar
          </span>
          <button onClick={() => data.onDeleteDeclaration?.(declaration.name)}
            style={{ background: 'none', border: 'none', color: '#ffffff55', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0 }}>
            &times;
          </button>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4, color: '#fbb6ce' }}>
          {declaration.name}
        </div>
        <div style={{ fontSize: 11, color: '#ed64a6', marginTop: 2 }}>
          extends {declaration.scalarExtends || 'String'}
        </div>
      </div>

      <div style={{ padding: '6px 12px 8px' }}>
        {v.default && (
          <div style={detailRow}>
            <span style={detailLabel}>default</span>
            <span style={detailValue}>{v.default}</span>
          </div>
        )}
        {v.regex && (
          <div style={detailRow}>
            <span style={detailLabel}>regex</span>
            <span style={detailValue}>{v.regex}</span>
          </div>
        )}
        {v.range && (
          <div style={detailRow}>
            <span style={detailLabel}>range</span>
            <span style={detailValue}>{v.range}</span>
          </div>
        )}
        {v.length && (
          <div style={detailRow}>
            <span style={detailLabel}>length</span>
            <span style={detailValue}>{v.length}</span>
          </div>
        )}
        {!v.default && !v.regex && !v.range && !v.length && (
          <div style={{ fontSize: 11, color: '#ffffff33', padding: '4px 0', textAlign: 'center', fontStyle: 'italic' }}>
            no constraints
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
}

const handleStyle: React.CSSProperties = {
  width: 10, height: 10, background: '#ed64a6', borderRadius: '50%', border: '2px solid #1e2533',
};

const detailRow: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '4px 8px', margin: '2px 0', background: '#161b27', borderRadius: 6,
};

const detailLabel: React.CSSProperties = {
  fontSize: 10, color: '#a0aec0', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600,
};

const detailValue: React.CSSProperties = {
  fontSize: 11, color: '#fbb6ce', fontFamily: 'monospace',
};
