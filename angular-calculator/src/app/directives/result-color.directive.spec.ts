import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ResultColorDirective } from './result-color.directive';

@Component({
  template: '<div [appResultColor]="value">Test</div>'
})
class TestComponent {
  value: number = 0;
}

describe('ResultColorDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultColorDirective],
      declarations: [TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(ResultColorDirective));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(directiveElement).toBeTruthy();
  });

  it('should set color to red for negative values', () => {
    component.value = -5;
    fixture.detectChanges();

    const element = directiveElement.nativeElement;
    expect(element.style.color).toBe('rgb(220, 53, 69)'); // #dc3545
  });

  it('should set color to black for zero', () => {
    component.value = 0;
    fixture.detectChanges();

    const element = directiveElement.nativeElement;
    expect(element.style.color).toBe('rgb(0, 0, 0)'); // #000000
  });

  it('should set color to green for positive values', () => {
    component.value = 10;
    fixture.detectChanges();

    const element = directiveElement.nativeElement;
    expect(element.style.color).toBe('rgb(40, 167, 69)'); // #28a745
  });

  it('should update color when value changes from positive to negative', () => {
    component.value = 5;
    fixture.detectChanges();
    expect(directiveElement.nativeElement.style.color).toBe('rgb(40, 167, 69)');

    component.value = -5;
    fixture.detectChanges();
    expect(directiveElement.nativeElement.style.color).toBe('rgb(220, 53, 69)');
  });

  it('should update color when value changes from negative to zero', () => {
    component.value = -5;
    fixture.detectChanges();
    expect(directiveElement.nativeElement.style.color).toBe('rgb(220, 53, 69)');

    component.value = 0;
    fixture.detectChanges();
    expect(directiveElement.nativeElement.style.color).toBe('rgb(0, 0, 0)');
  });

  it('should handle decimal values correctly', () => {
    component.value = 0.5;
    fixture.detectChanges();
    expect(directiveElement.nativeElement.style.color).toBe('rgb(40, 167, 69)');

    component.value = -0.5;
    fixture.detectChanges();
    expect(directiveElement.nativeElement.style.color).toBe('rgb(220, 53, 69)');
  });
});
