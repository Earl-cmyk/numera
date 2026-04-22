
import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function MatrixGrid({ 
  data, 
  highlights, 
  className 
}: { 
  data: number[][], 
  highlights?: { rows?: number[], cols?: number[], elements?: [number, number][], color?: string },
  className?: string
}) {
  const highlightColor = highlights?.color || 'bg-blue-50 border-blue-200 text-blue-700';
  
  return (
    <div 
      className={cn("grid gap-3 p-5 border-l-4 border-r-4 border-slate-700 rounded-lg relative bg-white/50", className)}
      style={{ gridTemplateColumns: `repeat(${data[0]?.length || 1}, 1fr)` }}
    >
      {data.map((row, r) => row.map((val, c) => {
        const isRowHi = highlights?.rows?.includes(r);
        const isColHi = highlights?.cols?.includes(c);
        const isElHi = highlights?.elements?.some(([er, ec]) => er === r && ec === c);
        const isHighlighted = isRowHi || isColHi || isElHi;
        
        return (
          <motion.div
            key={`${r}-${c}`}
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "w-12 h-12 md:w-16 md:h-16 flex items-center justify-center font-mono font-bold text-lg rounded border transition-all",
              isHighlighted 
                ? `${highlightColor} scale-110 z-10 shadow-lg` 
                : "bg-white border-slate-200 text-slate-700"
            )}
          >
            {typeof val === 'number' ? val.toFixed(2).replace(/\.00$/, '') : val}
          </motion.div>
        );
      }))}
    </div>
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
