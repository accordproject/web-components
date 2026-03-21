import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ConceptNode } from './ConceptNode';
import { EnumNode } from './EnumNode';
import { parseCto, declarationsToGraph } from '../utils/ctoToGraph';

const nodeTypes: NodeTypes = {
  conceptNode: ConceptNode,
  enumNode: EnumNode,
};

interface ConcertoGraphEditorProps {
  cto: string;
  onModelChange?: (cto: string) => void;
}

export function ConcertoGraphEditor({ cto }: ConcertoGraphEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const declarations = parseCto(cto);
      const graph = declarationsToGraph(declarations);
      setNodes(graph.nodes);
      setEdges(graph.edges);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to parse CTO');
    }
  }, [cto, setNodes, setEdges]);

  return (
    <div style={{ flex: 1, position: 'relative' }}>
      {error && (
        <div style={errorStyle}>Parse error: {error}</div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        style={{ background: '#1a202c' }}
      >
        <Background variant={BackgroundVariant.Dots} color="#4a5568" gap={20} size={1} />
        <Controls
          style={{ background: '#2d3748', borderColor: '#4a5568' }}
        />
        <MiniMap
          nodeColor={(node) => (node.type === 'enumNode' ? '#d69e2e' : '#3182ce')}
          style={{ background: '#2d3748', border: '1px solid #4a5568' }}
        />
      </ReactFlow>
    </div>
  );
}

const errorStyle: React.CSSProperties = {
  position: 'absolute',
  top: 8,
  left: 8,
  right: 8,
  zIndex: 10,
  background: '#fc8181',
  color: '#1a202c',
  padding: '8px 12px',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
};
