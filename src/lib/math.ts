
import * as math from 'mathjs';

export interface Matrix {
  values: number[][];
  rows: number;
  cols: number;
}

export interface Step {
  title: string;
  description: string;
  highlights?: {
    rows?: number[];
    cols?: number[];
    elements?: [number, number][]; // [row, col]
  };
  matrix?: number[][];
  extraData?: any;
}

// Matrix Operations
export const determinant2x2 = (m: number[][]) => m[0][0] * m[1][1] - m[0][1] * m[1][0];

export const getCofactor = (m: number[][], row: number, col: number) => {
  const result = m
    .filter((_, i) => i !== row)
    .map(r => r.filter((_, j) => j !== col));
  return result;
};

// Taylor Series evaluation
export const getTaylorTerm = (fn: string, x0: number, n: number) => {
  // Use mathjs to find nth derivative
  // This is non-trivial for general n, but we can do first few
  try {
    let currentFn = math.parse(fn);
    for (let i = 0; i < n; i++) {
      currentFn = math.derivative(currentFn, 'x');
    }
    const compiled = currentFn.compile();
    const val = compiled.evaluate({ x: x0 });
    const fact = math.factorial(n);
    return val / fact;
  } catch (err) {
    return 0;
  }
};

// Root finding logic
export const bisection = (fn: string, a: number, b: number, steps: number) => {
  const results = [];
  const compiled = math.compile(fn);
  let currA = a;
  let currB = b;
  
  for (let i = 0; i < steps; i++) {
    const mid = (currA + currB) / 2;
    const fA = compiled.evaluate({ x: currA });
    const fMid = compiled.evaluate({ x: mid });
    
    results.push({ a: currA, b: currB, mid, fA, fMid });
    
    if (fA * fMid < 0) {
      currB = mid;
    } else {
      currA = mid;
    }
  }
  return results;
};
