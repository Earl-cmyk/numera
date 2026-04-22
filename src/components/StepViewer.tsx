
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, RefreshCcw, Info, Play, Pause, FastForward } from 'lucide-react';
import { cn } from '../lib/utils';

interface Step {
  title: string;
  description: string;
  content: React.ReactNode;
}

interface StepViewerProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onReset?: () => void;
  className?: string;
  autoPlay?: boolean;
  speedControl?: boolean;
}

export default function StepViewer({ 
  steps, 
  currentStep, 
  onStepChange, 
  onReset,
  className,
  autoPlay = false,
  speedControl = true
}: StepViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const next = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      setIsPlaying(false); // Stop at the end
    }
  };
  
  const prev = () => onStepChange(Math.max(0, currentStep - 1));
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const reset = () => {
    setIsPlaying(false);
    onStepChange(0);
    if (onReset) onReset();
  };
  
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };
  
  // Auto-play effect
  useEffect(() => {
    if (isPlaying && autoPlay) {
      const interval = 2000 / playbackSpeed; // 2 seconds base speed
      
      intervalRef.current = setInterval(() => {
        if (currentStep < steps.length - 1) {
          next();
        } else {
          setIsPlaying(false);
        }
      }, interval);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isPlaying, currentStep, steps.length, playbackSpeed, autoPlay]);
  
  // Pause when user manually changes step
  useEffect(() => {
    if (isPlaying) {
      setIsPlaying(false);
    }
  }, [currentStep]);

  return (
    <div className={cn("flex flex-col h-full bg-slate-50 overflow-hidden", className)}>
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Visualization Area */}
        <div className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden">
          <div className="mb-6 shrink-0">
             <h2 className="text-xl md:text-2xl font-bold text-slate-800">{steps[currentStep].title}</h2>
             <p className="text-sm md:text-base text-slate-500 mt-1">Numerical process simulation</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="relative z-10 w-full h-full flex items-center justify-center"
              >
                {steps[currentStep].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls Footer */}
          <div className="mt-4 sm:mt-6 bg-white border border-slate-200 rounded-xl p-3 sm:p-4 md:p-6 flex flex-col gap-3 sm:gap-4 shadow-sm shrink-0">
            {/* Primary controls row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={prev}
                  disabled={currentStep === 0}
                  className="p-2 sm:p-3 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-colors touch-manipulation"
                  aria-label="Previous step"
                >
                  <ChevronLeft size={20} className="sm:hidden" />
                  <ChevronLeft size={24} className="hidden sm:block" />
                </button>
                
                {/* Play/Pause button */}
                {autoPlay && (
                  <button
                    onClick={togglePlay}
                    disabled={currentStep === steps.length - 1}
                    className={cn(
                      "p-2 sm:p-3 rounded-full transition-all active:scale-95 touch-manipulation",
                      isPlaying 
                        ? "bg-orange-600 text-white shadow-md hover:bg-orange-700" 
                        : "bg-green-600 text-white shadow-md hover:bg-green-700 disabled:opacity-30"
                    )}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause size={20} className="sm:hidden" /> : <Play size={20} className="sm:hidden" />}
                    {isPlaying ? <Pause size={24} className="hidden sm:block" /> : <Play size={24} className="hidden sm:block" />}
                  </button>
                )}
                
                <button
                  onClick={next}
                  disabled={currentStep === steps.length - 1}
                  className="p-2 sm:p-3 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:opacity-30 transition-all active:scale-95 touch-manipulation"
                  aria-label="Next step"
                >
                  <ChevronRight size={20} className="sm:hidden" />
                  <ChevronRight size={24} className="hidden sm:block" />
                </button>
              </div>
              
              {/* Speed control - mobile optimized */}
              {autoPlay && speedControl && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <FastForward size={14} className="text-slate-400 hidden sm:block" />
                  <select
                    value={playbackSpeed}
                    onChange={(e) => handleSpeedChange(Number(e.target.value))}
                    className="text-xs border border-slate-200 rounded px-1 sm:px-2 py-1 bg-white text-slate-700 min-w-[50px]"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={2}>2x</option>
                    <option value={4}>4x</option>
                  </select>
                </div>
              )}
            </div>
            
            {/* Step info and progress */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
              <div className="text-xs sm:text-sm font-medium text-slate-700 text-center sm:text-left">
                Step <span className="text-blue-600 font-bold">{currentStep + 1}</span> of {steps.length}: 
                <span className="text-slate-400 font-normal ml-1">
                  {isPlaying ? 'Playing' : 'Process Update'}
                </span>
              </div>
              
              {/* Progress bar - responsive sizing */}
              <div className="flex gap-1 sm:gap-2">
                {steps.map((_, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "h-1.5 w-4 sm:w-6 md:w-8 rounded-full transition-all duration-300",
                      idx === currentStep ? "bg-blue-600 w-6 sm:w-8 md:w-10" : idx < currentStep ? "bg-blue-400" : "bg-slate-200"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step Explainer Sidebar (Integrated into StepViewer) */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-4 sm:p-6 overflow-y-auto shrink-0 shrink-0">
           <h3 className="text-xs sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 sm:mb-6 flex items-center gap-2">
             <Info size={14} /> Method Guide
           </h3>
           
           <div className="space-y-8">
             <AnimatePresence mode="wait">
               <motion.div
                 key={currentStep}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-6"
               >
                 <div className="relative pl-6 sm:pl-8">
                    <div className="absolute left-0 top-1 w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-bold shadow-lg shadow-blue-100">
                      {currentStep + 1}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">Active Operation</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed math-font">
                      {steps[currentStep].description}
                    </p>
                 </div>


                 <button 
                   onClick={reset}
                   className="w-full flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all bg-white shadow-sm touch-manipulation"
                 >
                   <RefreshCcw size={14} /> Reset Simulation
                 </button>
               </motion.div>
             </AnimatePresence>
             
             <div className="mt-6 sm:mt-8 pt-4 sm:pt-8 border-t border-slate-100 italic text-[10px] sm:text-[11px] text-slate-400 text-center hidden sm:block">
                Mathematics is the language with which God has written the universe. — Galileo
             </div>
           </div>
        </aside>
      </div>
    </div>
  );
}

