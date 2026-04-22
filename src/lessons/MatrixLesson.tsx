
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Grid3X3, ArrowRightLeft, Square, Binary, Calculator } from 'lucide-react';
import { cn } from '../lib/utils';
import StepViewer from '../components/StepViewer';
import { MatrixGrid, MatrixActionDisplay } from '../components/MatrixOps';

type MatrixMode = 'det' | 'ops' | 'types' | 'inverse' | 'systems';

export default function MatrixLesson() {
  const [mode, setMode] = useState<MatrixMode>('det');
  const [size, setSize] = useState<2 | 3 | 4>(3);
  const [matrix, setMatrix] = useState<number[][]>([
    [1, 2, 3],
    [0, 1, 4],
    [5, 6, 0]
  ]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleMatrixChange = (r: number, c: number, val: string) => {
    const num = parseFloat(val) || 0;
    const newMatrix = [...matrix.map(row => [...row])];
    newMatrix[r][c] = num;
    setMatrix(newMatrix);
  };

  const handleSizeChange = (s: number) => {
    const newSize = s as 2 | 3 | 4;
    setSize(newSize);
    const newMatrix = Array.from({ length: s }, () => Array(s).fill(0));
    for (let i = 0; i < Math.min(s, matrix.length); i++) {
        for (let j = 0; j < Math.min(s, matrix[0].length); j++) {
            newMatrix[i][j] = matrix[i][j];
        }
    }
    setMatrix(newMatrix);
    setCurrentStep(0);
  };

  const detSteps = useMemo(() => {
    if (size === 2) {
      return [
        {
          title: 'Initial Position',
          description: 'For a 2x2 matrix, the determinant is simple: multiplication of main diagonal minus multiplication of off-diagonal.',
          content: (
            <MatrixGrid 
              data={matrix} 
              highlights={{ elements: [[0,0], [1,1]], color: 'bg-blue-100' }}
            />
          )
        },
        {
          title: 'Main Diagonal',
          description: `Multiply ${matrix[0][0]} * ${matrix[1][1]} = ${matrix[0][0] * matrix[1][1]}`,
          content: (
            <MatrixGrid 
               data={matrix} 
               highlights={{ elements: [[0,0], [1,1]], color: 'bg-blue-500 text-white' }}
            />
          )
        },
        {
          title: 'Off-Diagonal',
          description: `Multiply ${matrix[0][1]} * ${matrix[1][0]} = ${matrix[0][1] * matrix[1][0]}`,
          content: (
            <MatrixGrid 
               data={matrix} 
               highlights={{ elements: [[0,1], [1,0]], color: 'bg-orange-500 text-white' }}
            />
          )
        },
        {
          title: 'Final Calculation',
          description: `(${matrix[0][0]} * ${matrix[1][1]}) - (${matrix[0][1]} * ${matrix[1][0]}) = ${matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]}`,
          content: (
            <div className="text-4xl font-mono font-bold text-blue-600">
               det(A) = {(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]).toFixed(2)}
            </div>
          )
        }
      ];
    }
    
    if (size === 3) {
      return [
        {
          title: 'Cofactor Expansion',
          description: 'Expanding along the first row. Determinant = a₁₁C₁₁ + a₁₂C₁₂ + a₁₃C₁₃',
          content: <MatrixGrid data={matrix} highlights={{ rows: [0] }} />
        },
        ...[0, 1, 2].flatMap(col => [
          {
            title: `Minor for Element [0, ${col}]`,
            description: `Pick element ${matrix[0][col]}. Remove row 0 and column ${col}.`,
            content: (
              <MatrixGrid 
                data={matrix} 
                highlights={{ rows: [0], cols: [col], elements: [[0, col]], color: 'bg-red-100' }} 
              />
            )
          },
          {
            title: `Resulting 2x2 Minor`,
            description: `The remaining elements form a smaller matrix. We calculate its determinant and multiply by the element and its sign (+ - +).`,
            content: (
              <div className="flex flex-col items-center gap-4">
                <MatrixGrid 
                  data={matrix.filter((_, r) => r !== 0).map(row => row.filter((_, c) => c !== col))} 
                  highlights={{ color: 'bg-green-100' }}
                />
                <div className="text-xl font-bold">Sign: {col % 2 === 0 ? '+' : '-'}</div>
              </div>
            )
          }
        ])
      ];
    }

    if (size === 4) {
      return [
        {
          title: '4x4 Pivotal Method',
          description: 'For 4x4 matrices, we use row operations to create zeros below pivots. This reduces complexity from O(n!) to O(n³).',
          content: <MatrixGrid data={matrix} highlights={{ elements: [[0,0]] }} />
        },
        {
          title: 'First Pivot Operation',
          description: `Use element ${matrix[0][0]} as pivot to eliminate below it in column 0.`,
          content: (
            <div className="space-y-4">
              <MatrixGrid 
                data={matrix} 
                highlights={{ elements: [[0,0], [1,0], [2,0], [3,0]], color: 'bg-blue-100' }} 
              />
              <div className="text-sm text-gray-600">
                Row operations: R₂ = R₂ - (R₁ × {matrix[1][0]}/{matrix[0][0]}), etc.
              </div>
            </div>
          )
        },
        {
          title: 'Upper Triangular Form',
          description: 'After eliminating below all pivots, we get an upper triangular matrix.',
          content: (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                The determinant is the product of diagonal elements in upper triangular form.
              </div>
              <div className="font-mono text-center">
                det(A) = {matrix[0][0]} × {matrix[1][1]} × {matrix[2][2]} × {matrix[3][3]}
              </div>
            </div>
          )
        }
      ];
    }

    return [
      { 
        title: 'Matrix Size Not Supported', 
        description: 'Determinant calculation is available for 2x2, 3x3, and 4x4 matrices.', 
        content: <div>Please select a supported matrix size.</div> 
      }
    ];
  }, [matrix, size]);

  const opsSteps = useMemo(() => {
    const result = matrix.map(r => r.map(v => v + v));
    const allEl: [number, number][] = [];
    for(let r=0; r<size; r++) for(let c=0; c<size; c++) allEl.push([r,c]);

    return allEl.map(([r,c]) => ({
      title: `Adding Entry [${r}, ${c}]`,
      description: `Target entries matched: ${matrix[r][c]} + ${matrix[r][c]} = ${matrix[r][c] + matrix[r][c]}`,
      content: (
        <MatrixActionDisplay 
          m1={matrix} 
          m2={matrix} 
          result={result} 
          operator="+" 
          highlightIdx={[r,c]} 
        />
      )
    }));
  }, [matrix, size]);

  const typesSteps = useMemo(() => {
    const types = [
      { name: 'Identity Matrix', desc: 'Main diagonal is 1s, others are 0s.', fn: (r:number, c:number) => r === c ? 1 : 0 },
      { name: 'Zero Matrix', desc: 'All entries are zero.', fn: () => 0 },
      { name: 'Diagonal Matrix', desc: 'Entries outside main diagonal are zero.', fn: (r:number, c:number) => r === c ? Math.floor(Math.random()*9)+1 : 0 },
      { name: 'Upper Triangular', desc: 'Entries below main diagonal are zero.', fn: (r:number, c:number) => r <= c ? Math.floor(Math.random()*9)+1 : 0 },
    ];
    return types.map(t => ({
      title: t.name,
      description: t.desc,
      content: (
        <div className="text-center space-y-4">
           <MatrixGrid 
             data={Array.from({length: size}, (_, r) => Array.from({length: size}, (_, c) => t.fn(r,c)))} 
             highlights={{ color: 'bg-blue-100' }}
           />
        </div>
      )
    }));
  }, [size]);

  const inverseSteps = useMemo(() => {
    const steps = [];
    
    // Calculate determinant first
    const det = matrix.reduce((acc, row, i) => {
      if (size === 2) {
        return acc + (i === 0 ? row[0] * matrix[1][1] - row[1] * matrix[1][0] : 0);
      }
      return acc;
    }, 0);
    
    if (size === 2) {
      const [a, b] = matrix[0];
      const [c, d] = matrix[1];
      const determinant = a * d - b * c;
      
      if (Math.abs(determinant) < 1e-10) {
        steps.push({
          title: 'Singular Matrix',
          description: 'Determinant is zero, so the inverse does not exist.',
          content: <div className="text-red-600 font-bold">Matrix is not invertible</div>
        });
      } else {
        const invDet = 1 / determinant;
        steps.push(
          {
            title: 'Check Determinant',
            description: `det(A) = ${a} * ${d} - ${b} * ${c} = ${determinant}`,
            content: <MatrixGrid data={matrix} highlights={{ color: 'bg-blue-100' }} />
          },
          {
            title: 'Apply 2x2 Formula',
            description: `A⁻¹ = (1/${determinant}) * [[${d}, ${-b}], [${-c}, ${a}]]`,
            content: (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="font-mono text-lg">1/{determinant} ×</div>
                  <MatrixGrid 
                    data={[[d, -b], [-c, a]]} 
                    highlights={{ color: 'bg-green-100' }}
                  />
                </div>
              </div>
            )
          },
          {
            title: 'Final Inverse',
            description: `A⁻¹ = [[${(d * invDet).toFixed(4)}, ${(-b * invDet).toFixed(4)}], [${(-c * invDet).toFixed(4)}, ${(a * invDet).toFixed(4)}]]`,
            content: (
              <MatrixGrid 
                data={[[d * invDet, -b * invDet], [-c * invDet, a * invDet]]} 
                highlights={{ color: 'bg-yellow-100' }}
              />
            )
          }
        );
      }
    } else if (size === 4) {
      steps.push(
        {
          title: '4x4 Matrix Inverse',
          description: 'For 4×4 matrices, we use Gaussian elimination on the augmented matrix [A|I₄]',
          content: (
            <div className="space-y-4">
              <MatrixGrid data={matrix} highlights={{ color: 'bg-blue-100' }} />
              <div className="text-center text-gray-600">
                <div>Augment with 4×4 identity matrix</div>
                <div className="font-mono text-sm mt-2">[A | I₄] → [I₄ | A⁻¹]</div>
              </div>
            </div>
          )
        },
        {
          title: 'Row Reduction Steps',
          description: 'Perform elementary row operations to transform A to I₄',
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <div>1. Create zeros below first pivot (${matrix[0][0]})</div>
              <div>2. Create zeros below second pivot (${matrix[1][1]})</div>
              <div>3. Create zeros below third pivot (${matrix[2][2]})</div>
              <div>4. Normalize all diagonal elements to 1</div>
              <div>5. Create zeros above all pivots</div>
            </div>
          )
        },
        {
          title: 'Final Result',
          description: 'The right side of the augmented matrix becomes A⁻¹',
          content: (
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="font-bold text-green-800">Inverse Matrix A⁻¹</div>
              <div className="text-sm text-green-600 mt-2">
                Contains 16 elements computed through row reduction
              </div>
            </div>
          )
        }
      );
    } else {
      steps.push({
        title: 'Complex Matrix Inverse',
        description: `For ${size}×${size} matrices, we use Gaussian elimination on the augmented matrix [A|I]`,
        content: (
          <div className="space-y-4">
            <MatrixGrid data={matrix} highlights={{ color: 'bg-blue-100' }} />
            <div className="text-center text-gray-600">
              <div>Augment with identity matrix and perform row operations</div>
              <div className="font-mono text-sm mt-2">[A | I] → [I | A⁻¹]</div>
            </div>
          </div>
        )
      });
    }
    
    return steps;
  }, [matrix, size]);

  const systemsSteps = useMemo(() => {
    const steps = [];
    const vector = [1, 2, 3].slice(0, size); // Default vector
    
    steps.push({
      title: 'System Setup',
      description: `Solving Ax = b where A is ${size}×${size} and b is a vector of constants`,
      content: (
        <div className="space-y-4">
          <MatrixGrid data={matrix} highlights={{ color: 'bg-blue-100' }} />
          <div className="text-center">
            <div className="font-mono">A × x = b</div>
            <div className="font-mono text-sm">b = [{vector.join(', ')}]</div>
          </div>
        </div>
      )
    });
    
    if (size === 2) {
      const [a, b] = matrix[0];
      const [c, d] = matrix[1];
      const [e, f] = vector;
      const det = a * d - b * c;
      
      if (Math.abs(det) < 1e-10) {
        steps.push({
          title: 'No Unique Solution',
          description: 'Determinant is zero, system has either no solution or infinitely many solutions',
          content: <div className="text-red-600">Singular system</div>
        });
      } else {
        const x = (e * d - b * f) / det;
        const y = (a * f - e * c) / det;
        
        steps.push(
          {
            title: 'Cramer\'s Rule',
            description: 'Using Cramer\'s rule: x = det(Ax)/det(A), y = det(Ay)/det(A)',
            content: (
              <div className="space-y-2 text-center">
                <div className="font-mono">det(A) = {det}</div>
                <div className="font-mono text-sm">x = ({e}×{d} - {b}×{f})/{det} = {x.toFixed(4)}</div>
                <div className="font-mono text-sm">y = ({a}×{f} - {e}×{c})/{det} = {y.toFixed(4)}</div>
              </div>
            )
          },
          {
            title: 'Solution',
            description: `The solution is x = [${x.toFixed(4)}, ${y.toFixed(4)}]`,
            content: (
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <div className="font-bold text-lg">Solution Vector</div>
                <div className="font-mono text-xl">[{x.toFixed(4)}, {y.toFixed(4)}]</div>
              </div>
            )
          }
        );
      }
    } else if (size === 3) {
      // 3x3 system with augmented matrix representation
      const augmentedMatrix = matrix.map((row, i) => [...row, vector[i]]);
      
      steps.push(
        {
          title: 'Augmented Matrix',
          description: 'Create augmented matrix [A|b] for solving the system',
          content: (
            <div className="space-y-4">
              <div className="text-center font-mono text-sm">[A | b]</div>
              <MatrixGrid 
                data={augmentedMatrix} 
                highlights={{ cols: [3], color: 'bg-yellow-100' }} 
              />
            </div>
          )
        },
        {
          title: 'Gaussian Elimination Steps',
          description: 'Transform to row-echelon form using elementary row operations',
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <div>1. Use ${matrix[0][0]} as pivot, eliminate below</div>
              <div>2. Use ${matrix[1][1]} as pivot, eliminate below</div>
              <div>3. Normalize diagonal elements to 1</div>
              <div>4. Back substitution to find solution</div>
            </div>
          )
        },
        {
          title: 'Cramer\'s Rule (3x3)',
          description: 'For 3x3 systems: x = det(Ax)/det(A), y = det(Ay)/det(A), z = det(Az)/det(A)',
          content: (
            <div className="space-y-2 text-sm text-gray-600">
              <div>Replace each column with vector b and calculate determinants</div>
              <div className="font-mono">det(A) = ${matrix[0][0]}×det(minor) - ${matrix[0][1]}×det(minor) + ${matrix[0][2]}×det(minor)</div>
            </div>
          )
        },
        {
          title: 'Gauss-Jordan Method',
          description: 'Transform augmented matrix to [I|x] form',
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <div>1. Forward elimination (same as Gaussian)</div>
              <div>2. Backward elimination to create zeros above pivots</div>
              <div>3. Result: [I₃ | solution vector]</div>
            </div>
          )
        }
      );
    } else if (size === 4) {
      // 4x4 system examples
      const augmentedMatrix = matrix.map((row, i) => [...row, vector[i] || 0]);
      
      steps.push(
        {
          title: '4x4 Augmented Matrix',
          description: 'System of 4 equations with 4 variables',
          content: (
            <div className="space-y-4">
              <div className="text-center font-mono text-sm">[A₄×₄ | b₄×₁]</div>
              <MatrixGrid 
                data={augmentedMatrix} 
                highlights={{ cols: [4], color: 'bg-yellow-100' }} 
              />
            </div>
          )
        },
        {
          title: 'Gaussian Elimination',
          description: 'Transform to upper triangular form',
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <div>1. Create zeros below pivot ${matrix[0][0]}</div>
              <div>2. Create zeros below pivot ${matrix[1][1]}</div>
              <div>3. Create zeros below pivot ${matrix[2][2]}</div>
              <div>4. Back substitution for 4 variables</div>
            </div>
          )
        },
        {
          title: 'Gauss-Jordan Complete',
          description: 'Transform to reduced row-echelon form',
          content: (
            <div className="space-y-3 text-sm text-gray-600">
              <div>1. Forward elimination to upper triangular</div>
              <div>2. Normalize all pivots to 1</div>
              <div>3. Backward elimination to create zeros above</div>
              <div>4. Result: [I₄ | solution vector]</div>
            </div>
          )
        },
        {
          title: 'Cramer\'s Rule (4x4)',
          description: 'Calculate 5 determinants (original + 4 replacements)',
          content: (
            <div className="space-y-2 text-sm text-gray-600">
              <div>Computational intensive: O(4!) = 24 operations per determinant</div>
              <div>Gaussian elimination preferred for larger systems</div>
            </div>
          )
        }
      );
    } else {
      steps.push({
        title: 'Gaussian Elimination',
        description: 'For larger systems, we use Gaussian elimination to transform to row-echelon form',
        content: (
          <div className="text-center text-gray-600">
            <div>Augmented matrix [A|b]</div>
            <div className="font-mono text-sm mt-2">Row operations → Back substitution</div>
          </div>
        )
      });
    }
    
    return steps;
  }, [matrix, size]);

  const steps = useMemo(() => {
    if (mode === 'det') return detSteps;
    if (mode === 'ops') return opsSteps;
    if (mode === 'types') return typesSteps;
    if (mode === 'inverse') return inverseSteps;
    if (mode === 'systems') return systemsSteps;
    return [{ title: 'Module in Dev', description: 'This module is being animated...', content: <div>Coming Soon</div> }];
  }, [mode, detSteps, opsSteps, typesSteps, inverseSteps, systemsSteps]);

  return (
    <div className="space-y-8 h-full">
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar border-b border-slate-200">
        {[
          { id: 'det', label: 'Determinant', icon: Calculator },
          { id: 'ops', label: 'Operations', icon: Binary },
          { id: 'types', label: 'Matrix Types', icon: Grid3X3 },
          { id: 'inverse', label: 'Inverse', icon: ArrowRightLeft },
          { id: 'systems', label: 'Linear Systems', icon: Square },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id as MatrixMode); setCurrentStep(0); }}
            className={cn(
               "flex items-center gap-2 px-4 py-2 border-b-2 transition-all shrink-0 text-sm font-bold uppercase tracking-wider",
               mode === m.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            <m.icon size={16} /> {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <section className="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm uppercase">Input Matrix</h3>
            <div className="flex rounded-lg bg-slate-100 p-0.5">
              {[2, 3, 4].map(s => (
                <button
                  key={s}
                  onClick={() => handleSizeChange(s)}
                  className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold transition-all",
                    size === s ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"
                  )}
                >
                  {s}x{s}
                </button>
              ))}
            </div>
          </div>

          <div 
            className="grid gap-2" 
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
          >
            {matrix.map((row, r) => row.map((val, c) => (
              <input
                key={`${r}-${c}`}
                type="number"
                value={val}
                onChange={(e) => handleMatrixChange(r, c, e.target.value)}
                className="w-full aspect-square text-center bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg font-mono text-sm outline-none transition-all"
              />
            )))}
          </div>
        </section>

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
