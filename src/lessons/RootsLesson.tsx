
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import * as math from 'mathjs';
import { LineChart, Play, ChevronRight, TrendingUp } from 'lucide-react';
import StepViewer from '../components/StepViewer';
import { cn } from '../lib/utils';

type RootMethod = 'bisection' | 'newton' | 'false' | 'secant';

export default function RootsLesson() {
  const [method, setMethod] = useState<RootMethod>('bisection');
  const [fn, setFn] = useState('x^2 - 4');
  const [range, setRange] = useState({ a: 0, b: 5 });
  const [x0, setX0] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);

  const bisectionSteps = useMemo(() => {
    const steps = [];
    try {
      const compiled = math.compile(fn);
      let a = range.a;
      let b = range.b;
      
      for (let i = 0; i < 8; i++) {
        const fa = compiled.evaluate({ x: a });
        const fb = compiled.evaluate({ x: b });
        const mid = (a + b) / 2;
        const fmid = compiled.evaluate({ x: mid });
        const signChange = fa * fmid < 0;
        
        steps.push({
          title: `Iteration ${i + 1}`,
          description: `Current interval: [${a.toFixed(4)}, ${b.toFixed(4)}]. Midpoint m = ${mid.toFixed(4)}. Since f(a)*f(m) ${signChange ? '< 0' : '> 0'}, we update the ${signChange ? 'upper' : 'lower'} bound.`,
          content: (
            <div className="w-full flex flex-col items-center gap-8">
              <div className="relative w-full h-8 bg-gray-200 rounded-full flex items-center px-2">
                <div 
                  className="absolute h-4 bg-blue-500 rounded-full transition-all duration-500"
                  style={{ 
                    left: `${(a / 10) * 100}%`, 
                    width: `${((b - a) / 10) * 100}%` 
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl">
                  <span className="text-xs text-gray-400 block mb-1 uppercase font-bold text-[10px]">f(a)</span>
                  <span className="font-mono text-lg">{fa.toFixed(4)}</span>
                </div>
                <div className="text-center p-4 bg-blue-600 text-white rounded-2xl shadow-lg ring-4 ring-blue-100">
                  <span className="text-xs text-blue-200 block mb-1 uppercase font-bold text-[10px]">f(mid)</span>
                  <span className="font-mono text-lg">{fmid.toFixed(4)}</span>
                </div>
                <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl">
                  <span className="text-xs text-gray-400 block mb-1 uppercase font-bold text-[10px]">f(b)</span>
                  <span className="font-mono text-lg">{fb.toFixed(4)}</span>
                </div>
              </div>
            </div>
          )
        });
        
        if (signChange) b = mid; else a = mid;
      }
    } catch (e) {
      return [{ title: 'Error', description: 'Invalid function', content: null }];
    }
    return steps;
  }, [fn, range]);

  const newtonSteps = useMemo(() => {
    const steps = [];
    try {
      const compiled = math.compile(fn);
      const deriv = math.derivative(fn, 'x');
      const compiledDeriv = deriv.compile();
      let x = x0;
      
      for (let i = 0; i < 8; i++) {
        const fx = compiled.evaluate({ x });
        const dfx = compiledDeriv.evaluate({ x });
        if (Math.abs(dfx) < 1e-9) break;
        const nextX = x - fx / dfx;
        steps.push({
          title: `Iteration ${i + 1}`,
          description: `Using x_{n+1} = x_n - f(x_n)/f'(x_n). Current x = ${x.toFixed(4)}, f(x) = ${fx.toFixed(4)}, f'(x) = ${dfx.toFixed(4)}.`,
          content: (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl flex flex-col items-center gap-4 w-full max-w-sm">
                <span className="text-blue-200 uppercase font-bold text-[10px] tracking-widest">Slope f'(x)</span>
                <span className="text-3xl font-mono">{dfx.toFixed(4)}</span>
                <div className="h-px w-full bg-blue-400/50" />
                <span className="text-blue-200 uppercase font-bold text-[10px] tracking-widest">Next X</span>
                <span className="text-4xl font-mono font-bold">{nextX.toFixed(4)}</span>
              </div>
            </div>
          )
        });
        if (Math.abs(nextX - x) < 1e-7) break;
        x = nextX;
      }
    } catch (e) {
       return [{ title: 'Error', description: 'Derivative error', content: null }];
    }
    return steps;
  }, [fn, x0]);

  const falsePositionSteps = useMemo(() => {
    const steps = [];
    try {
      const compiled = math.compile(fn);
      let a = range.a;
      let b = range.b;
      
      const fa = compiled.evaluate({ x: a });
      const fb = compiled.evaluate({ x: b });
      
      if (fa * fb >= 0) {
        return [{ title: 'Error', description: 'Function must have opposite signs at endpoints', content: null }];
      }
      
      steps.push({
        title: 'Initial Setup',
        description: `f(${a}) = ${fa.toFixed(6)}, f(${b}) = ${fb.toFixed(6)}`,
        content: (
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl">
              <span className="text-xs text-gray-400 block mb-1 uppercase font-bold text-[10px]">f(a)</span>
              <span className="font-mono text-lg">{fa.toFixed(4)}</span>
            </div>
            <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl">
              <span className="text-xs text-gray-400 block mb-1 uppercase font-bold text-[10px]">f(b)</span>
              <span className="font-mono text-lg">{fb.toFixed(4)}</span>
            </div>
          </div>
        )
      });
      
      for (let i = 0; i < 8; i++) {
        const c = a - fa * (b - a) / (fb - fa);
        const fc = compiled.evaluate({ x: c });
        
        steps.push({
          title: `Iteration ${i + 1}`,
          description: `c = ${a} - ${fa.toFixed(6)} * (${b} - ${a}) / (${fb.toFixed(6)} - ${fa.toFixed(6)}) = ${c.toFixed(6)}`,
          content: (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="bg-orange-600 p-8 rounded-3xl text-white shadow-xl flex flex-col items-center gap-4 w-full max-w-sm">
                <span className="text-orange-200 uppercase font-bold text-[10px] tracking-widest">False Position</span>
                <span className="text-2xl font-mono">c = {c.toFixed(4)}</span>
                <div className="h-px w-full bg-orange-400/50" />
                <span className="text-orange-200 uppercase font-bold text-[10px] tracking-widest">f(c)</span>
                <span className="text-3xl font-mono font-bold">{fc.toFixed(4)}</span>
              </div>
              <div className="w-full flex justify-center gap-4">
                <div className="text-center p-3 bg-gray-100 rounded-lg">
                  <span className="text-xs text-gray-500">a</span>
                  <div className="font-mono font-bold">{a.toFixed(3)}</div>
                </div>
                <div className="text-center p-3 bg-orange-100 rounded-lg">
                  <span className="text-xs text-orange-500">c</span>
                  <div className="font-mono font-bold text-orange-600">{c.toFixed(3)}</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded-lg">
                  <span className="text-xs text-gray-500">b</span>
                  <div className="font-mono font-bold">{b.toFixed(3)}</div>
                </div>
              </div>
            </div>
          )
        });
        
        if (Math.abs(fc) < 1e-6) {
          steps.push({
            title: 'Convergence',
            description: `f(${c.toFixed(6)}) = ${fc.toFixed(6)} < 1e-6`,
            content: (
              <div className="text-center p-6 bg-green-100 rounded-2xl">
                <span className="text-green-800 font-bold text-lg">Root Found: {c.toFixed(6)}</span>
              </div>
            )
          });
          break;
        }
        
        if (fa * fc < 0) {
          b = c;
          steps.push({
            title: 'Update Interval',
            description: `f(a)*f(c) < 0, new interval: [${a.toFixed(6)}, ${c.toFixed(6)}]`,
            content: null
          });
        } else {
          a = c;
          steps.push({
            title: 'Update Interval', 
            description: `f(a)*f(c) > 0, new interval: [${c.toFixed(6)}, ${b.toFixed(6)}]`,
            content: null
          });
        }
      }
    } catch (e) {
      return [{ title: 'Error', description: 'Function evaluation error', content: null }];
    }
    return steps;
  }, [fn, range]);

  const secantSteps = useMemo(() => {
    const steps = [];
    try {
      const compiled = math.compile(fn);
      let x0_curr = x0;
      let x1_curr = x0 + 1; // Default second guess
      
      const fx0 = compiled.evaluate({ x: x0_curr });
      const fx1 = compiled.evaluate({ x: x1_curr });
      
      steps.push({
        title: 'Initial Setup',
        description: `x₀ = ${x0_curr}, f(x₀) = ${fx0.toFixed(6)}, x₁ = ${x1_curr}, f(x₁) = ${fx1.toFixed(6)}`,
        content: (
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl">
              <span className="text-xs text-gray-400 block mb-1 uppercase font-bold text-[10px]">x₀, f(x₀)</span>
              <span className="font-mono text-lg">{x0_curr.toFixed(3)}, {fx0.toFixed(3)}</span>
            </div>
            <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl">
              <span className="text-xs text-gray-400 block mb-1 uppercase font-bold text-[10px]">x₁, f(x₁)</span>
              <span className="font-mono text-lg">{x1_curr.toFixed(3)}, {fx1.toFixed(3)}</span>
            </div>
          </div>
        )
      });
      
      for (let i = 0; i < 8; i++) {
        if (Math.abs(fx1 - fx0) < 1e-10) {
          steps.push({
            title: 'Error',
            description: 'Division by zero - function values too close',
            content: null
          });
          break;
        }
        
        const x2 = x1_curr - fx1 * (x1_curr - x0_curr) / (fx1 - fx0);
        const fx2 = compiled.evaluate({ x: x2 });
        
        steps.push({
          title: `Iteration ${i + 1}`,
          description: `x₂ = ${x1_curr} - ${fx1.toFixed(6)} * (${x1_curr} - ${x0_curr}) / (${fx1.toFixed(6)} - ${fx0.toFixed(6)}) = ${x2.toFixed(6)}`,
          content: (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="bg-purple-600 p-8 rounded-3xl text-white shadow-xl flex flex-col items-center gap-4 w-full max-w-sm">
                <span className="text-purple-200 uppercase font-bold text-[10px] tracking-widest">Secant Formula</span>
                <span className="text-2xl font-mono">x₂ = {x2.toFixed(4)}</span>
                <div className="h-px w-full bg-purple-400/50" />
                <span className="text-purple-200 uppercase font-bold text-[10px] tracking-widest">f(x₂)</span>
                <span className="text-3xl font-mono font-bold">{fx2.toFixed(4)}</span>
              </div>
              <div className="w-full flex justify-center gap-4">
                <div className="text-center p-3 bg-gray-100 rounded-lg">
                  <span className="text-xs text-gray-500">x₀</span>
                  <div className="font-mono font-bold">{x0_curr.toFixed(3)}</div>
                </div>
                <div className="text-center p-3 bg-gray-100 rounded-lg">
                  <span className="text-xs text-gray-500">x₁</span>
                  <div className="font-mono font-bold">{x1_curr.toFixed(3)}</div>
                </div>
                <div className="text-center p-3 bg-purple-100 rounded-lg">
                  <span className="text-xs text-purple-500">x₂</span>
                  <div className="font-mono font-bold text-purple-600">{x2.toFixed(3)}</div>
                </div>
              </div>
            </div>
          )
        });
        
        if (Math.abs(fx2) < 1e-6) {
          steps.push({
            title: 'Convergence',
            description: `f(${x2.toFixed(6)}) = ${fx2.toFixed(6)} < 1e-6`,
            content: (
              <div className="text-center p-6 bg-green-100 rounded-2xl">
                <span className="text-green-800 font-bold text-lg">Root Found: {x2.toFixed(6)}</span>
              </div>
            )
          });
          break;
        }
        
        // Update for next iteration
        x0_curr = x1_curr;
        x1_curr = x2;
      }
    } catch (e) {
      return [{ title: 'Error', description: 'Function evaluation error', content: null }];
    }
    return steps;
  }, [fn, x0]);

  const steps = useMemo(() => {
    if (method === 'bisection') return bisectionSteps;
    if (method === 'newton') return newtonSteps;
    if (method === 'false') return falsePositionSteps;
    if (method === 'secant') return secantSteps;
    return [{title: 'Extension Point', description: 'Visualization engine loading...', content: <div className="text-gray-400 p-12">Coming Soon</div>}];
  }, [method, bisectionSteps, newtonSteps, falsePositionSteps, secantSteps]);

  return (
    <div className="space-y-8 h-full">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {(['bisection', 'newton', 'false', 'secant'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMethod(m); setCurrentStep(0); }}
            className={cn(
              "px-4 py-2 border-b-2 text-sm font-bold capitalize transition-all uppercase tracking-wider",
              method === m ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
             <div className="flex items-center gap-2 font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4 text-sm uppercase">
               <TrendingUp size={16} className="text-blue-600" /> Parameters
             </div>
             <div className="space-y-2">
                <label className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest">Function f(x)</label>
                <input 
                   value={fn} 
                   onChange={e => setFn(e.target.value)} 
                   className="w-full p-2.5 bg-slate-50 rounded-lg font-mono text-sm border border-slate-200 focus:border-blue-500 outline-none" 
                />
             </div>
             {method === 'bisection' || method === 'false' ? (
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest">Bound a</label>
                    <input type="number" value={range.a} onChange={e => setRange({...range, a: Number(e.target.value)})} className="w-full p-2.5 bg-slate-50 rounded-lg font-mono text-sm border border-slate-200" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest">Bound b</label>
                    <input type="number" value={range.b} onChange={e => setRange({...range, b: Number(e.target.value)})} className="w-full p-2.5 bg-slate-50 rounded-lg font-mono text-sm border border-slate-200" />
                 </div>
               </div>
             ) : (
               <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest">Initial Guess x₀</label>
                  <input type="number" value={x0} onChange={e => setX0(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 rounded-lg font-mono text-sm border border-slate-200 outline-none" />
               </div>
             )}
          </div>
          
          <div className="p-5 bg-slate-900 rounded-2xl text-white shadow-lg border border-slate-800">
             <h4 className="font-bold flex items-center gap-2 mb-2 text-xs uppercase tracking-wider text-blue-400"><LineChart size={14} /> Method Insight</h4>
             <p className="text-[11px] text-slate-400 leading-relaxed">
               {method === 'bisection' ? "Guaranteed to converge but relatively slow (linear)." : "Extremely fast convergence (quadratic), but requires a good initial guess."}
             </p>
          </div>
        </aside>

        <section className="lg:col-span-3 min-h-[600px] border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
          <StepViewer 
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
        </section>
      </div>
    </div>
  );

}
