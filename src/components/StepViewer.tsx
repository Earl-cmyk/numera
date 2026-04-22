
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
    <div className={cn("flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 overflow-hidden", className)}>
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Visualization Area */}
        <div className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden">
          <div className="mb-6 shrink-0">
             <h2 className="text-2xl md:text-3xl font-bold text-gradient">{steps[currentStep].title}</h2>
             <p className="text-base md:text-lg text-slate-600 mt-2 font-medium">Interactive numerical computation</p>
          </div>
          
          <div className="flex-1 flex items-center justify-center glass rounded-3xl border border-white/20 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-400/10 to-blue-400/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000" />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative z-10 w-full h-full flex items-center justify-center p-4"
              >
                {steps[currentStep].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Enhanced Controls Footer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 sm:mt-6 glass rounded-2xl border border-white/20 shadow-xl p-4 sm:p-6 flex flex-col gap-4 shrink-0"
          >
            {/* Primary controls row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prev}
                  disabled={currentStep === 0}
                  className={cn(
                    "p-3 rounded-xl transition-all touch-manipulation",
                    currentStep === 0 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 shadow-md hover:shadow-lg"
                  )}
                  aria-label="Previous step"
                >
                  <ChevronLeft size={20} className="sm:hidden" />
                  <ChevronLeft size={24} className="hidden sm:block" />
                </motion.button>
                
                {/* Enhanced Play/Pause button */}
                {autoPlay && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    disabled={currentStep === steps.length - 1}
                    className={cn(
                      "p-3 rounded-xl transition-all touch-manipulation",
                      isPlaying 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl" 
                        : "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl disabled:opacity-30"
                    )}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause size={20} className="sm:hidden" /> : <Play size={20} className="sm:hidden" />}
                    {isPlaying ? <Pause size={24} className="hidden sm:block" /> : <Play size={24} className="hidden sm:block" />}
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={next}
                  disabled={currentStep === steps.length - 1}
                  className={cn(
                    "p-3 rounded-xl transition-all touch-manipulation",
                    currentStep === steps.length - 1
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "btn-gradient text-white shadow-lg hover:shadow-xl disabled:opacity-30"
                  )}
                  aria-label="Next step"
                >
                  <ChevronRight size={20} className="sm:hidden" />
                  <ChevronRight size={24} className="hidden sm:block" />
                </motion.button>
              </div>
              
              {/* Enhanced Speed control */}
              {autoPlay && speedControl && (
                <div className="flex items-center gap-2 bg-white/50 rounded-xl px-3 py-2 border border-white/30">
                  <FastForward size={16} className="text-slate-500" />
                  <select
                    value={playbackSpeed}
                    onChange={(e) => handleSpeedChange(Number(e.target.value))}
                    className="text-xs border-0 bg-transparent text-slate-700 font-medium focus:outline-none"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={2}>2x</option>
                    <option value={4}>4x</option>
                  </select>
                </div>
              )}
            </div>
            
            {/* Enhanced Step info and progress */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm font-medium text-slate-700 text-center sm:text-left">
                Step <span className="text-gradient font-bold text-lg">{currentStep + 1}</span> of <span className="text-slate-500">{steps.length}</span>
                <div className="text-xs text-slate-400 mt-1">
                  {isPlaying ? '🎵 Auto-playing' : '⏸️ Manual navigation'}
                </div>
              </div>
              
              {/* Enhanced Progress bar */}
              <div className="flex gap-2">
                {steps.map((_, idx) => (
                  <motion.div 
                    key={idx}
                    className={cn(
                      "h-2 rounded-full transition-all duration-500",
                      idx === currentStep 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 w-8 shadow-lg" 
                        : idx < currentStep 
                          ? "bg-blue-400 w-6" 
                          : "bg-slate-200 w-4"
                    )}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Step Explainer Sidebar */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/20 glass-dark p-4 sm:p-6 overflow-y-auto shrink-0">
           <h3 className="text-sm font-bold text-gradient mb-6 flex items-center gap-3">
             <Info size={18} className="text-blue-400" /> Process Guide
           </h3>
           
           <div className="space-y-8">
             <AnimatePresence mode="wait">
               <motion.div
                 key={currentStep}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 0.3 }}
                 className="space-y-6"
               >
                 <div className="relative pl-8">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="absolute left-0 top-1 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/30"
                    >
                      {currentStep + 1}
                    </motion.div>
                    <h4 className="text-sm font-bold text-white tracking-tight">Current Operation</h4>
                    <p className="text-sm text-slate-300 mt-3 leading-relaxed math-font">
                      {steps[currentStep].description}
                    </p>
                 </div>

                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={reset}
                   className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/20 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-all bg-white/5 shadow-md touch-manipulation"
                 >
                   <RefreshCcw size={16} /> Reset Simulation
                 </motion.button>
               </motion.div>
             </AnimatePresence>
             
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="pt-6 border-t border-white/10 text-center"
             >
               <div className="text-xs text-slate-400 italic mb-3">💡 Tip</div>
               <div className="text-[11px] text-slate-300 leading-relaxed">
                 {currentStep === 0 && "Start here to understand the foundation of the method."}
                 {currentStep > 0 && currentStep < steps.length - 1 && "Each step builds upon the previous one."}
                 {currentStep === steps.length - 1 && "You've completed the full process!"}
               </div>
             </motion.div>
           </div>
        </aside>
      </div>
    </div>
  );
}

