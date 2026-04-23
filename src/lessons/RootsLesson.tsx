
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
  
  const exampleFunctions = [
    { fn: 'x^2 - 4', desc: 'Simple quadratic', range: { a: 0, b: 5 }, x0: 1 },
    { fn: 'x^3 - x - 2', desc: 'Cubic equation', range: { a: 1, b: 2 }, x0: 1.5 },
    { fn: 'exp(x) - 3', desc: 'Exponential', range: { a: 0, b: 2 }, x0: 1 },
    { fn: 'sin(x) - 0.5', desc: 'Trigonometric', range: { a: 0, b: 2 }, x0: 0.5 },
    { fn: 'x^5 - 3*x + 1', desc: 'Polynomial', range: { a: 0, b: 2 }, x0: 1 },
    { fn: 'log(x) - 1', desc: 'Logarithmic', range: { a: 1, b: 4 }, x0: 2 }
  ];

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
      return [{ title: 'Error', description: 'Invalid function', content: (
        <div className="text-center p-8 bg-red-50 rounded-2xl">
          <div className="text-red-600 font-bold text-lg">Function Error</div>
          <div className="text-red-500 text-sm mt-2">Please check your function syntax</div>
          <div className="text-red-400 text-xs mt-1">Examples: x^2 - 4, sin(x), exp(x)</div>
        </div>
      ) }];
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
       return [{ title: 'Error', description: 'Derivative error', content: (
        <div className="text-center p-8 bg-red-50 rounded-2xl">
          <div className="text-red-600 font-bold text-lg">Derivative Error</div>
          <div className="text-red-500 text-sm mt-2">Cannot compute derivative of this function</div>
          <div className="text-red-400 text-xs mt-1">Newton's method requires differentiable functions</div>
        </div>
      ) }];
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
        return [{ title: 'Error', description: 'Function must have opposite signs at endpoints', content: (
          <div className="text-center p-8 bg-orange-50 rounded-2xl">
            <div className="text-orange-600 font-bold text-lg">Sign Change Required</div>
            <div className="text-orange-500 text-sm mt-2">f(a) and f(b) must have opposite signs</div>
            <div className="text-orange-400 text-xs mt-1">f({range.a}) = {fa.toFixed(4)}, f({range.b}) = {fb.toFixed(4)}</div>
            <div className="text-orange-300 text-xs mt-2">Try adjusting the interval bounds</div>
          </div>
        ) }];
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
            content: (
              <div className="flex flex-col items-center gap-4">
                <div className="text-center p-4 bg-green-100 rounded-2xl">
                  <div className="font-bold text-green-800">Root is in [a, c]</div>
                  <div className="text-sm text-green-600 mt-1">New interval: [{a.toFixed(3)}, {c.toFixed(3)}]</div>
                </div>
              </div>
            )
          });
        } else {
          a = c;
          steps.push({
            title: 'Update Interval', 
            description: `f(a)*f(c) > 0, new interval: [${c.toFixed(6)}, ${b.toFixed(6)}]`,
            content: (
              <div className="flex flex-col items-center gap-4">
                <div className="text-center p-4 bg-orange-100 rounded-2xl">
                  <div className="font-bold text-orange-800">Root is in [c, b]</div>
                  <div className="text-sm text-orange-600 mt-1">New interval: [{c.toFixed(3)}, {b.toFixed(3)}]</div>
                </div>
              </div>
            )
          });
        }
      }
    } catch (e) {
      return [{ title: 'Error', description: 'Function evaluation error', content: (
        <div className="text-center p-8 bg-red-50 rounded-2xl">
          <div className="text-red-600 font-bold text-lg">Evaluation Error</div>
          <div className="text-red-500 text-sm mt-2">Cannot evaluate function at given points</div>
          <div className="text-red-400 text-xs mt-1">Check function domain and syntax</div>
        </div>
      ) }];
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
            content: (
              <div className="text-center p-8 bg-red-50 rounded-2xl">
                <div className="text-red-600 font-bold text-lg">Division by Zero</div>
                <div className="text-red-500 text-sm mt-2">Function values are too close, causing numerical instability</div>
                <div className="text-red-400 text-xs mt-1">Try a different initial guess</div>
              </div>
            )
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
      return [{ title: 'Error', description: 'Function evaluation error', content: (
        <div className="text-center p-8 bg-red-50 rounded-2xl">
          <div className="text-red-600 font-bold text-lg">Evaluation Error</div>
          <div className="text-red-500 text-sm mt-2">Cannot evaluate function at given points</div>
          <div className="text-red-400 text-xs mt-1">Check function domain and syntax</div>
        </div>
      ) }];
    }
    return steps;
  }, [fn, x0]);

  const bracketingSteps = useMemo(() => {
    const steps = [];
    try {
      const compiled = math.compile(fn);
      let a = range.a;
      let b = range.b;
      
      const fa = compiled.evaluate({ x: a });
      const fb = compiled.evaluate({ x: b });
      
      steps.push({
        title: 'Initial Setup',
        description: `a = ${a}, f(a) = ${fa.toFixed(6)}, b = ${b}, f(b) = ${fb.toFixed(6)}`,
        content: (
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl">
              <span className="text-xs text-gray-400 block mb-1 uppercase font-bold text-[10px]">a, f(a)</span>
              <span className="font-mono text-lg">{a.toFixed(3)}, {fa.toFixed(3)}</span>
            </div>
            <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl">
              <span className="text-xs text-gray-400 block mb-1 uppercase font-bold text-[10px]">b, f(b)</span>
              <span className="font-mono text-lg">{b.toFixed(3)}, {fb.toFixed(3)}</span>
            </div>
          </div>
        )
      });
      
      for (let i = 0; i < 8; i++) {
        const c = (a + b) / 2;
        const fc = compiled.evaluate({ x: c });
        
        steps.push({
          title: `Iteration ${i + 1}`,
          description: `c = (${a} + ${b}) / 2 = ${c.toFixed(6)}`,
          content: (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="bg-orange-600 p-8 rounded-3xl text-white shadow-xl flex flex-col items-center gap-4 w-full max-w-sm">
                <span className="text-orange-200 uppercase font-bold text-[10px] tracking-widest">Bracketing</span>
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
            content: (
              <div className="flex flex-col items-center gap-4">
                <div className="text-center p-4 bg-green-100 rounded-2xl">
                  <div className="font-bold text-green-800">Root is in [a, c]</div>
                  <div className="text-sm text-green-600 mt-1">New interval: [{a.toFixed(3)}, {c.toFixed(3)}]</div>
                </div>
              </div>
            )
          });
        } else {
          a = c;
          steps.push({
            title: 'Update Interval', 
            description: `f(a)*f(c) > 0, new interval: [${c.toFixed(6)}, ${b.toFixed(6)}]`,
            content: (
              <div className="flex flex-col items-center gap-4">
                <div className="text-center p-4 bg-orange-100 rounded-2xl">
                  <div className="font-bold text-orange-800">Root is in [c, b]</div>
                  <div className="text-sm text-orange-600 mt-1">New interval: [{c.toFixed(3)}, {b.toFixed(3)}]</div>
                </div>
              </div>
            )
          });
        }
      }
    } catch (e) {
      return [{ title: 'Error', description: 'Function evaluation error', content: (
        <div className="text-center p-8 bg-red-50 rounded-2xl">
          <div className="text-red-600 font-bold text-lg">Evaluation Error</div>
          <div className="text-red-500 text-sm mt-2">Cannot evaluate function at given points</div>
          <div className="text-red-400 text-xs mt-1">Check function domain and syntax</div>
        </div>
      ) }];
    }
    return steps;
  }, [fn, range]);

  const illinoisSteps = useMemo(() => {
    const steps = [];
    try {
      const compiled = math.compile(fn);
      let a = range.a;
      let b = range.b;
      
      const fa = compiled.evaluate({ x: a });
      const fb = compiled.evaluate({ x: b });
      
      steps.push({
        title: 'Initial Setup',
        description: `a = ${a}, f(a) = ${fa.toFixed(6)}, b = ${b}, f(b) = ${fb.toFixed(6)}`,
        content: (
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl">
              <span className="text-xs text-gray-400 block mb-1 uppercase font-bold text-[10px]">a, f(a)</span>
              <span className="font-mono text-lg">{a.toFixed(3)}, {fa.toFixed(3)}</span>
            </div>
            <div className="text-center p-4 bg-white border border-gray-100 rounded-2xl">
              <span className="text-xs text-gray-400 block mb-1 uppercase font-bold text-[10px]">b, f(b)</span>
              <span className="font-mono text-lg">{b.toFixed(3)}, {fb.toFixed(3)}</span>
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
                <span className="text-orange-200 uppercase font-bold text-[10px] tracking-widest">Illinois</span>
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
            content: (
              <div className="flex flex-col items-center gap-4">
                <div className="text-center p-4 bg-green-100 rounded-2xl">
                  <div className="font-bold text-green-800">Root is in [a, c]</div>
                  <div className="text-sm text-green-600 mt-1">New interval: [{a.toFixed(3)}, {c.toFixed(3)}]</div>
                </div>
              </div>
            )
          });
        } else {
          a = c;
          steps.push({
            title: 'Update Interval', 
            description: `f(a)*f(c) > 0, new interval: [${c.toFixed(6)}, ${b.toFixed(6)}]`,
            content: (
              <div className="flex flex-col items-center gap-4">
                <div className="text-center p-4 bg-orange-100 rounded-2xl">
                  <div className="font-bold text-orange-800">Root is in [c, b]</div>
                  <div className="text-sm text-orange-600 mt-1">New interval: [{c.toFixed(3)}, {b.toFixed(3)}]</div>
                </div>
              </div>
            )
          });
        }
      }
    } catch (e) {
      return [{ title: 'Error', description: 'Function evaluation error', content: (
        <div className="text-center p-8 bg-red-50 rounded-2xl">
          <div className="text-red-600 font-bold text-lg">Evaluation Error</div>
          <div className="text-red-500 text-sm mt-2">Cannot evaluate function at given points</div>
          <div className="text-red-400 text-xs mt-1">Check function domain and syntax</div>
        </div>
      ) }];
    }
    return steps;
  }, [fn, range]);

  const steps = useMemo(() => {
    if (method === 'bisection') return bisectionSteps;
    if (method === 'newton') return newtonSteps;
    if (method === 'false') return falsePositionSteps;
    if (method === 'secant') return secantSteps;
    if (method === 'bracketing') return bracketingSteps;
    if (method === 'illinois') return illinoisSteps;
    return [{title: 'Extension Point', description: 'Visualization engine loading...', content: <div className="text-gray-400 p-12">Coming Soon</div>}];
  }, [method, bisectionSteps, newtonSteps, falsePositionSteps, secantSteps, bracketingSteps, illinoisSteps]);

  return (
    <div className="space-y-8 h-full">
      <div className="glass rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex flex-wrap gap-3">
          {([
            { id: 'bisection', label: 'Bisection', desc: 'Guaranteed convergence', icon: '🎯' },
            { id: 'newton', label: 'Newton-Raphson', desc: 'Fast quadratic convergence', icon: '⚡' },
            { id: 'false', label: 'False Position', desc: 'Hybrid approach', icon: '🔄' },
            { id: 'secant', label: 'Secant', desc: 'No derivative needed', icon: '📈' },
            { id: 'bracketing', label: 'Bracketing Methods', desc: 'Interval refinement', icon: '📐' },
            { id: 'illinois', label: 'Illinois Method', desc: 'Modified false position', icon: '🌽' }
          ] as const).map(m => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setMethod(m.id); setCurrentStep(0); }}
              className={cn(
                 "flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all min-w-[120px] touch-manipulation",
                 method === m.id 
                   ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg" 
                   : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:shadow-md"
              )}
            >
              <span className="text-lg">{m.icon}</span>
              <span className="text-xs font-bold uppercase tracking-wider">{m.label}</span>
              <div className="text-[10px] opacity-70">{m.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className="glass rounded-3xl p-6 border border-white/20 shadow-xl space-y-6">
             <div className="flex items-center gap-3 font-bold text-gradient text-lg border-b border-slate-100 pb-4">
               <TrendingUp size={20} className="text-blue-600" /> Method Parameters
             </div>
             
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                     <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Function f(x)
                   </label>
                   <input 
                      value={fn} 
                      onChange={e => setFn(e.target.value)} 
                      className="w-full p-3 bg-white/50 border border-slate-200 focus:border-blue-500 rounded-xl outline-none font-mono text-sm focus-ring" 
                      placeholder="Enter function (e.g., x^2 - 4)"
                   />
                </div>
                
                {/* Example Functions */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Examples</label>
                  <div className="grid grid-cols-2 gap-2">
                    {exampleFunctions.slice(0, 4).map((example) => (
                      <button
                        key={example.fn}
                        onClick={() => { 
                          setFn(example.fn); 
                          setRange(example.range); 
                          setX0(example.x0);
                          setCurrentStep(0);
                        }}
                        className="p-2 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-xs"
                      >
                        <div className="font-mono font-semibold text-slate-700">{example.fn}</div>
                        <div className="text-slate-500">{example.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {method === 'bisection' || method === 'false' ? (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Search Interval</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                         <label className="text-[10px] text-slate-500 uppercase tracking-wider">Lower Bound a</label>
                         <input 
                           type="number" 
                           value={range.a} 
                           onChange={e => setRange({...range, a: Number(e.target.value)})} 
                           className="w-full p-2.5 bg-white/50 border border-slate-200 focus:border-green-500 rounded-lg outline-none font-mono text-sm focus-ring" 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] text-slate-500 uppercase tracking-wider">Upper Bound b</label>
                         <input 
                           type="number" 
                           value={range.b} 
                           onChange={e => setRange({...range, b: Number(e.target.value)})} 
                           className="w-full p-2.5 bg-white/50 border border-slate-200 focus:border-green-500 rounded-lg outline-none font-mono text-sm focus-ring" 
                         />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                       <span className="w-2 h-2 bg-purple-500 rounded-full"></span> Initial Guess x₀
                     </label>
                     <input 
                       type="number" 
                       value={x0} 
                       onChange={e => setX0(Number(e.target.value))} 
                       className="w-full p-3 bg-white/50 border border-slate-200 focus:border-purple-500 rounded-xl outline-none font-mono text-sm focus-ring" 
                       step="0.1"
                     />
                  </div>
                )}
             </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl text-white shadow-xl border border-white/10"
          >
             <h4 className="font-bold flex items-center gap-3 mb-4 text-sm uppercase tracking-wider text-blue-400">
               <LineChart size={18} /> Method Characteristics
             </h4>
             <div className="space-y-4">
               <div className="space-y-2">
                 <div className="flex justify-between text-xs">
                   <span className="text-slate-400">Convergence Speed</span>
                   <span className="text-blue-300 font-mono">
                     {method === 'bisection' ? 'Linear' : 
                      method === 'newton' ? 'Quadratic' : 
                      method === 'false' ? 'Superlinear' : 'Superlinear'}
                   </span>
                 </div>
                 <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: method === 'bisection' ? '40%' : method === 'newton' ? '90%' : '70%' }}
                     transition={{ delay: 0.5, duration: 1 }}
                     className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                   />
                 </div>
               </div>
               
               <div className="space-y-2">
                 <div className="flex justify-between text-xs">
                   <span className="text-slate-400">Reliability</span>
                   <span className="text-green-300 font-mono">
                     {method === 'bisection' ? 'Guaranteed' : 
                      method === 'newton' ? 'Conditional' : 
                      method === 'false' ? 'High' : 'Medium'}
                   </span>
                 </div>
                 <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: method === 'bisection' ? '95%' : method === 'newton' ? '60%' : '80%' }}
                     transition={{ delay: 0.7, duration: 1 }}
                     className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                   />
                 </div>
               </div>
               
               <div className="pt-3 border-t border-white/10">
                 <p className="text-[11px] text-slate-300 leading-relaxed">
                   {method === 'bisection' && "Reliably converges by halving the search interval each iteration. Perfect for bracketed roots."}
                   {method === 'newton' && "Uses tangent line approximation for extremely fast convergence when close to the root."}
                   {method === 'false' && "Combines reliability of bisection with speed improvements using linear interpolation."}
                   {method === 'secant' && "Approximates derivative using secant lines. Good balance of speed and simplicity."}
                 </p>
               </div>
             </div>
          </motion.div>
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
