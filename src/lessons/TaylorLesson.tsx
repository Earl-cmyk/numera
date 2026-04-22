
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

  const taylorExpansion = useMemo(() => {
    const steps = [];
    try {
      const parsed = math.parse(fn);
      let currentDeriv = parsed;
      
      for (let i = 0; i <= order; i++) {
        const val = currentDeriv.compile().evaluate({ x: x0 });
        const fact = math.factorial(i);
        const coeff = val / fact;
        
        steps.push({
          order: i,
          derivative: currentDeriv.toString(),
          valueAtX0: val,
          coeff: coeff,
          term: i === 0 ? coeff : `${coeff.toFixed(4)}(x - ${x0})^${i}`
        });
        
        currentDeriv = math.derivative(currentDeriv, 'x');
      }
    } catch (e) {
      console.error(e);
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
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Settings className="text-blue-600" size={18} /> Configuration
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Function f(x)</label>
            <input 
              value={fn}
              onChange={(e) => setFn(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg outline-none transition-all font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Center (x₀)</label>
            <input 
              type="number"
              value={x0}
              onChange={(e) => setX0(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg outline-none transition-all font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Degrees: {order}</label>
            <input 
              type="range"
              min="1"
              max="10"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-4"
            />
          </div>
        </div>
      </section>

      <div className="flex-1 min-h-[600px] border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <StepViewer 
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onReset={() => setCurrentStep(0)}
        />
      </div>

      <section className="p-8 bg-blue-50 rounded-3xl border border-blue-100 relative overflow-hidden group">
        <div className="relative z-10 space-y-4">
          <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
            <Info /> Visual Explanation
          </h3>
          <p className="text-blue-800/80 leading-relaxed max-w-2xl">
            A Taylor series represents a function as an infinite sum of terms calculated from its derivatives at a single point. As we increase the order, the approximation becomes more accurate near the center point.
          </p>
        </div>
        <div className="absolute -right-12 -bottom-12 p-8 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
      </section>
    </div>
  );
}
