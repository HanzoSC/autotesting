import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalPlaces',
  standalone: true
})
export class DecimalPlacesPipe implements PipeTransform {
  transform(value: string | number, decimalPlaces: number = 2): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    // Преобразуем строку в число
    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    // Проверяем, является ли значение числом
    if (isNaN(numValue)) {
      return value.toString();
    }

    // Форматируем число с заданным количеством знаков после запятой
    return numValue.toFixed(decimalPlaces);
  }
}
