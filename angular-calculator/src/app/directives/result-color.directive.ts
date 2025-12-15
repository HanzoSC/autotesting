import { Directive, ElementRef, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appResultColor]',
  standalone: true
})
export class ResultColorDirective implements OnInit, OnChanges {
  @Input() appResultColor: number = 0;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.updateColor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appResultColor']) {
      this.updateColor();
    }
  }

  private updateColor(): void {
    const value = this.appResultColor;

    // Удаляем предыдущие классы
    this.el.nativeElement.style.color = '';

    if (value < 0) {
      // Красный цвет для отрицательных чисел
      this.el.nativeElement.style.color = '#dc3545';
    } else if (value === 0) {
      // Черный цвет для нуля
      this.el.nativeElement.style.color = '#000000';
    } else {
      // Зеленый цвет для положительных чисел
      this.el.nativeElement.style.color = '#28a745';
    }
  }
}
