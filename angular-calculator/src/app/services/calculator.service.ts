import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CalculationResponse {
  id: number;
  firstValue: string;
  firstBase: number;
  secondValue: string;
  secondBase: number;
  operation: string;
  resultValue: string;
  executedAt: string;
}

export type Operation = 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private apiUrl = 'http://localhost:8080/api/calculations';

  constructor(private http: HttpClient) {}

  compute(
    a: string,
    aBase: number,
    b: string,
    bBase: number,
    operation: Operation
  ): Observable<CalculationResponse> {
    const params = new HttpParams()
      .set('a', a)
      .set('aBase', aBase.toString())
      .set('b', b)
      .set('bBase', bBase.toString())
      .set('op', operation);

    return this.http.post<CalculationResponse>(`${this.apiUrl}/compute`, null, { params });
  }
}
