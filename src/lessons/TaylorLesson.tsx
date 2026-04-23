
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import * as math from 'mathjs';
import { Settings, Play, Info } from 'lucide-react';
import StepViewer from '../components/StepViewer';

export default function TaylorLesson() {
  const [fn, setFn] = useState('sin(x)');
  const [x0, setX0] = useState(0);
  const [order, setOrder] = useState(5);
  const [currentStep, setCurrentStep] = useState(0);
  const [showGraph, setShowGraph] = useState(false);
  const [graphPoints, setGraphPoints] = useState<{original: number[], approximation: number[]}>({ original: [], approximation: [] });
  
  const exampleFunctions = [
    { fn: 'sin(x)', desc: 'Trigonometric function', x0: 0, domain: [-3, 3] },
    { fn: 'exp(x)', desc: 'Exponential function', x0: 0, domain: [-2, 2] },
    { fn: 'log(x+1)', desc: 'Logarithmic function', x0: 0, domain: [-0.9, 3] },
    { fn: 'cos(x)', desc: 'Cosine function', x0: 0, domain: [-3, 3] },
    { fn: 'x^3 - 2*x + 1', desc: 'Polynomial function', x0: 1, domain: [-2, 4] },
    { fn: 'sqrt(x+1)', desc: 'Square root function', x0: 0, domain: [-0.9, 3] }
  ];
  
  // Generate graph points for visualization
  const generateGraphPoints = useMemo(() => {
    try {
      const compiled = math.compile(fn);
      const points = 100;
      const example = exampleFunctions.find(ex => ex.fn === fn);
      const [minX, maxX] = example ? example.domain : [-3, 3];
      const step = (maxX - minX) / points;
      
      const original: number[] = [];
      const approximation: number[] = [];
      
      for (let i = 0; i <= points; i++) {
        const x = minX + i * step;
        try {
          original.push(compiled.evaluate({ x }));
          
          // Calculate Taylor approximation
          let approx = 0;
          let currentDeriv = math.parse(fn);
          for (let j = 0; j <= order; j++) {
            try {
              const val = currentDeriv.compile().evaluate({ x: x0 });
              const fact = math.factorial(j);
              approx += (val / fact) * Math.pow(x - x0, j);
              currentDeriv = math.derivative(currentDeriv, 'x');
            } catch (e) {
              // Stop if derivative calculation fails
              break;
            }
          }
          approximation.push(approx);
        } catch {
          original.push(NaN);
          approximation.push(NaN);
        }
      }
      
      setGraphPoints({ original, approximation });
    } catch (e) {
      console.error('Error generating graph points:', e);
    }
  }, [fn, x0, order, exampleFunctions]);

  const taylorExpansion = useMemo(() => {
    const steps = [];
    try {
      const parsed = math.parse(fn);
      let currentDeriv = parsed;
      
      for (let i = 0; i <= order; i++) {
        try {
          const val = currentDeriv.compile().evaluate({ x: x0 });
          const fact = math.factorial(i);
          const coeff = val / fact;
          
          steps.push({
            order: i,
            derivative: currentDeriv.toString(),
            valueAtX0: val,
            coeff: coeff,
            term: i === 0 ? coeff.toString() : `${coeff.toFixed(4)}(x - ${x0})^${i}`
          });
          
          currentDeriv = math.derivative(currentDeriv, 'x');
        } catch (e) {
          // Stop if derivative calculation fails
          console.error(`Error calculating derivative for order ${i}:`, e);
          break;
        }
      }
    } catch (e) {
      console.error('Error in taylor expansion:', e);
    }
    return steps;
  }, [fn, x0, order]);

  const steps = useMemo(() => {
    return taylorExpansion.map((t, idx) => ({
      title: `Term of Order ${t.order}`,
      description: idx === 0 
        ? `We start by evaluating the function at x₀ = ${x0}. This gives the constant term of the series.`
        : `For the order ${t.order} term, we calculate the ${t.order}th derivative and evaluate it at x₀ = ${x0}, then divide by ${t.order}!`,
      content: (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <div className="w-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Derivative f^({t.order})(x)</span>
                <code className="text-blue-600 font-mono text-sm break-all">{t.derivative}</code>
              </div>
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Value at x₀</span>
                <code className="text-gray-900 font-mono text-lg">{t.valueAtX0.toFixed(4)}</code>
              </div>
            </div>
            
            <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-100">
               <span className="text-xs text-blue-100 uppercase font-bold block mb-2">Resulting Term</span>
               <div className="flex items-center gap-2 overflow-x-auto py-2">
                 <span className="text-2xl font-serif">T_{t.order}(x) = </span>
                 <code className="text-xl font-mono whitespace-nowrap">{t.term}</code>
               </div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-1">
              {taylorExpansion.slice(0, idx + 1).map((prev, pidx) => (
                <span key={pidx} className="text-sm font-mono text-gray-400">
                  {prev.coeff >= 0 && pidx !== 0 ? ' + ' : ''}
                  <span className={pidx === idx ? 'text-blue-600 font-bold bg-blue-50 px-1 rounded' : ''}>
                    {prev.coeff.toFixed(2)}{pidx > 0 ? `(x-${x0})^${pidx}` : ''}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    }));
  }, [taylorExpansion, x0]);

  return (
    <div className="space-y-8 h-full">
      <section className="glass rounded-3xl p-8 border border-white/20 shadow-xl space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-gradient flex items-center gap-3">
              <Settings className="text-blue-600" size={24} /> Taylor Series Configuration
            </h2>
            <p className="text-slate-600 mt-2">Configure your function and expansion parameters</p>
          </div>
          <button
            onClick={() => setShowGraph(!showGraph)}
            className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl font-semibold border border-blue-200 hover:shadow-lg transition-all"
          >
            {showGraph ? 'Hide' : 'Show'} Graph
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Function f(x)
            </label>
            <input 
              value={fn}
              onChange={(e) => setFn(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl outline-none transition-all font-mono text-sm focus-ring"
              placeholder="Enter function (e.g., sin(x), exp(x))"
            />
            <div className="flex flex-wrap gap-2">
              {exampleFunctions.slice(0, 3).map((example) => (
                <button
                  key={example.fn}
                  onClick={() => { setFn(example.fn); setX0(example.x0); }}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                >
                  {example.fn}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Center (x₀)
            </label>
            <input 
              type="number"
              value={x0}
              onChange={(e) => setX0(Number(e.target.value))}
              className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-green-500 rounded-xl outline-none transition-all font-mono text-sm focus-ring"
              step="0.1"
            />
            <div className="text-xs text-slate-500">Expansion point around which series is built</div>
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Polynomial Degree: {order}
            </label>
            <div className="space-y-2">
              <input 
                type="range"
                min="1"
                max="15"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>Linear</span>
                <span>High Precision</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Example Functions Gallery */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Example Functions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {exampleFunctions.map((example) => (
              <button
                key={example.fn}
                onClick={() => { setFn(example.fn); setX0(example.x0); setCurrentStep(0); }}
                className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="font-mono text-sm font-semibold text-slate-700 group-hover:text-blue-600">{example.fn}</div>
                <div className="text-xs text-slate-500 mt-1">{example.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="flex-1 min-h-[600px] glass rounded-3xl overflow-hidden shadow-xl border border-white/20">
        <StepViewer 
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onReset={() => setCurrentStep(0)}
          autoPlay={true}
          speedControl={true}
        />
      </div>
      
      {/* Graph Visualization */}
      {showGraph && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 border border-white/20 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-gradient mb-6">Function Approximation Visualization</h3>
          
          <div className="bg-white/50 rounded-2xl p-6 border border-white/30">
            <div className="h-64 relative">
              {/* Simple SVG graph visualization */}
              <svg className="w-full h-full" viewBox="-10 -10 20 20">
                {/* Grid lines */}
                {[...Array(9)].map((_, i) => (
                  <g key={`grid-${i}`}>
                    <line
                      x1={-8 + i * 2}
                      y1={-8}
                      x2={-8 + i * 2}
                      y2={8}
                      stroke="#e2e8f0"
                      strokeWidth="0.1"
                    />
                    <line
                      x1={-8}
                      y1={-8 + i * 2}
                      x2={8}
                      y2={-8 + i * 2}
                      stroke="#e2e8f0"
                      strokeWidth="0.1"
                    />
                  </g>
                ))}
                
                {/* Axes */}
                <line x1={-8} y1={0} x2={8} y2={0} stroke="#475569" strokeWidth="0.2" />
                <line x1={0} y1={-8} x2={0} y2={8} stroke="#475569" strokeWidth="0.2" />
                
                {/* Original function */}
                {graphPoints.original.length > 0 && graphPoints.original.map((y, i) => {
                  const x = -8 + (i / graphPoints.original.length) * 16;
                  const nextY = graphPoints.original[i + 1];
                  const nextX = -8 + ((i + 1) / graphPoints.original.length) * 16;
                  
                  if (!isNaN(y) && nextY !== undefined && !isNaN(nextY)) {
                    return (
                      <line
                        key={`orig-${i}`}
                        x1={x}
                        y1={-y * 2}
                        x2={nextX}
                        y2={-nextY * 2}
                        stroke="#3b82f6"
                        strokeWidth="0.3"
                      />
                    );
                  }
                  return null;
                })}
                
                {/* Taylor approximation */}
                {graphPoints.approximation.length > 0 && graphPoints.approximation.map((y, i) => {
                  const x = -8 + (i / graphPoints.approximation.length) * 16;
                  const nextY = graphPoints.approximation[i + 1];
                  const nextX = -8 + ((i + 1) / graphPoints.approximation.length) * 16;
                  
                  if (!isNaN(y) && nextY !== undefined && !isNaN(nextY)) {
                    return (
                      <line
                        key={`approx-${i}`}
                        x1={x}
                        y1={-y * 2}
                        x2={nextX}
                        y2={-nextY * 2}
                        stroke="#ef4444"
                        strokeWidth="0.3"
                        strokeDasharray="0.5,0.5"
                      />
                    );
                  }
                  return null;
                })}
                
                {/* Center point */}
                <circle cx={x0 * 2} cy={0} r="0.5" fill="#10b981" />
              </svg>
            </div>
            
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-blue-500 rounded"></div>
                <span className="text-sm text-slate-600">Original Function</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-red-500 rounded border-dashed"></div>
                <span className="text-sm text-slate-600">Taylor Approximation (Order {order})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-slate-600">Center Point (x₀ = {x0})</span>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Enhanced Visual Explanation */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl border border-blue-200 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-1000" />
        
        <div className="relative z-10 space-y-6">
          <h3 className="text-2xl font-bold text-gradient-2 flex items-center gap-3">
            <Info className="text-blue-600" size={28} /> Understanding Taylor Series
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span> What is it?
              </h4>
              <p className="text-blue-800/80 leading-relaxed">
                A Taylor series represents a function as an infinite sum of terms calculated from its derivatives at a single point. It's like building a polynomial approximation that gets closer to the original function.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-600 rounded-full"></span> Why does it matter?
              </h4>
              <p className="text-blue-800/80 leading-relaxed">
                As we increase the order, the approximation becomes more accurate near the center point. This is fundamental for numerical methods, physics simulations, and engineering calculations.
              </p>
            </div>
          </div>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
            <div className="font-mono text-center text-lg text-slate-700">
              f(x) ≈ Σ<span className="text-blue-600">[f^(n)(x₀) / n!]</span> × (x - x₀)<span className="text-purple-600">^n</span>
            </div>
            <div className="text-center text-sm text-slate-500 mt-2">n from 0 to ∞</div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
