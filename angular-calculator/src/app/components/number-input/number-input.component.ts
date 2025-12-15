import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true
    }
  ],
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css']
})
export class NumberInputComponent implements ControlValueAccessor {
  @Input() value: string = '';
  @Input() base: number = 10;
  @Input() disabled: boolean = false;
  @Input() preventZero: boolean = false; // Для блокировки ввода 0 при делении
  @Output() valueChange = new EventEmitter<string>();

  private onChange = (value: string) => {};
  private onTouched = () => {};

  get allowedChars(): string {
    if (this.base <= 10) {
      return `0-${this.base - 1}`;
    } else {
      return '0-9, A-F';
    }
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let newValue = input.value;

    // Проверка на блокировку ввода 0
    if (this.preventZero && newValue === '0') {
      input.value = this.value;
      return;
    }

    // Валидация ввода в зависимости от системы счисления
    if (this.isValidForBase(newValue)) {
      this.value = newValue;
      this.onChange(newValue);
      this.valueChange.emit(newValue);
    } else {
      // Восстанавливаем предыдущее значение
      input.value = this.value;
    }
  }

  onBlur(): void {
    this.onTouched();
  }

  isValidForBase(value: string): boolean {
    if (!value) {
      return true; // Пустое значение допустимо
    }

    // Для отрицательных чисел
    const isNegative = value.startsWith('-');
    const numericPart = isNegative ? value.substring(1) : value;

    if (!numericPart) {
      return false;
    }

    // Проверка каждого символа
    for (let i = 0; i < numericPart.length; i++) {
      const char = numericPart[i].toUpperCase();
      let charValue: number;

      if (char >= '0' && char <= '9') {
        charValue = parseInt(char, 10);
      } else if (char >= 'A' && char <= 'F') {
        charValue = char.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
      } else {
        return false; // Недопустимый символ
      }

      if (charValue >= this.base) {
        return false; // Символ недопустим для данной системы счисления
      }
    }

    return true;
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
