import { useCallback, useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type NodeTypes,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ConceptNode } from './ConceptNode';
import { EnumNode } from './EnumNode';
import { MapNode } from './MapNode';
import { ScalarNode } from './ScalarNode';
import { Toolbar } from './Toolbar';
import { parseCto, declarationsToGraph, validateCto } from '../utils/ctoToGraph';
import { declarationsToCto } from '../utils/graphToCto';
import type { Declaration, ConcertoModel } from '../utils/types';

const nodeTypes: NodeTypes = {
  conceptNode: ConceptNode,
  enumNode: EnumNode,
  mapNode: MapNode,
  scalarNode: ScalarNode,
};

interface ConcertoGraphEditorProps {
  cto: string;
  onModelChange?: (cto: string) => void;
  showText: boolean;
  onToggleText: () => void;
  onImport: () => void;
  onExport: () => void;
}

interface HistoryEntry {
  model: ConcertoModel;
  nodes: Node[];
  edges: Edge[];
}

const MAX_HISTORY = 50;

export function ConcertoGraphEditor({ cto, onModelChange, showText, onToggleText, onImport, onExport }: ConcertoGraphEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [error, setError] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [model, setModelState] = useState<ConcertoModel>({ namespace: 'org.example@1.0.0', imports: [], declarations: [] });
  const modelRef = useRef(model);
  const setModel = useCallback((m: ConcertoModel) => { modelRef.current = m; setModelState(m); }, []);
  const [activeDialog, setActiveDialog] = useState<{ type: 'property' | 'enum-value' | 'inheritance'; declName: string } | null>(null);
  const [connectDialog, setConnectDialog] = useState<{ sourceId: string; targetId: string } | null>(null);
  const updatingFromGraph = useRef(false);

  // Undo/Redo history
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedo = useRef(false);

  // Store current node positions so we can preserve them
  const nodePositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Keep positions ref in sync when nodes move (drag)
  useEffect(() => {
    for (const node of nodes) {
      nodePositionsRef.current.set(node.id, { ...node.position });
    }
  }, [nodes]);

  const pushHistory = useCallback((entry: HistoryEntry) => {
    setHistory((prev) => {
      const truncated = prev.slice(0, historyIndex + 1);
      const next = [...truncated, entry];
      if (next.length > MAX_HISTORY) next.shift();
      return next;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [historyIndex]);

  // CTO → Graph
  useEffect(() => {
    if (updatingFromGraph.current) {
      updatingFromGraph.current = false;
      return;
    }
    try {
      const parsed = parseCto(cto);
      setModel(parsed);
      const graph = declarationsToGraph(parsed.declarations);
      // Preserve existing positions for nodes that already exist
      const nodesWithPositions = graph.nodes.map((node) => {
        const savedPos = nodePositionsRef.current.get(node.id);
        return savedPos ? { ...node, position: savedPos } : node;
      });
      setNodes(nodesWithPositions);
      setEdges(graph.edges);
      setError(null);
      // Validate with ModelManager (non-blocking)
      const validation = validateCto(cto);
      setValidationWarning(validation);
      if (!isUndoRedo.current) {
        pushHistory({ model: parsed, nodes: nodesWithPositions, edges: graph.edges });
      }
      isUndoRedo.current = false;
    } catch (e: any) {
      setError(e.message || 'Failed to parse CTO');
    }
  }, [cto, setNodes, setEdges]);

  // Graph → CTO (preserves node positions)
  const updateModelAndSync = useCallback((newDeclarations: Declaration[]) => {
    const cur = modelRef.current;
    const newModel = { ...cur, declarations: newDeclarations };
    const newCto = declarationsToCto(newModel);
    // Validate with ModelManager before applying
    const validation = validateCto(newCto);
    setValidationWarning(validation);
    setModel(newModel);
    const graph = declarationsToGraph(newDeclarations);
    const nodesWithPositions = graph.nodes.map((node) => {
      const savedPos = nodePositionsRef.current.get(node.id);
      return savedPos ? { ...node, position: savedPos } : node;
    });
    setNodes(nodesWithPositions);
    setEdges(graph.edges);
    pushHistory({ model: newModel, nodes: nodesWithPositions, edges: graph.edges });
    updatingFromGraph.current = true;
    onModelChange?.(newCto);
  }, [setModel, setNodes, setEdges, onModelChange, pushHistory]);

  // --- Operations ---

  const handleAddDeclaration = useCallback((decl: Declaration) => {
    updateModelAndSync([...modelRef.current.declarations, decl]);
  }, [updateModelAndSync]);

  const handleDeleteDeclaration = useCallback((declName: string) => {
    updateModelAndSync(modelRef.current.declarations.filter((d) => d.name !== declName));
  }, [updateModelAndSync]);

  const handleToggleAbstract = useCallback((declName: string) => {
    updateModelAndSync(
      modelRef.current.declarations.map((d) => d.name === declName ? { ...d, isAbstract: !d.isAbstract } : d)
    );
  }, [updateModelAndSync]);

  const handleAddProperty = useCallback((declName: string, propName: string, propType: string, isOptional: boolean, isArray: boolean, isRelationship: boolean) => {
    updateModelAndSync(
      modelRef.current.declarations.map((d) =>
        d.name === declName
          ? { ...d, properties: [...d.properties, { name: propName, type: propType, isOptional, isArray, isRelationship, validators: {} }] }
          : d
      )
    );
  }, [updateModelAndSync]);

  const handleDeleteProperty = useCallback((declName: string, propName: string) => {
    updateModelAndSync(
      modelRef.current.declarations.map((d) =>
        d.name === declName
          ? { ...d, properties: d.properties.filter((p) => p.name !== propName) }
          : d
      )
    );
  }, [updateModelAndSync]);

  const handleAddEnumValue = useCallback((declName: string, value: string) => {
    updateModelAndSync(
      modelRef.current.declarations.map((d) =>
        d.name === declName ? { ...d, enumValues: [...d.enumValues, value] } : d
      )
    );
  }, [updateModelAndSync]);

  const handleDeleteEnumValue = useCallback((declName: string, value: string) => {
    updateModelAndSync(
      modelRef.current.declarations.map((d) =>
        d.name === declName ? { ...d, enumValues: d.enumValues.filter((v) => v !== value) } : d
      )
    );
  }, [updateModelAndSync]);

  const handleSetSuperType = useCallback((declName: string, superType: string | undefined) => {
    updateModelAndSync(
      modelRef.current.declarations.map((d) => d.name === declName ? { ...d, superType } : d)
    );
  }, [updateModelAndSync]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const entry = history[newIndex];
    isUndoRedo.current = true;
    setHistoryIndex(newIndex);
    setModel(entry.model);
    setNodes(entry.nodes);
    setEdges(entry.edges);
    // Restore positions from history
    for (const node of entry.nodes) {
      nodePositionsRef.current.set(node.id, { ...node.position });
    }
    updatingFromGraph.current = true;
    onModelChange?.(declarationsToCto(entry.model));
  }, [history, historyIndex, setNodes, setEdges, onModelChange]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const entry = history[newIndex];
    isUndoRedo.current = true;
    setHistoryIndex(newIndex);
    setModel(entry.model);
    setNodes(entry.nodes);
    setEdges(entry.edges);
    for (const node of entry.nodes) {
      nodePositionsRef.current.set(node.id, { ...node.position });
    }
    updatingFromGraph.current = true;
    onModelChange?.(declarationsToCto(entry.model));
  }, [history, historyIndex, setNodes, setEdges, onModelChange]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleUndo, handleRedo]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Save position after drag as a history entry
  const onNodeDragStop = useCallback((_event: React.MouseEvent, _node: Node) => {
    const currentNodes = nodes.map((n) => {
      const pos = nodePositionsRef.current.get(n.id);
      return pos ? { ...n, position: pos } : n;
    });
    pushHistory({ model: modelRef.current, nodes: currentNodes, edges });
  }, [nodes, edges, pushHistory]);

  // Drag edge between nodes → open connect dialog
  const onConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target && connection.source !== connection.target) {
      setConnectDialog({ sourceId: connection.source, targetId: connection.target });
    }
  }, []);

  const handleConnectSubmit = useCallback((connType: 'property' | 'relationship' | 'extends', propName: string) => {
    if (!connectDialog) return;
    const { sourceId, targetId } = connectDialog;
    if (connType === 'extends') {
      handleSetSuperType(sourceId, targetId);
    } else {
      handleAddProperty(sourceId, propName, targetId, false, false, connType === 'relationship');
    }
    setConnectDialog(null);
  }, [connectDialog, handleSetSuperType, handleAddProperty]);

  // Inject callbacks into nodes
  const nodesWithCallbacks = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onAddProperty: (declName: string) => setActiveDialog({ type: 'property', declName }),
      onDeleteProperty: handleDeleteProperty,
      onDeleteDeclaration: handleDeleteDeclaration,
      onToggleAbstract: handleToggleAbstract,
      onSetInheritance: (declName: string) => setActiveDialog({ type: 'inheritance', declName }),
      onAddEnumValue: (declName: string) => setActiveDialog({ type: 'enum-value', declName }),
      onDeleteEnumValue: handleDeleteEnumValue,
    },
  }));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        declarations={model.declarations}
        onAddDeclaration={handleAddDeclaration}
        onAddProperty={handleAddProperty}
        onAddEnumValue={handleAddEnumValue}
        onSetSuperType={handleSetSuperType}
        activeDialog={activeDialog}
        onCloseDialog={() => setActiveDialog(null)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        showText={showText}
        onToggleText={onToggleText}
        onImport={onImport}
        onExport={onExport}
      />
      <div style={{ flex: 1, position: 'relative' }}>
        {error && <div style={errorStyle}>Parse error: {error}</div>}
        {!error && validationWarning && <div style={warningStyle}>Validation: {validationWarning}</div>}
        <ReactFlow<Node, Edge>
          nodes={nodesWithCallbacks}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          style={{ background: '#1a202c' }}
          connectionLineStyle={{ stroke: '#63b3ed', strokeWidth: 2 }}
          minZoom={0.05}
          maxZoom={4}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} color="#4a5568" gap={20} size={1} />
        </ReactFlow>

        {connectDialog && (
          <ConnectEdgeDialog
            sourceId={connectDialog.sourceId}
            targetId={connectDialog.targetId}
            onSubmit={handleConnectSubmit}
            onClose={() => setConnectDialog(null)}
          />
        )}
      </div>
    </div>
  );
}

