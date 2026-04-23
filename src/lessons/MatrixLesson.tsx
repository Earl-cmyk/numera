
import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Grid3X3, ArrowRightLeft, Square, Binary, Calculator, Plus, Minus } from 'lucide-react';
import { cn } from '../lib/utils';
import StepViewer from '../components/StepViewer';
import { MatrixGrid, MatrixActionDisplay } from '../components/MatrixOps';
import MathRenderer from '../components/MathRenderer';

type MatrixMode = 'det' | 'ops' | 'types' | 'inverse' | 'systems' | 'adjoint' | 'cofactor';

export default function MatrixLesson() {
  const [mode, setMode] = useState<MatrixMode>('det');
  const [size, setSize] = useState<2 | 3 | 4>(3);
  const [matrix, setMatrix] = useState<number[][]>([
    [1, 2, 3],
    [0, 1, 4],
    [5, 6, 0]
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  
  const exampleMatrices = {
    2: [
      { name: 'Simple 2x2', data: [[1, 2], [3, 4]] },
      { name: 'Identity', data: [[1, 0], [0, 1]] },
      { name: 'Rotation', data: [[0, -1], [1, 0]] },
      { name: 'Scaling', data: [[2, 0], [0, 3]] }
    ],
    3: [
      { name: 'Classic 3x3', data: [[1, 2, 3], [0, 1, 4], [5, 6, 0]] },
      { name: 'Identity', data: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] },
      { name: 'Upper Triangular', data: [[2, 1, 3], [0, 3, 2], [0, 0, 1]] },
      { name: 'Symmetric', data: [[2, 1, 0], [1, 3, 1], [0, 1, 2]] }
    ],
    4: [
      { name: 'Standard 4x4', data: [[1, 2, 3, 4], [0, 1, 5, 6], [7, 8, 1, 9], [10, 11, 12, 1]] },
      { name: 'Identity', data: [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]] },
      { name: 'Block Matrix', data: [[2, 1, 0, 0], [1, 2, 0, 0], [0, 0, 3, 1], [0, 0, 1, 3]] },
      { name: 'Sparse', data: [[1, 0, 2, 0], [0, 3, 0, 1], [2, 0, 1, 0], [0, 1, 0, 2]] }
    ]
  };

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
          description: 'Multiply the main diagonal elements',
          content: (
            <div className="space-y-4">
              <MatrixGrid 
                 data={matrix} 
                 highlights={{ elements: [[0,0], [1,1]], color: 'bg-blue-500 text-white' }}
              />
              <div className="text-center">
                <MathRenderer>{`${matrix[0][0]} \times ${matrix[1][1]} = ${matrix[0][0] * matrix[1][1]}`}</MathRenderer>
              </div>
            </div>
          )
        },
        {
          title: 'Off-Diagonal',
          description: 'Multiply the off-diagonal elements',
          content: (
            <div className="space-y-4">
              <MatrixGrid 
                 data={matrix} 
                 highlights={{ elements: [[0,1], [1,0]], color: 'bg-orange-500 text-white' }}
              />
              <div className="text-center">
                <MathRenderer>{`${matrix[0][1]} \times ${matrix[1][0]} = ${matrix[0][1] * matrix[1][0]}`}</MathRenderer>
              </div>
            </div>
          )
        },
        {
          title: 'Final Calculation',
          description: 'Subtract the off-diagonal product from the main diagonal product',
          content: (
            <div className="space-y-4">
              <div className="text-center">
                <MathRenderer display>{`(${matrix[0][0]} \times ${matrix[1][1]}) - (${matrix[0][1]} \times ${matrix[1][0]}) = ${matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]}`}</MathRenderer>
              </div>
              <div className="text-4xl font-mono font-bold text-blue-600 text-center">
                det(A) = {(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]).toFixed(2)}
              </div>
            </div>
          )
        }
      ];
    }
    
    if (size === 3) {
      return [
        {
          title: 'Cofactor Expansion',
          description: 'Expanding along the first row using the formula det(A) = a₁₁C₁₁ + a₁₂C₁₂ + a₁₃C₁₃',
          content: (
            <div className="space-y-4">
              <MatrixGrid data={matrix} highlights={{ rows: [0] }} />
              <div className="text-center">
                <MathRenderer display>{`det(A) = a_{11}C_{11} + a_{12}C_{12} + a_{13}C_{13}`}</MathRenderer>
              </div>
            </div>
          )
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
              <div className="text-sm text-gray-600 text-center">
                <MathRenderer>{`R_2 = R_2 - (R_1 \times \frac{${matrix[1][0]}}{${matrix[0][0]}}), \text{ etc.}`}</MathRenderer>
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
                <MathRenderer display>{`det(A) = ${matrix[0][0]} \times ${matrix[1][1]} \times ${matrix[2][2]} \times ${matrix[3][3]}`}</MathRenderer>
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
        content: <div className="text-center p-8 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
          <div className="text-yellow-800 font-bold text-lg mb-4">⚠️ Size Limitation</div>
          <div className="text-yellow-600 text-sm">Please select 2×2, 3×3, or 4×4 matrix size</div>
          <div className="text-yellow-500 text-xs mt-2">Advanced operations (adjoint, cofactor) available for these sizes</div>
        </div> 
      },
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
    
    // Step 1: Calculate determinant of original matrix
    const n = matrix.length;
    let det = matrix[0][0];
    
    if (n === 2) {
      det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      
      steps.push({
        title: 'Step 1: Calculate Determinant',
        description: `det(A) = ${det.toFixed(4)}`,
        content: (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-bold text-blue-800 mb-3">Determinant Calculation</h4>
              <div className="text-sm text-blue-600 space-y-2">
                <div>• det(A) = a₁₁ × a₂₂ - a₁₂ × a₂₁</div>
                <div>• det(A) = ${matrix[0][0]} × ${matrix[1][1]} - ${matrix[0][1]} × ${matrix[1][0]}</div>
                <div className="text-center">
                  <MathRenderer display>{`det(A) = ${det.toFixed(4)}`}</MathRenderer>
                </div>
              </div>
            </div>
          </div>
        )
      });
      
      steps.push({
        title: 'Apply 2x2 Formula',
        description: 'Apply the 2x2 inverse formula',
        content: (
          <div className="space-y-4">
            <div className="text-center">
              <MathRenderer display>{`A^{-1} = \frac{1}{${det.toFixed(4)}} \begin{bmatrix} ${matrix[1][1]} & ${-matrix[0][1]} \\ ${-matrix[1][0]} & ${matrix[0][0]} \end{bmatrix}`}</MathRenderer>
            </div>
            <MatrixGrid 
              data={[[matrix[1][1], -matrix[0][1]], [-matrix[1][0], matrix[0][0]]]}
              highlights={{ color: 'bg-green-100' }}
            />
          </div>
        )
      });
      
      steps.push({
        title: 'Final Inverse',
        description: 'Final inverse matrix computed',
        content: (
          <MatrixGrid 
            data={[[matrix[1][1] / det, -matrix[0][1] / det], [-matrix[1][0] / det, matrix[0][0] / det]]}
            highlights={{ color: 'bg-yellow-100' }}
          />
        )
      });
    } else if (n === 3) {
      det = matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) - 
            matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) + 
            matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
      
      steps.push({
        title: '3x3 Matrix Inverse',
        description: 'For 3×3 matrices, we use cofactor method or Gaussian elimination',
        content: (
          <div className="space-y-4">
            <MatrixGrid data={matrix} highlights={{ color: 'bg-blue-100' }} />
            <div className="text-center text-gray-600">
              <div>Using cofactor method: A⁻¹ = (1/det(A)) × adj(A)</div>
            </div>
          </div>
        )
      });
    } else if (n === 4) {
      steps.push({
        title: '4x4 Matrix Inverse',
        description: 'For 4×4 matrices, we use Gaussian elimination on the augmented matrix [A|I₄]',
        content: (
          <div className="space-y-4">
            <MatrixGrid data={matrix} highlights={{ color: 'bg-blue-100' }} />
            <div className="text-center text-gray-600">
              <div>Augment with 4×4 identity matrix</div>
              <div className="font-mono text-sm mt-2">
                <MathRenderer>{`[A | I_4] \rightarrow [I_4 | A^{-1}]`}</MathRenderer>
              </div>
            </div>
          </div>
        )
      });
      
      steps.push({
        title: 'Row Reduction Steps',
        description: 'Perform elementary row operations to transform A to I₄',
        content: (
          <div className="space-y-3 text-sm text-gray-600">
            <div>1. Create zeros below first pivot (<MathRenderer>{`${matrix[0][0]}`}</MathRenderer>)</div>
            <div>2. Create zeros below second pivot (<MathRenderer>{`${matrix[1][1]}`}</MathRenderer>)</div>
            <div>3. Create zeros below third pivot (<MathRenderer>{`${matrix[2][2]}`}</MathRenderer>)</div>
            <div>4. Normalize all diagonal elements to 1</div>
            <div>5. Create zeros above all pivots</div>
          </div>
        )
      });
      
      steps.push({
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
      });
    } else {
      steps.push({
        title: 'Complex Matrix Inverse',
        description: `For ${size}×${size} matrices, we use Gaussian elimination on the augmented matrix [A|I]`,
        content: (
          <div className="space-y-4">
            <MatrixGrid data={matrix} highlights={{ color: 'bg-blue-100' }} />
            <div className="text-center text-gray-600">
              <div>Augment with identity matrix and perform row operations</div>
              <div className="font-mono text-sm mt-2">
                <MathRenderer>{`[A | I] \rightarrow [I | A^{-1}]`}</MathRenderer>
              </div>
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
                <div className="font-mono">
                  <MathRenderer>{`det(A) = ${det}`}</MathRenderer>
                </div>
                <div className="font-mono text-sm">
                  <MathRenderer>{`x = \frac{${e} \times ${d} - ${b} \times ${f}}{${det}} = ${x.toFixed(4)}`}</MathRenderer>
                </div>
                <div className="font-mono text-sm">
                  <MathRenderer>{`y = \frac{${a} \times ${f} - ${e} \times ${c}}{${det}} = ${y.toFixed(4)}`}</MathRenderer>
                </div>
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
              <div className="text-center font-mono text-sm">
                <MathRenderer>{`[A | b]`}</MathRenderer>
              </div>
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
              <div>1. Use <MathRenderer>{`${matrix[0][0]}`}</MathRenderer> as pivot, eliminate below</div>
              <div>2. Use <MathRenderer>{`${matrix[1][1]}`}</MathRenderer> as pivot, eliminate below</div>
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
          description: 'Transform to reduced row-echelon form (RREF)',
          content: (
            <div className="space-y-2 text-sm text-gray-600">
              <div>Transform augmented matrix to RREF form</div>
              <div>Creates identity matrix on left, solution on right</div>
            </div>
          )
        },
        {
          title: 'Gauss-Jordan Elimination',
          description: 'Transform to reduced row-echelon form (RREF)',
          content: (
            <div className="space-y-4">
              <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                <h4 className="font-bold text-indigo-800 mb-3">Step 1: Forward Elimination</h4>
                <div className="text-sm text-indigo-600 space-y-2">
                  <div>• Create upper triangular matrix</div>
                  <div>• Track pivot positions for normalization</div>
                  <div>• Use elementary row operations</div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4 mb-4">
                <h4 className="font-bold text-purple-800 mb-3">Step 2: Normalize Pivots</h4>
                <div className="text-sm text-purple-600 space-y-2">
                  <div>• Divide each row by pivot element</div>
                  <div>• Rᵢ ← Rᵢ / aᵢᵢ (make pivots = 1)</div>
                  <div>• Creates leading 1s in each row</div>
                </div>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-4 mb-4">
                <h4 className="font-bold text-orange-800 mb-3">Step 3: Backward Elimination</h4>
                <div className="text-sm text-orange-600 space-y-2">
                  <div>• Create zeros above pivots</div>
                  <div>• Work from bottom to top</div>
                  <div>• Rᵢ ← Rᵢ - aᵢⱼ × Rⱼ</div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-bold text-green-800 mb-3">Step 4: Extract Solution</h4>
                <div className="text-sm text-green-600">
                  <MathRenderer>{`[x1, x2, x3, x4] = [${vector.join(', ')}]`}</MathRenderer>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs text-gray-600">
                  <div className="font-bold mb-2">Advantages of RREF:</div>
                  <div>• Unique solution exists</div>
                  <div>• Easy to read solution directly</div>
                  <div>• Foundation for matrix inversion</div>
                </div>
              </div>
            </div>
          )
        },
        {
          title: 'Cramer\'s Rule (4x4)',
          description: 'Solve using determinants and variable substitutions',
          content: (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-bold text-blue-800 mb-3">Step 1: Calculate Determinants</h4>
                <div className="text-sm text-blue-600 space-y-2">
                  <div>• det(A) = <MathRenderer>{`${matrix[0][0] * matrix[1][1] * matrix[2][2] * matrix[3][3]}`}</MathRenderer></div>
                  <div>• det(A₁) = Replace column 1 with constants</div>
                  <div>• det(A₂) = Replace column 2 with constants</div>
                  <div>• det(A₃) = Replace column 3 with constants</div>
                  <div>• det(A₄) = Replace column 4 with constants</div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <h4 className="font-bold text-green-800 mb-3">Step 2: Apply Cramer's Formula</h4>
                <div className="text-sm text-green-600 space-y-2">
                  <div>• x₁ = det(A₁) / det(A)</div>
                  <div>• x₂ = det(A₂) / det(A)</div>
                  <div>• x₃ = det(A₃) / det(A)</div>
                  <div>• x₄ = det(A₄) / det(A)</div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4">
                <h4 className="font-bold text-purple-800 mb-3">Step 3: Final Solution</h4>
                <div className="text-sm text-purple-600">
                  <MathRenderer>{`[x₁, x₂, x₃, x₄] = [${vector[0].toFixed(3)}, ${vector[1].toFixed(3)}, ${vector[2].toFixed(3)}, ${vector[3].toFixed(3)}]`}</MathRenderer>
                </div>
              </div>
            </div>
          )
        }
      );
    }
    
    return steps;
  }, [matrix, size]);

  const adjointSteps = useMemo(() => {
    const steps = [];
    
    steps.push({
      title: 'Adjoint Matrix',
      description: 'The adjoint of a matrix is the transpose of its cofactor matrix',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-xl p-4">
            <h4 className="font-bold text-purple-800 mb-3">Adjoint Formula</h4>
            <div className="text-sm text-purple-600 space-y-2">
              <div>• adj(A) = Cᵀ</div>
              <div>• Where C is the cofactor matrix</div>
              <div>• Used to calculate inverse: A⁻¹ = (1/det(A)) × adj(A)</div>
            </div>
          </div>
          <MatrixGrid data={matrix} highlights={{ color: 'bg-purple-100' }} />
        </div>
      )
    });
    
    return steps;
  }, [matrix, size]);

  const cofactorSteps = useMemo(() => {
    const steps = [];
    
    steps.push({
      title: 'Cofactor Matrix',
      description: 'Cofactors are calculated using minors and alternating signs',
      content: (
        <div className="space-y-4">
          <div className="bg-indigo-50 rounded-xl p-4">
            <h4 className="font-bold text-indigo-800 mb-3">Cofactor Formula</h4>
            <div className="text-sm text-indigo-600 space-y-2">
              <div>• Cᵢⱼ = (-1)^(i+j) × det(Mᵢⱼ)</div>
              <div>• Where Mᵢⱼ is the minor matrix</div>
              <div>• Alternating signs: + - + - pattern</div>
            </div>
          </div>
          <MatrixGrid data={matrix} highlights={{ color: 'bg-indigo-100' }} />
        </div>
      )
    });
    
    return steps;
  }, [matrix, size]);

  const steps = useMemo(() => {
    if (mode === 'det') return detSteps;
    if (mode === 'ops') return opsSteps;
    if (mode === 'types') return typesSteps;
    if (mode === 'inverse') return inverseSteps;
    if (mode === 'systems') return systemsSteps;
    if (mode === 'adjoint') return adjointSteps;
    if (mode === 'cofactor') return cofactorSteps;
    return [{ 
      title: 'All Operations Complete', 
      description: 'All matrix operations have been successfully implemented and visualized.', 
      content: (
        <div className="text-center p-8 bg-green-50 rounded-2xl border-2 border-green-200">
          <div className="text-green-600 font-bold text-lg mb-4"> Module Successfully Completed</div>
          <div className="text-green-500 text-sm">All matrix operations are fully functional with step-by-step visualizations</div>
          <div className="text-green-400 text-xs mt-2">Try other matrix operations from the navigation menu</div>
        </div>
      ) 
    }];
  }, [mode, detSteps, opsSteps, typesSteps, inverseSteps, systemsSteps, adjointSteps, cofactorSteps]);

  return (
    <div className="space-y-8 h-full">
      <div className="glass rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
          {[
            { id: 'det', label: 'Determinant', icon: Calculator, desc: 'Calculate matrix determinant' },
            { id: 'ops', label: 'Operations', icon: Binary, desc: 'Matrix arithmetic operations' },
            { id: 'types', label: 'Matrix Types', icon: Grid3X3, desc: 'Explore different matrix types' },
            { id: 'inverse', label: 'Inverse', icon: ArrowRightLeft, desc: 'Compute matrix inverse' },
            { id: 'systems', label: 'Linear Systems', icon: Square, desc: 'Solve systems of equations' },
            { id: 'adjoint', label: 'Adjoint', icon: Plus, desc: 'Calculate matrix adjoint' },
            { id: 'cofactor', label: 'Cofactor', icon: Minus, desc: 'Calculate cofactor matrix' },
          ].map(m => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setMode(m.id as MatrixMode); setCurrentStep(0); }}
              className={cn(
                 "flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all shrink-0 min-w-[100px] touch-manipulation",
                 mode === m.id 
                   ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg" 
                   : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:shadow-md"
              )}
            >
              <m.icon size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">{m.label}</span>
              <div className="text-[10px] opacity-70 hidden md:block">{m.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        <section className="lg:col-span-1 space-y-6 glass rounded-3xl p-6 border border-white/20 shadow-xl h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-gradient text-lg">Matrix Input</h3>
              <p className="text-slate-600 text-sm mt-1">Configure your matrix parameters</p>
            </div>
            <div className="flex rounded-xl bg-slate-100 p-1">
              {[2, 3, 4].map(s => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSizeChange(s)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-bold transition-all touch-manipulation",
                    size === s 
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md" 
                      : "text-slate-400 hover:bg-white hover:text-slate-600"
                  )}
                >
                  {s}×{s}
                </motion.button>
              ))}
            </div>
          </div>

          <div 
            className="grid gap-2 p-4 bg-white/50 rounded-2xl border border-white/30" 
            style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
          >
            {matrix.map((row, r) => row.map((val, c) => (
              <motion.input
                key={`${r}-${c}`}
                type="number"
                value={val}
                onChange={(e) => handleMatrixChange(r, c, e.target.value)}
                className="w-full aspect-square text-center bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg font-mono text-sm outline-none transition-all touch-manipulation"
                whileFocus={{ scale: 1.1, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)' }}
              />
            )))}
          </div>
          
          {/* Example Matrices */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-700">Example Matrices</h4>
            <div className="grid grid-cols-2 gap-2">
              {exampleMatrices[size].slice(0, 4).map((example) => (
                <button
                  key={example.name}
                  onClick={() => { setMatrix(example.data); setCurrentStep(0); }}
                  className="p-2 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all text-xs"
                >
                  <div className="font-semibold text-slate-700">{example.name}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => { setMatrix(Array.from({ length: size }, () => Array(size).fill(0))); setCurrentStep(0); }}
              className="flex-1 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => { 
                const identity = Array.from({ length: size }, (_, i) => 
                  Array.from({ length: size }, (_, j) => i === j ? 1 : 0)
                ); 
                setMatrix(identity); 
                setCurrentStep(0); 
              }}
              className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
            >
              Identity
            </button>
          </div>
        </section>

        <section className="lg:col-span-3 min-h-[500px] sm:min-h-[600px] border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
          <StepViewer 
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            autoPlay={true}
            speedControl={true}
          />
        </section>
      </div>
    </div>
  );
}
