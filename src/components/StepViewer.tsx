
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, RefreshCcw, Info } from 'lucide-react';
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
}

export default function StepViewer({ 
  steps, 
  currentStep, 
  onStepChange, 
  onReset,
  className 
}: StepViewerProps) {
  const next = () => onStepChange(Math.min(steps.length - 1, currentStep + 1));
  const prev = () => onStepChange(Math.max(0, currentStep - 1));

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
          <div className="mt-6 bg-white border border-slate-200 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm shrink-0">
            <div className="flex items-center gap-4">
              <button
                onClick={prev}
                disabled={currentStep === 0}
                className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="text-sm font-medium text-slate-700">
                Step <span className="text-blue-600 font-bold">{currentStep + 1}</span> of {steps.length}: <span className="text-slate-400 font-normal ml-1">Process Update</span>
              </div>
              <button
                onClick={next}
                disabled={currentStep === steps.length - 1}
                className="p-2 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:opacity-30 transition-all active:scale-95"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            <div className="flex gap-2">
              {steps.map((_, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "h-1.5 w-6 md:w-8 rounded-full transition-all duration-300",
                    idx === currentStep ? "bg-blue-600 w-10 md:w-12" : idx < currentStep ? "bg-blue-400" : "bg-slate-200"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step Explainer Sidebar (Integrated into StepViewer) */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-6 overflow-y-auto shrink-0 shrink-0">
           <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
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
                 <div className="relative pl-8">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg shadow-blue-100">
                      {currentStep + 1}
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 tracking-tight">Active Operation</h4>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed math-font">
                      {steps[currentStep].description}
                    </p>
                 </div>


                 {onReset && (
                   <button 
                     onClick={onReset}
                     className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all bg-white shadow-sm"
                   >
                     <RefreshCcw size={14} /> Reset Simulation
                   </button>
                 )}
               </motion.div>
             </AnimatePresence>
             
             <div className="mt-8 pt-8 border-t border-slate-100 italic text-[11px] text-slate-400 text-center">
                Mathematics is the language with which God has written the universe. — Galileo
             </div>
           </div>
        </aside>
      </div>
    </div>
  );
}

