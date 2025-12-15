import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CalculatorService]
    });
    service = TestBed.inject(CalculatorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make POST request to compute endpoint', () => {
    const mockResponse = {
      id: 1,
      firstValue: '10',
      firstBase: 10,
      secondValue: '5',
      secondBase: 10,
      operation: 'ADD',
      resultValue: '15',
      executedAt: '2024-01-01T00:00:00'
    };

    service.compute('10', 10, '5', 10, 'ADD').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/calculations/compute?a=10&aBase=10&b=5&bBase=10&op=ADD');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle different operations', () => {
    const mockResponse = {
      id: 1,
      firstValue: '10',
      firstBase: 10,
      secondValue: '5',
      secondBase: 10,
      operation: 'SUBTRACT',
      resultValue: '5',
      executedAt: '2024-01-01T00:00:00'
    };

    service.compute('10', 10, '5', 10, 'SUBTRACT').subscribe(response => {
      expect(response.operation).toBe('SUBTRACT');
    });

    const req = httpMock.expectOne(req => req.url.includes('/compute'));
    expect(req.request.params.get('op')).toBe('SUBTRACT');
    req.flush(mockResponse);
  });

  it('should handle different number bases', () => {
    const mockResponse = {
      id: 1,
      firstValue: '1010',
      firstBase: 2,
      secondValue: '101',
      secondBase: 2,
      operation: 'ADD',
      resultValue: '1111',
      executedAt: '2024-01-01T00:00:00'
    };

    service.compute('1010', 2, '101', 2, 'ADD').subscribe(response => {
      expect(response.firstBase).toBe(2);
      expect(response.secondBase).toBe(2);
    });

    const req = httpMock.expectOne(req => req.url.includes('/compute'));
    expect(req.request.params.get('aBase')).toBe('2');
    expect(req.request.params.get('bBase')).toBe('2');
    req.flush(mockResponse);
  });
});
