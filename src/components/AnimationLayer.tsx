import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface AnimationLayerProps {
  width: number;
  height: number;
  animations?: Animation[];
  className?: string;
}

interface Animation {
  id: string;
  type: 'arrow' | 'circle' | 'highlight' | 'row-operation';
  from?: { row?: number; col?: number; x?: number; y?: number };
  to?: { row?: number; col?: number; x?: number; y?: number };
  duration?: number;
  delay?: number;
  color?: string;
  label?: string;
}

const AnimationLayer: React.FC<AnimationLayerProps> = ({ 
  width, 
  height, 
  animations = [], 
  className 
}) => {
  const getCellPosition = (row?: number, col?: number, cellSize = 64, gap = 12) => {
    if (row === undefined || col === undefined) return { x: 0, y: 0 };
    return {
      x: col * (cellSize + gap) + cellSize / 2 + gap,
      y: row * (cellSize + gap) + cellSize / 2 + gap
    };
  };

  return (
    <svg 
      className={cn("absolute inset-0 pointer-events-none z-30", className)}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ width, height }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#3b82f6"
          />
        </marker>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {animations.map((animation) => {
          const { id, type, from, to, duration = 1, delay = 0, color = '#3b82f6', label } = animation;
          
          if (type === 'arrow' && from && to) {
            const fromPos = getCellPosition(from.row, from.col);
            const toPos = getCellPosition(to.row, to.col);
            
            return (
              <g key={id}>
                <motion.line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke={color}
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                  filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ 
                    duration, 
                    delay,
                    ease: "easeInOut"
                  }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                />
                
                {label && (
                  <motion.text
                    x={(fromPos.x + toPos.x) / 2}
                    y={(fromPos.y + toPos.y) / 2 - 15}
                    textAnchor="middle"
                    fill={color}
                    fontSize="14"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + duration / 2, duration: 0.3 }}
                  >
                    {label}
                  </motion.text>
                )}
              </g>
            );
          }
          
          if (type === 'circle' && from) {
            const pos = getCellPosition(from.row, from.col);
            
            return (
              <g key={id}>
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r="20"
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  filter="url(#glow)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{ 
                    duration: duration * 2,
                    delay,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
                />
                
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r="8"
                  fill={color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: delay + 0.2, duration: 0.3 }}
                  exit={{ scale: 0, transition: { duration: 0.3 } }}
                />
              </g>
            );
          }
          
          if (type === 'highlight' && from) {
            const pos = getCellPosition(from.row, from.col);
            
            return (
              <motion.rect
                key={id}
                x={pos.x - 30}
                y={pos.y - 30}
                width="60"
                height="60"
                rx="8"
                fill={color}
                fillOpacity="0.3"
                stroke={color}
                strokeWidth="2"
                filter="url(#glow)"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: duration * 2,
                  delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.3 } }}
              />
            );
          }
          
          if (type === 'row-operation' && from && to) {
            const fromPos = getCellPosition(from.row, from.col);
            const toPos = getCellPosition(to.row, to.col);
            
            return (
              <g key={id}>
                <motion.path
                  d={`M ${fromPos.x + 40} ${fromPos.y} Q ${fromPos.x + 80} ${fromPos.y} ${toPos.x + 40} ${toPos.y}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                  filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ 
                    duration, 
                    delay,
                    ease: "easeInOut"
                  }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                />
                
                {label && (
                  <motion.text
                    x={fromPos.x + 60}
                    y={fromPos.y - 10}
                    fill={color}
                    fontSize="12"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + duration / 2, duration: 0.3 }}
                  >
                    {label}
                  </motion.text>
                )}
              </g>
            );
          }
          
          return null;
        })}
      </motion.div>
    </svg>
  );
};

export default AnimationLayer;
