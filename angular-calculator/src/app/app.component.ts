import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NumberInputComponent } from './components/number-input/number-input.component';
import { CalculatorService } from './services/calculator.service';
import { DecimalPipe } from '@angular/common';
import { DecimalPlacesPipe } from './pipes/decimal-places.pipe';
import { ResultColorDirective } from './directives/result-color.directive';

export type Operation = 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NumberInputComponent,
    DecimalPlacesPipe,
    ResultColorDirective
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  firstNumber: string = '';
  secondNumber: string = '';
  operation: Operation = 'ADD';
  selectedBase: number = 10;
  result: string = '';
  errorMessage: string = '';

  operations = [
    { value: 'ADD', label: 'Сложить' },
    { value: 'SUBTRACT', label: 'Вычесть' },
    { value: 'MULTIPLY', label: 'Умножить' },
    { value: 'DIVIDE', label: 'Разделить' }
  ];

  numberBases = [
    { value: 2, label: 'Двоичная (2)' },
    { value: 8, label: 'Восьмеричная (8)' },
    { value: 10, label: 'Десятичная (10)' },
    { value: 16, label: 'Шестнадцатеричная (16)' }
  ];

  constructor(private calculatorService: CalculatorService) {}

  get isDivision(): boolean {
    return this.operation === 'DIVIDE';
  }

  get canCalculate(): boolean {
    if (!this.firstNumber || !this.secondNumber) {
      return false;
    }
    if (this.isDivision && this.secondNumber === '0') {
      return false;
    }
    return true;
  }

  calculate(): void {
    this.errorMessage = '';
    this.result = '';

    if (!this.canCalculate) {
      return;
    }

    this.calculatorService.compute(
      this.firstNumber,
      this.selectedBase,
      this.secondNumber,
      this.selectedBase,
      this.operation
    ).subscribe({
      next: (response) => {
        this.result = response.resultValue;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Произошла ошибка при вычислении';
        console.error('Calculation error:', error);
      }
    });
  }

  onFirstNumberChange(value: string): void {
    this.firstNumber = value;
  }

  onSecondNumberChange(value: string): void {
    this.secondNumber = value;
  }

  getResultAsNumber(): number {
    if (!this.result) {
      return 0;
    }
    // Конвертируем результат из выбранной системы счисления в число
    try {
      // Если результат содержит точку, это десятичное число
      if (this.result.includes('.')) {
        return parseFloat(this.result);
      }
      return parseInt(this.result, this.selectedBase);
    } catch {
      return 0;
    }
  }
}