function ConnectEdgeDialog({ sourceId, targetId, onSubmit, onClose }: {
  sourceId: string;
  targetId: string;
  onSubmit: (type: 'property' | 'relationship' | 'extends', name: string) => void;
  onClose: () => void;
}) {
  const [connType, setConnType] = useState<'property' | 'relationship' | 'extends'>('property');
  const [propName, setPropName] = useState('');

  const handleSubmit = () => {
    if (connType === 'extends') {
      onSubmit('extends', '');
    } else {
      if (!propName.trim()) return;
      onSubmit(connType, propName.trim());
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 4px', color: '#e2e8f0', fontSize: 14 }}>
          Connect: {sourceId} &rarr; {targetId}
        </h3>
        <p style={{ margin: '0 0 12px', color: '#a0aec0', fontSize: 12 }}>
          How should these be related?
        </p>

        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <button onClick={() => setConnType('property')}
            style={{ ...typeBtnStyle, background: connType === 'property' ? '#3182ce' : '#4a5568' }}>
            Property (o)
          </button>
          <button onClick={() => setConnType('relationship')}
            style={{ ...typeBtnStyle, background: connType === 'relationship' ? '#e53e3e' : '#4a5568' }}>
            Relationship (&rarr;)
          </button>
          <button onClick={() => setConnType('extends')}
            style={{ ...typeBtnStyle, background: connType === 'extends' ? '#805ad5' : '#4a5568' }}>
            Extends
          </button>
        </div>

        {connType !== 'extends' && (
          <input
            value={propName}
            onChange={(e) => setPropName(e.target.value)}
            placeholder={`Property name (e.g. my${targetId})`}
            style={inputStyle}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={handleSubmit} style={{
            ...typeBtnStyle,
            background: connType === 'property' ? '#3182ce' : connType === 'relationship' ? '#e53e3e' : '#805ad5',
          }}>
            Connect
          </button>
          <button onClick={onClose} style={typeBtnStyle}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const errorStyle: React.CSSProperties = {
  position: 'absolute', top: 8, left: 8, right: 8, zIndex: 10,
  background: '#fc8181', color: '#1a202c', padding: '8px 12px',
  borderRadius: 6, fontSize: 12, fontWeight: 600,
};

const warningStyle: React.CSSProperties = {
  position: 'absolute', top: 8, left: 8, right: 8, zIndex: 10,
  background: '#ecc94b', color: '#1a202c', padding: '8px 12px',
  borderRadius: 6, fontSize: 12, fontWeight: 600,
};

const overlayStyle: React.CSSProperties = {
  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', zIndex: 20,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const dialogStyle: React.CSSProperties = {
  background: '#2d3748', borderRadius: 12, padding: 24, minWidth: 360,
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '1px solid #4a5568',
};

const typeBtnStyle: React.CSSProperties = {
  background: '#4a5568', color: '#e2e8f0', border: 'none', borderRadius: 6,
  padding: '8px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600,
  transition: 'background 0.15s',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', background: '#1a202c', color: '#e2e8f0',
  border: '1px solid #4a5568', borderRadius: 6, fontSize: 13,
  outline: 'none', boxSizing: 'border-box',
};

