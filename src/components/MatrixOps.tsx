
import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function MatrixGrid({ 
  data, 
  highlights, 
  className,
  interactive = false,
  onCellClick,
  animated = true
}: { 
  data: number[][], 
  highlights?: { rows?: number[], cols?: number[], elements?: [number, number][], color?: string, pivot?: [number, number] },
  className?: string;
  interactive?: boolean;
  onCellClick?: (row: number, col: number, value: number) => void;
  animated?: boolean;
}) {
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  
  const highlightColor = highlights?.color || 'bg-blue-50 border-blue-200 text-blue-700';
  const pivotColor = 'bg-yellow-100 border-yellow-300 text-yellow-800';
  
  const handleCellClick = useCallback((r: number, c: number, val: number) => {
    if (interactive && onCellClick) {
      setActiveCell([r, c]);
      onCellClick(r, c, val);
    }
  }, [interactive, onCellClick]);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "grid gap-2 md:gap-3 p-4 md:p-5 border-l-4 border-r-4 border-slate-700 rounded-lg relative bg-white/50",
        "transition-all duration-300",
        className
      )}
      style={{ 
        gridTemplateColumns: `repeat(${data[0]?.length || 1}, minmax(0, 1fr))`,
        maxWidth: '100%'
      }}
    >
      {data.map((row, r) => row.map((val, c) => {
          const isRowHi = highlights?.rows?.includes(r);
          const isColHi = highlights?.cols?.includes(c);
          const isElHi = highlights?.elements?.some(([er, ec]) => er === r && ec === c);
          const isPivot = highlights?.pivot && highlights.pivot[0] === r && highlights.pivot[1] === c;
          const isHovered = hoveredCell && hoveredCell[0] === r && hoveredCell[1] === c;
          const isActive = activeCell && activeCell[0] === r && activeCell[1] === c;
          const isHighlighted = isRowHi || isColHi || isElHi;
          
          return (
            <motion.div
              key={`${r}-${c}`}
              layout={animated}
              initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
              animate={{ 
                scale: isPivot ? 1.15 : isHighlighted ? 1.1 : isHovered ? 1.05 : 1, 
                opacity: 1,
                backgroundColor: isPivot ? undefined : isHighlighted ? undefined : isHovered ? '#f8fafc' : undefined
              }}
              whileHover={interactive ? { scale: 1.05, transition: { duration: 0.2 } } : undefined}
              whileTap={interactive ? { scale: 0.95 } : undefined}
              onHoverStart={() => interactive && setHoveredCell([r, c])}
              onHoverEnd={() => interactive && setHoveredCell(null)}
              onClick={() => handleCellClick(r, c, val)}
              className={cn(
                "aspect-square flex items-center justify-center font-mono font-bold text-sm md:text-lg rounded border transition-all duration-200",
                "relative overflow-hidden",
                isPivot 
                  ? `${pivotColor} shadow-lg ring-2 ring-yellow-300 z-20` 
                  : isHighlighted 
                    ? `${highlightColor} shadow-md z-10` 
                    : isActive
                      ? "bg-blue-100 border-blue-300 text-blue-700 shadow-md z-10"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300",
                interactive && "cursor-pointer hover:shadow-md"
              )}
            >
              {/* Pivot indicator */}
              {isPivot && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 bg-yellow-300 opacity-30 rounded-full"
                />
              )}
              
              {/* Cell value */}
              <span className="relative z-10">
                {typeof val === 'number' ? val.toFixed(2).replace(/\.00$/, '') : val}
              </span>
              
              {/* Hover effect overlay */}
              {isHovered && interactive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-blue-500 opacity-10 rounded"
                />
              )}
            </motion.div>
          );
        }))}
    </motion.div>
  );
}


export function MatrixActionDisplay({ 
  m1, m2, result, operator, highlightIdx 
}: { 
  m1: number[][], 
  m2?: number[][], 
  result: number[][], 
  operator: string,
  highlightIdx?: [number, number]
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full h-full p-4 overflow-x-auto">
      <MatrixGrid data={m1} highlights={highlightIdx ? { elements: [highlightIdx] } : undefined} />
      <div className="text-3xl font-bold font-mono text-gray-400">{operator}</div>
      {m2 && <MatrixGrid data={m2} highlights={highlightIdx ? { elements: [highlightIdx] } : undefined} />}
      {m2 && <div className="text-3xl font-bold font-mono text-gray-400">=</div>}
      <MatrixGrid data={result} highlights={highlightIdx ? { elements: [highlightIdx], color: 'bg-green-100' } : undefined} />
    </div>
  );
}
