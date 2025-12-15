import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CalculatorService } from './services/calculator.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let calculatorService: jasmine.SpyObj<CalculatorService>;

  beforeEach(async () => {
    const calculatorServiceSpy = jasmine.createSpyObj('CalculatorService', ['compute']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: CalculatorService, useValue: calculatorServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    calculatorService = TestBed.inject(CalculatorService) as jasmine.SpyObj<CalculatorService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.firstNumber).toBe('');
    expect(component.secondNumber).toBe('');
    expect(component.operation).toBe('ADD');
    expect(component.selectedBase).toBe(10);
    expect(component.result).toBe('');
  });

  it('should return true for isDivision when operation is DIVIDE', () => {
    component.operation = 'DIVIDE';
    expect(component.isDivision).toBe(true);

    component.operation = 'ADD';
    expect(component.isDivision).toBe(false);
  });

  it('should return false for canCalculate when numbers are empty', () => {
    component.firstNumber = '';
    component.secondNumber = '';
    expect(component.canCalculate).toBe(false);
  });

  it('should return false for canCalculate when dividing by zero', () => {
    component.operation = 'DIVIDE';
    component.firstNumber = '10';
    component.secondNumber = '0';
    expect(component.canCalculate).toBe(false);
  });

  it('should return true for canCalculate when valid inputs provided', () => {
    component.firstNumber = '10';
    component.secondNumber = '5';
    component.operation = 'ADD';
    expect(component.canCalculate).toBe(true);
  });

  it('should call calculatorService.compute on calculate', () => {
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

    calculatorService.compute.and.returnValue(of(mockResponse));

    component.firstNumber = '10';
    component.secondNumber = '5';
    component.operation = 'ADD';
    component.selectedBase = 10;

    component.calculate();

    expect(calculatorService.compute).toHaveBeenCalledWith('10', 10, '5', 10, 'ADD');
    expect(component.result).toBe('15');
    expect(component.errorMessage).toBe('');
  });

  it('should handle calculation error', fakeAsync(() => {
    // Simulate HTTP error response structure
    const errorResponse = {
      error: {
        message: 'Division by zero'
      }
    };
    calculatorService.compute.and.returnValue(throwError(() => errorResponse));

    component.firstNumber = '10';
    component.secondNumber = '5'; // Valid input to pass canCalculate check
    component.operation = 'DIVIDE';
    component.selectedBase = 10;

    component.calculate();
    
    // Process async operations
    tick();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Division by zero');
    expect(component.result).toBe('');
  }));

  it('should update firstNumber on onFirstNumberChange', () => {
    component.onFirstNumberChange('123');
    expect(component.firstNumber).toBe('123');
  });

  it('should update secondNumber on onSecondNumberChange', () => {
    component.onSecondNumberChange('456');
    expect(component.secondNumber).toBe('456');
  });

  it('should convert result to number correctly', () => {
    component.result = '15';
    component.selectedBase = 10;
    expect(component.getResultAsNumber()).toBe(15);
  });

  it('should return 0 for getResultAsNumber when result is empty', () => {
    component.result = '';
    expect(component.getResultAsNumber()).toBe(0);
  });

  it('should have correct operations array', () => {
    expect(component.operations.length).toBe(4);
    expect(component.operations[0].value).toBe('ADD');
    expect(component.operations[1].value).toBe('SUBTRACT');
    expect(component.operations[2].value).toBe('MULTIPLY');
    expect(component.operations[3].value).toBe('DIVIDE');
  });

  it('should have correct numberBases array', () => {
    expect(component.numberBases.length).toBe(4);
    expect(component.numberBases.find(b => b.value === 2)).toBeTruthy();
    expect(component.numberBases.find(b => b.value === 8)).toBeTruthy();
    expect(component.numberBases.find(b => b.value === 10)).toBeTruthy();
    expect(component.numberBases.find(b => b.value === 16)).toBeTruthy();
  });
});
