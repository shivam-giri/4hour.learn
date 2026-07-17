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

  // Build adjacency for levels
  const childMap = {};
  const parentCount = {};
  rawNodes.forEach((n) => { childMap[n.id] = []; parentCount[n.id] = 0; });
  rawEdges.forEach((e) => {
    childMap[e.source]?.push(e.target);
    if (parentCount[e.target] !== undefined) parentCount[e.target]++;
  });

  // BFS-based level assignment
  const levels = {};
  const roots = rawNodes.filter((n) => parentCount[n.id] === 0).map((n) => n.id);
  const queue = roots.map((id) => ({ id, level: 0 }));
  const visited = new Set();

  while (queue.length) {
    const { id, level } = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    levels[id] = level;
    (childMap[id] || []).forEach((childId) => {
      if (!visited.has(childId)) queue.push({ id: childId, level: level + 1 });
    });
  }

  // Group by level
  const levelGroups = {};
  rawNodes.forEach((n) => {
    const lvl = levels[n.id] ?? 0;
    if (!levelGroups[lvl]) levelGroups[lvl] = [];
    levelGroups[lvl].push(n.id);
  });

  const NODE_W = 220;
  const NODE_H = 120;
  const H_GAP = 60;
  const V_GAP = 80;

  const positioned = rawNodes.map((n) => {
    const lvl = levels[n.id] ?? 0;
    const group = levelGroups[lvl] || [];
    const idx = group.indexOf(n.id);
    const total = group.length;
    const totalWidth = total * NODE_W + (total - 1) * H_GAP;
    const x = idx * (NODE_W + H_GAP) - totalWidth / 2 + NODE_W / 2;
    const y = lvl * (NODE_H + V_GAP);

    return { ...n, position: { x, y }, type: 'custom' };
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
