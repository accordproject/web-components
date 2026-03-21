import { useState } from 'react';
import type { Declaration, MapDeclaration } from '../utils/types';
import { DECLARATION_TYPES, ALL_TYPES } from '../utils/types';

interface ToolbarProps {
  declarations: Declaration[];
  onAddDeclaration: (decl: Declaration) => void;
  onAddProperty: (declName: string, propName: string, propType: string, isOptional: boolean, isArray: boolean, isRelationship: boolean) => void;
  onAddEnumValue: (declName: string, value: string) => void;
  onSetSuperType: (declName: string, superType: string | undefined) => void;
  activeDialog: { type: 'property' | 'enum-value' | 'inheritance'; declName: string } | null;
  onCloseDialog: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showText: boolean;
  onToggleText: () => void;
  onImport: () => void;
  onExport: () => void;
}

export function Toolbar({ declarations, onAddDeclaration, onAddProperty, onAddEnumValue, onSetSuperType, activeDialog, onCloseDialog, onUndo, onRedo, canUndo, canRedo, showText, onToggleText, onImport, onExport }: ToolbarProps) {
  const [showAddDecl, setShowAddDecl] = useState(false);

  return (
    <div style={toolbarStyle}>
      {/* Left group: CTO toggle, file ops */}
      <button onClick={onToggleText}
        style={{ ...pillBtn, background: showText ? '#3182ce' : '#4a5568' }}
        title={showText ? 'Hide CTO text' : 'Show CTO text'}>
        {showText ? '\u25C0 CTO' : '\u25B6 CTO'}
      </button>
      <button onClick={onImport} style={pillBtn}>Import</button>
      <button onClick={onExport} style={pillBtn}>Export</button>

      <div style={sep} />

      {/* Middle group: editing tools */}
      <button onClick={() => setShowAddDecl(true)} style={{ ...pillBtn, background: '#3182ce' }}>+ Add</button>

      <div style={sep} />

      <button onClick={onUndo} disabled={!canUndo}
        style={{ ...arrowBtn, opacity: canUndo ? 1 : 0.25 }}
        title="Undo (Ctrl+Z)">
        \u21A9
      </button>
      <button onClick={onRedo} disabled={!canRedo}
        style={{ ...arrowBtn, opacity: canRedo ? 1 : 0.25 }}
        title="Redo (Ctrl+Shift+Z)">
        \u21AA
      </button>

      {/* Right group: legend */}
      <div style={legendStyle}>
        <span style={legendItem}><span style={{ ...dot, background: '#63b3ed' }} />property</span>
        <span style={legendItem}><span style={{ ...dot, background: '#fc8181' }} />relationship</span>
        <span style={legendItem}><span style={{ ...dot, background: '#b794f4' }} />extends</span>
      </div>

      {showAddDecl && (
        <AddDeclarationDialog
          declarations={declarations}
          onAdd={(decl) => { onAddDeclaration(decl); setShowAddDecl(false); }}
          onClose={() => setShowAddDecl(false)}
        />
      )}

      {activeDialog?.type === 'property' && (
        <AddPropertyDialog
          declName={activeDialog.declName}
          declarations={declarations}
          onAdd={(propName, propType, isOptional, isArray, isRelationship) => {
            onAddProperty(activeDialog.declName, propName, propType, isOptional, isArray, isRelationship);
            onCloseDialog();
          }}
          onClose={onCloseDialog}
        />
      )}

      {activeDialog?.type === 'enum-value' && (
        <AddEnumValueDialog
          declName={activeDialog.declName}
          onAdd={(value) => { onAddEnumValue(activeDialog.declName, value); onCloseDialog(); }}
          onClose={onCloseDialog}
        />
      )}

      {activeDialog?.type === 'inheritance' && (
        <SetInheritanceDialog
          declName={activeDialog.declName}
          declarations={declarations}
          onSet={(superType) => { onSetSuperType(activeDialog.declName, superType); onCloseDialog(); }}
          onClose={onCloseDialog}
        />
      )}
    </div>
  );
}

