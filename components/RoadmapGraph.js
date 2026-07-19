'use client';

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import { motion } from 'framer-motion';

const nodeTypes = { custom: CustomNode };

const defaultEdgeOptions = {
  type: 'smoothstep',
  animated: true,
  style: { stroke: 'rgba(244,183,226,0.35)', strokeWidth: 2 },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'rgba(244,183,226,0.5)',
    width: 16,
    height: 16,
  },
};

// Auto-layout helper: arrange nodes in a tree/DAG hierarchy
function layoutNodes(rawNodes, rawEdges) {
  if (!rawNodes.length) return { nodes: rawNodes, edges: rawEdges };

  const NODE_W = 180;
  const NODE_H = 100;
  const H_GAP = 50;
  const V_GAP = 85;
  const COLS = 4;

  const positioned = rawNodes.map((n, idx) => {
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;

    // Calculate row widths to center nodes per row
    const totalInRow = Math.min(rawNodes.length - row * COLS, COLS);
    const rowWidth = totalInRow * NODE_W + (totalInRow - 1) * H_GAP;
    const startX = -rowWidth / 2 + NODE_W / 2;

    const x = startX + col * (NODE_W + H_GAP);
    const y = row * (NODE_H + V_GAP);

    return {
      id: n.id,
      position: { x, y },
      type: 'custom',
      data: {
        label: n.label,
        description: n.description,
        type: n.type
      }
    };
  });

  return { nodes: positioned, edges: rawEdges };
}

export default function RoadmapGraph({ rawNodes = [], rawEdges = [], onNodeClick }) {
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => layoutNodes(rawNodes, rawEdges),
    [rawNodes, rawEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback(
    (_, node) => {
      setNodes((nds) =>
        nds.map((n) => ({ ...n, selected: n.id === node.id }))
      );
      onNodeClick?.(node);
    },
    [onNodeClick, setNodes]
  );

  if (!rawNodes.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[600px] glass rounded-2xl overflow-hidden border border-white/[0.06]"
      id="roadmap-graph"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'transparent' }}
        nodesDraggable={true}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        preventScrolling={true}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(255,255,255,0.04)"
        />
        <Controls />
        <MiniMap
          nodeColor={(n) => {
            const types = {
              start: '#F4B7E2', concept: '#C084FC', skill: '#7DD3FC',
              project: '#34D399', theory: '#FBBF24', advanced: '#F87171',
            };
            return types[n.data?.type] || '#C084FC';
          }}
          maskColor="rgba(8,8,15,0.7)"
          style={{ background: 'rgba(15,15,26,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}
        />
      </ReactFlow>
    </motion.div>
  );
}
