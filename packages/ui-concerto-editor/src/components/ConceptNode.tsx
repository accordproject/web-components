import { Handle, Position } from '@xyflow/react';
import type { Declaration } from '../utils/types';

const TYPE_COLORS: Record<string, string> = {
  String: '#68d391',
  Integer: '#63b3ed',
  Long: '#63b3ed',
  Double: '#63b3ed',
  Boolean: '#fbd38d',
  DateTime: '#d6bcfa',
};

const DECL_COLORS: Record<string, { bg: string; accent: string }> = {
  concept: { bg: '#2b4acb', accent: '#5a7af5' },
  asset: { bg: '#276749', accent: '#48bb78' },
  participant: { bg: '#6b46c1', accent: '#9f7aea' },
  event: { bg: '#c53030', accent: '#fc8181' },
  transaction: { bg: '#c05621', accent: '#ed8936' },
};

interface ConceptNodeData {
  label: string;
  declaration: Declaration;
  onAddProperty?: (declName: string) => void;
  onDeleteProperty?: (declName: string, propName: string) => void;
  onDeleteDeclaration?: (declName: string) => void;
  onToggleAbstract?: (declName: string) => void;
  onSetInheritance?: (declName: string) => void;
}

export function ConceptNode({ data, selected }: { data: ConceptNodeData; selected?: boolean }) {
  const { declaration } = data;
  const colors = DECL_COLORS[declaration.type] || DECL_COLORS.concept;

  return (
    <div style={{
      background: '#1e2533',
      borderRadius: 12,
      border: `2px solid ${selected ? '#fff' : colors.accent + '66'}`,
      minWidth: 250,
      boxShadow: selected
        ? `0 0 20px ${colors.accent}44, 0 8px 24px rgba(0,0,0,0.4)`
        : '0 4px 16px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}>
      <Handle type="target" position={Position.Top} style={{ ...handleStyle, background: colors.accent }} />

      {/* Header */}
      <div style={{
        padding: '12px 14px 10px',
        background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg}cc)`,
        borderBottom: `1px solid ${colors.accent}33`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase',
              color: colors.accent, fontWeight: 700,
            }}>
              {declaration.type}
            </span>
            {declaration.isAbstract && (
              <span style={{
                fontSize: 8, background: 'rgba(255,255,255,0.15)', color: '#fff',
                padding: '2px 6px', borderRadius: 10, textTransform: 'uppercase',
                letterSpacing: 0.5, cursor: 'pointer',
              }} onClick={() => data.onToggleAbstract?.(declaration.name)} title="Toggle abstract">
                abstract
              </span>
            )}
            {!declaration.isAbstract && (
              <span style={{
                fontSize: 8, background: 'transparent', color: '#ffffff44',
                padding: '2px 6px', borderRadius: 10, border: '1px solid #ffffff22',
                textTransform: 'uppercase', letterSpacing: 0.5, cursor: 'pointer',
              }} onClick={() => data.onToggleAbstract?.(declaration.name)} title="Make abstract">
                concrete
              </span>
            )}
          </div>
          <button onClick={() => data.onDeleteDeclaration?.(declaration.name)}
            style={{ background: 'none', border: 'none', color: '#ffffff55', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0 }}
            title="Delete"
          >
            &times;
          </button>
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginTop: 4 }}>
          {declaration.name}
        </div>
        <div style={{ marginTop: 4 }}>
          {declaration.superType ? (
            <span style={{ fontSize: 11, color: '#d6bcfa', cursor: 'pointer' }}
              onClick={() => data.onSetInheritance?.(declaration.name)} title="Change inheritance">
              extends {declaration.superType}
            </span>
          ) : (
            <button onClick={() => data.onSetInheritance?.(declaration.name)}
              style={{ background: 'none', border: 'none', color: '#ffffff33', cursor: 'pointer', fontSize: 10, padding: 0 }}>
              + set extends
            </button>
          )}
        </div>
      </div>

      {/* Properties */}
      <div style={{ padding: '6px 6px 8px' }}>
        {declaration.properties.map((prop) => (
          <div key={prop.name} style={{
            display: 'flex', alignItems: 'center', padding: '5px 8px', margin: '2px 0',
            background: '#161b27', borderRadius: 6, gap: 8, fontSize: 12,
          }}>
            {prop.isRelationship && (
              <span style={{ color: '#fc8181', fontSize: 10, fontWeight: 700 }}>&#8594;</span>
            )}
            <span style={{
              color: TYPE_COLORS[prop.type] || colors.accent,
              fontFamily: 'monospace', fontSize: 11, fontWeight: 600, flexShrink: 0,
            }}>
              {prop.type}{prop.isArray ? '[]' : ''}
            </span>
            <span style={{ color: '#e2e8f0', flex: 1 }}>{prop.name}</span>
            {prop.isOptional && (
              <span style={{ color: '#fbd38d', fontSize: 9, fontWeight: 700, background: '#fbd38d22', padding: '1px 5px', borderRadius: 4 }}>
                opt
              </span>
            )}
            <button onClick={() => data.onDeleteProperty?.(declaration.name, prop.name)}
              style={{ background: 'none', border: 'none', color: '#ffffff22', cursor: 'pointer', fontSize: 13, padding: 0, lineHeight: 1 }}
              title="Delete property"
            >
              &times;
            </button>
          </div>
        ))}
        {declaration.properties.length === 0 && (
          <div style={{ fontSize: 11, color: '#ffffff33', padding: '8px', textAlign: 'center', fontStyle: 'italic' }}>
            No properties yet
          </div>
        )}
        <button onClick={() => data.onAddProperty?.(declaration.name)} style={{
          background: 'transparent', border: `1px dashed ${colors.accent}44`,
          color: colors.accent + 'aa', cursor: 'pointer', fontSize: 11, fontWeight: 600,
          padding: '5px 0', marginTop: 4, borderRadius: 6, width: '100%', textAlign: 'center',
        }}>
          + Add Property
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ ...handleStyle, background: colors.accent }} />
    </div>
  );
}

const handleStyle: React.CSSProperties = {
  width: 10, height: 10, borderRadius: '50%', border: '2px solid #1e2533',
};
