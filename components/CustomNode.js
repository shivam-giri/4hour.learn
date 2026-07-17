'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { BookOpen, Code2, Lightbulb, Rocket, Star, Layers } from 'lucide-react';

const TYPE_CONFIG = {
  start:    { color: '#F4B7E2', bg: 'rgba(244,183,226,0.1)', icon: Star,      label: 'Start'    },
  concept:  { color: '#C084FC', bg: 'rgba(192,132,252,0.1)', icon: Lightbulb, label: 'Concept'  },
  skill:    { color: '#7DD3FC', bg: 'rgba(125,211,252,0.1)', icon: Code2,     label: 'Skill'    },
  project:  { color: '#34D399', bg: 'rgba(52,211,153,0.1)',  icon: Rocket,    label: 'Project'  },
  theory:   { color: '#FBBF24', bg: 'rgba(251,191,36,0.1)',  icon: BookOpen,  label: 'Theory'   },
  advanced: { color: '#F87171', bg: 'rgba(248,113,113,0.1)', icon: Layers,    label: 'Advanced' },
};

const CustomNode = memo(function CustomNode({ data, selected }) {
  const cfg  = TYPE_CONFIG[data.type] || TYPE_CONFIG.concept;
  const Icon = cfg.icon;

  return (
    <>
      <Handle type="target" position={Position.Top}
        style={{ background: cfg.color, border: 'none', width: 8, height: 8 }} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.06 }}
        style={{
          background: selected ? `${cfg.bg}` : cfg.bg,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1.5px solid ${selected ? cfg.color : `${cfg.color}60`}`,
          borderRadius: 16,
          padding: '14px 18px',
          minWidth: 155,
          maxWidth: 200,
          boxShadow: selected
            ? `0 0 25px ${cfg.color}45, 0 0 50px ${cfg.color}20`
            : '0 4px 20px rgba(0,0,0,0.35)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* Type badge */}
        <div style={{
          position: 'absolute', top: -10, left: 12,
          background: cfg.color, color: '#08080f',
          fontSize: '0.65rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif',
          padding: '2px 8px', borderRadius: 999,
        }}>{cfg.label}</div>

        {/* Icon + label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: `${cfg.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={15} style={{ color: cfg.color }} />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#ffffff', lineHeight: 1.3, maxWidth: 110 }}>
            {data.label}
          </span>
        </div>

        {/* Description preview */}
        {data.description && (
          <p style={{ margin: '8px 0 0', fontSize: '0.72rem', color: 'var(--clr-muted)', lineHeight: 1.5, overflow: 'hidden', maxHeight: 40 }}>
            {data.description?.slice(0, 75)}…
          </p>
        )}

        <p style={{ margin: '6px 0 0', fontSize: '0.68rem', color: 'var(--clr-primary)', fontWeight: 500 }}>
          Click to open lesson →
        </p>
      </motion.div>

      <Handle type="source" position={Position.Bottom}
        style={{ background: cfg.color, border: 'none', width: 8, height: 8 }} />
    </>
  );
});

export default CustomNode;