function AddDeclarationDialog({ declarations, onAdd, onClose }: {
  declarations: Declaration[];
  onAdd: (decl: Declaration) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Declaration['type']>('concept');
  const [mapKeyType, setMapKeyType] = useState('String');
  const [mapValueType, setMapValueType] = useState('String');

  const allTypeOptions = [...ALL_TYPES, ...declarations.map((d) => d.name)];

  const handleSubmit = () => {
    if (!name.trim()) return;
    const decl: Declaration = {
      name: name.trim(), type, isAbstract: false,
      properties: [], enumValues: [],
    };
    if (type === 'map') {
      decl.mapDeclaration = { keyType: mapKeyType, valueType: mapValueType };
    }
    onAdd(decl);
  };

  return (
    <div style={dialogOverlay} onClick={onClose}>
      <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={dialogTitle}>Add Declaration</h3>
        <select value={type} onChange={(e) => setType(e.target.value as Declaration['type'])} style={inputStyle}>
          {DECLARATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Name (e.g. MyContract)" style={inputStyle} autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        {type === 'map' && (
          <>
            <label style={fieldLabel}>Key Type</label>
            <select value={mapKeyType} onChange={(e) => setMapKeyType(e.target.value)} style={inputStyle}>
              {allTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <label style={fieldLabel}>Value Type</label>
            <select value={mapValueType} onChange={(e) => setMapValueType(e.target.value)} style={inputStyle}>
              {allTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </>
        )}
        <div style={dialogButtons}>
          <button onClick={handleSubmit} style={{ ...btnStyle, background: '#3182ce' }}>Add</button>
          <button onClick={onClose} style={btnStyle}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function AddPropertyDialog({ declName, declarations, onAdd, onClose }: {
  declName: string;
  declarations: Declaration[];
  onAdd: (name: string, type: string, isOptional: boolean, isArray: boolean, isRelationship: boolean) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState('String');
  const [isOptional, setIsOptional] = useState(false);
  const [isArray, setIsArray] = useState(false);
  const [isRelationship, setIsRelationship] = useState(false);

  const availableTypes = [...ALL_TYPES, ...declarations.map((d) => d.name).filter((n) => n !== declName)];

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), type, isOptional, isArray, isRelationship);
  };

  return (
    <div style={dialogOverlay} onClick={onClose}>
      <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={dialogTitle}>Add Property to {declName}</h3>
        <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
          {availableTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Property name" style={inputStyle} autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <label style={checkboxLabel}>
            <input type="checkbox" checked={isOptional} onChange={(e) => setIsOptional(e.target.checked)} /> optional
          </label>
          <label style={checkboxLabel}>
            <input type="checkbox" checked={isArray} onChange={(e) => setIsArray(e.target.checked)} /> array []
          </label>
          <label style={checkboxLabel}>
            <input type="checkbox" checked={isRelationship} onChange={(e) => setIsRelationship(e.target.checked)} />
            relationship (--&gt;)
          </label>
        </div>
        <div style={dialogButtons}>
          <button onClick={handleSubmit} style={{ ...btnStyle, background: '#3182ce' }}>Add</button>
          <button onClick={onClose} style={btnStyle}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function AddEnumValueDialog({ declName, onAdd, onClose }: {
  declName: string;
  onAdd: (value: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState('');
  const handleSubmit = () => { if (value.trim()) onAdd(value.trim()); };

  return (
    <div style={dialogOverlay} onClick={onClose}>
      <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={dialogTitle}>Add Value to {declName}</h3>
        <input value={value} onChange={(e) => setValue(e.target.value)}
          placeholder="Value (e.g. Active)" style={inputStyle} autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <div style={dialogButtons}>
          <button onClick={handleSubmit} style={{ ...btnStyle, background: '#d69e2e' }}>Add</button>
          <button onClick={onClose} style={btnStyle}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function SetInheritanceDialog({ declName, declarations, onSet, onClose }: {
  declName: string;
  declarations: Declaration[];
  onSet: (superType: string | undefined) => void;
  onClose: () => void;
}) {
  const [superType, setSuperType] = useState('');
  const candidates = declarations
    .filter((d) => d.name !== declName && d.type !== 'enum' && d.type !== 'map')
    .map((d) => d.name);

  return (
    <div style={dialogOverlay} onClick={onClose}>
      <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={dialogTitle}>Set Inheritance for {declName}</h3>
        <select value={superType} onChange={(e) => setSuperType(e.target.value)} style={inputStyle}>
          <option value="">None (no inheritance)</option>
          {candidates.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div style={dialogButtons}>
          <button onClick={() => onSet(superType || undefined)} style={{ ...btnStyle, background: '#805ad5' }}>Set</button>
          <button onClick={onClose} style={btnStyle}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// --- Styles ---

const toolbarStyle: React.CSSProperties = {
  padding: '6px 10px', background: '#171d2b', borderBottom: '1px solid #2d3748',
  display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, position: 'relative',
};

const pillBtn: React.CSSProperties = {
  background: '#4a5568', color: '#e2e8f0', border: 'none', borderRadius: 6,
  padding: '5px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 600,
  transition: 'background 0.15s, opacity 0.15s',
};

const btnStyle: React.CSSProperties = {
  background: '#4a5568', color: '#e2e8f0', border: 'none', borderRadius: 6,
  padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600,
};

const arrowBtn: React.CSSProperties = {
  background: '#2d3748', color: '#e2e8f0', border: '1px solid #4a5568',
  borderRadius: 6, padding: '3px 7px', cursor: 'pointer', fontSize: 14,
  lineHeight: 1, transition: 'opacity 0.15s',
};

const sep: React.CSSProperties = {
  width: 1, height: 20, background: '#4a5568', flexShrink: 0,
};

const legendStyle: React.CSSProperties = {
  display: 'flex', gap: 14, marginLeft: 'auto', fontSize: 11, color: '#718096',
};

const legendItem: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 5,
};

const dot: React.CSSProperties = {
  width: 7, height: 7, borderRadius: '50%', display: 'inline-block',
};

const dialogOverlay: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', zIndex: 1000,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const dialogStyle: React.CSSProperties = {
  background: '#2d3748', borderRadius: 8, padding: 20, minWidth: 320,
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '1px solid #4a5568',
};

const dialogTitle: React.CSSProperties = {
  margin: '0 0 12px', color: '#e2e8f0', fontSize: 14,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', background: '#1a202c', color: '#e2e8f0',
  border: '1px solid #4a5568', borderRadius: 4, fontSize: 13, marginTop: 8,
  outline: 'none', boxSizing: 'border-box',
};

const fieldLabel: React.CSSProperties = {
  display: 'block', marginTop: 8, fontSize: 11, color: '#a0aec0',
};

const dialogButtons: React.CSSProperties = {
  display: 'flex', gap: 8, marginTop: 12,
};

const checkboxLabel: React.CSSProperties = {
  color: '#a0aec0', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4,
};
