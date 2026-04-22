const API_BASE_URL = 'http://localhost:5000/api';

export interface MatrixOperationRequest {
  matrix: number[][];
  vector?: number[];
}

export interface RootFindingRequest {
  function: string;
  a?: number;
  b?: number;
  x0?: number;
  x1?: number;
  max_iter?: number;
  tolerance?: number;
}

export interface Step {
  title: string;
  description: string;
  content?: any;
  matrix?: number[][];
  result?: number;
  result_matrix?: number[][];
  minor?: number[][];
  minor_det?: number;
  sign?: number;
  augmented?: number[][];
  inverse?: number[][];
  solution?: number[];
  final_solution?: number[];
  a?: number;
  b?: number;
  fa?: number;
  fb?: number;
  c?: number;
  fc?: number;
  new_a?: number;
  new_b?: number;
  x0?: number;
  fx0?: number;
  x1?: number;
  fx1?: number;
  x2?: number;
  fx2?: number;
  new_x0?: number;
  new_x1?: number;
  root?: number;
  iterations?: number;
  formula?: string;
}

export interface MatrixOperationResponse {
  steps: Step[];
  result?: number;
  result_matrix?: number[][];
  solution?: number[];
  root?: number;
  iterations?: number;
  error?: string;
}

export interface RootFindingResponse {
  steps: Step[];
  root?: number;
  iterations?: number;
  error?: string;
}

class ApiService {
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Matrix operations
  async calculateDeterminant(matrix: number[][]): Promise<MatrixOperationResponse> {
    return this.post<MatrixOperationResponse>('/matrix/determinant', { matrix });
  }

  async calculateInverse(matrix: number[][]): Promise<MatrixOperationResponse> {
    return this.post<MatrixOperationResponse>('/matrix/inverse', { matrix });
  }

  async solveLinearSystem(matrix: number[][], vector: number[]): Promise<MatrixOperationResponse> {
    return this.post<MatrixOperationResponse>('/matrix/solve-system', { matrix, vector });
  }

  // Root finding methods
  async falsePosition(request: RootFindingRequest): Promise<RootFindingResponse> {
    return this.post<RootFindingResponse>('/roots/false-position', request);
  }

  async secant(request: RootFindingRequest): Promise<RootFindingResponse> {
    return this.post<RootFindingResponse>('/roots/secant', request);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.get<{ status: string; message: string }>('/health');
  }
}

export const apiService = new ApiService();
