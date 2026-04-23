import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface AnimatedMatrixProps {
  matrices: number[][][];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  highlights?: { rows?: number[], cols?: number[], elements?: [number, number][], color?: string, pivot?: [number, number] };
  className?: string;
  animated?: boolean;
  interval?: number;
}

export default function AnimatedMatrix({
  matrices,
  currentIndex = 0,
  onIndexChange,
  highlights,
  className,
  animated = true,
  interval = 3000
}: AnimatedMatrixProps) {
  const [internalIndex, setInternalIndex] = useState(currentIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const effectiveIndex = onIndexChange ? currentIndex : internalIndex;
  const currentMatrix = matrices[effectiveIndex] || matrices[0] || [];
  
  const handleNext = useCallback(() => {
    if (effectiveIndex < matrices.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        if (onIndexChange) {
          onIndexChange(effectiveIndex + 1);
        } else {
          setInternalIndex(effectiveIndex + 1);
        }
        setIsTransitioning(false);
      }, 300);
    }
  }, [effectiveIndex, matrices.length, onIndexChange]);
  
  const handlePrevious = useCallback(() => {
    if (effectiveIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        if (onIndexChange) {
          onIndexChange(effectiveIndex - 1);
        } else {
          setInternalIndex(effectiveIndex - 1);
        }
        setIsTransitioning(false);
      }, 300);
    }
  }, [effectiveIndex, onIndexChange]);
  
  // Auto-play effect
  useEffect(() => {
    if (animated && matrices.length > 1) {
      const timer = setInterval(() => {
        if (effectiveIndex >= matrices.length - 1) {
          if (onIndexChange) {
            onIndexChange(0);
          } else {
            setInternalIndex(0);
          }
        } else {
          handleNext();
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [animated, effectiveIndex, matrices.length, interval, handleNext, onIndexChange]);
  
  const renderMatrix = (matrix: number[][], key: string) => {
    const highlightColor = highlights?.color || 'bg-blue-50 border-blue-200 text-blue-700';
    const pivotColor = 'bg-yellow-100 border-yellow-300 text-yellow-800';
    
    return (
      <motion.div
        key={key}
        className={cn(
          "grid gap-2 md:gap-3 p-4 md:p-5 border-l-4 border-r-4 border-slate-700 rounded-lg relative bg-white/50",
          "transition-all duration-300",
          className
        )}
        style={{ 
          gridTemplateColumns: `repeat(${matrix[0]?.length || 1}, minmax(0, 1fr))`,
          maxWidth: '100%'
        }}
        initial={animated ? { scale: 0.9, opacity: 0 } : undefined}
        animate={{ scale: 1, opacity: 1 }}
        exit={animated ? { scale: 0.9, opacity: 0 } : undefined}
        transition={{ duration: 0.3 }}
      >
        {matrix.map((row, r) => row.map((val, c) => {
          const isRowHi = highlights?.rows?.includes(r);
          const isColHi = highlights?.cols?.includes(c);
          const isElHi = highlights?.elements?.some(([er, ec]) => er === r && ec === c);
          const isPivot = highlights?.pivot && highlights.pivot[0] === r && highlights.pivot[1] === c;
          const isHighlighted = isRowHi || isColHi || isElHi;
          
          return (
            <motion.div
              key={`${r}-${c}`}
              layout={animated}
              initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
              animate={{ 
                scale: isPivot ? 1.15 : isHighlighted ? 1.1 : 1, 
                opacity: 1
              }}
              transition={{ 
                scale: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className={cn(
                "aspect-square flex items-center justify-center font-mono font-bold text-sm md:text-lg rounded border",
                "relative overflow-hidden transition-all duration-200",
                isPivot 
                  ? `${pivotColor} shadow-lg ring-2 ring-yellow-300 z-20` 
                  : isHighlighted 
                    ? `${highlightColor} shadow-md z-10` 
                    : "bg-white border-slate-200 text-slate-700"
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
              <motion.span 
                className="relative z-10"
                initial={animated ? { opacity: 0 } : undefined}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                {typeof val === 'number' ? val.toFixed(2).replace(/\.00$/, '') : val}
              </motion.span>
            </motion.div>
          );
        }))}
      </motion.div>
    );
  };
  
  return (
    <div className="space-y-4">
      {/* Matrix display */}
      <div className="relative">
        <motion.div
          key={effectiveIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {renderMatrix(currentMatrix, `matrix-${effectiveIndex}`)}
        </motion.div>
        
        {/* Transition overlay */}
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white bg-opacity-50 rounded-lg flex items-center justify-center"
          >
            <div className="text-blue-600 font-semibold">Updating...</div>
          </motion.div>
        )}
      </div>
      
      {/* Navigation controls */}
      {matrices.length > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            disabled={effectiveIndex === 0}
            className="px-3 py-1 rounded border border-slate-200 text-sm disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          
          <div className="text-sm text-slate-600">
            {effectiveIndex + 1} / {matrices.length}
          </div>
          
          <button
            onClick={handleNext}
            disabled={effectiveIndex === matrices.length - 1}
            className="px-3 py-1 rounded border border-slate-200 text-sm disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
      
      {/* Progress indicator */}
      {matrices.length > 1 && (
        <div className="flex justify-center gap-1">
          {matrices.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1 w-8 rounded-full transition-all duration-300",
                idx === effectiveIndex ? "bg-blue-600" : "bg-slate-200"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
