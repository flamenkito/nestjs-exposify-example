export function jsonRpcClientTemplate(endpoint: string): string {
  return `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params?: unknown;
  id: number;
}

export interface JsonRpcResponse<T> {
  jsonrpc: '2.0';
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: number | null;
}

export class JsonRpcError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'JsonRpcError';
  }
}

@Injectable({ providedIn: 'root' })
export class JsonRpcClient {
  private endpoint = '${endpoint}';
  private requestId = 0;

  constructor(private http: HttpClient) {}

  call<T>(method: string, params?: unknown): Observable<T> {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      method,
      params,
      id: ++this.requestId,
    };

    return this.http.post<JsonRpcResponse<T>>(this.endpoint, request).pipe(
      map((response) => {
        if (response.error) {
          throw new JsonRpcError(
            response.error.code,
            response.error.message,
            response.error.data
          );
        }
        return response.result as T;
      })
    );
  }

  setEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
  }
}
`;
}
