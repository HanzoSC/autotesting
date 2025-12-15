import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberInputComponent } from './number-input.component';
import { FormsModule } from '@angular/forms';

describe('NumberInputComponent', () => {
  let component: NumberInputComponent;
  let fixture: ComponentFixture<NumberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit valueChange when valid input is entered', () => {
    spyOn(component.valueChange, 'emit');
    component.base = 10;
    component.value = '5';

    const input = fixture.nativeElement.querySelector('input');
    input.value = '10';
    input.dispatchEvent(new Event('input'));

    expect(component.valueChange.emit).toHaveBeenCalledWith('10');
  });

  it('should reject invalid characters for base 2', () => {
    component.base = 2;
    component.value = '1';

    const input = fixture.nativeElement.querySelector('input');
    input.value = '2'; // Invalid for base 2
    input.dispatchEvent(new Event('input'));

    expect(component.value).toBe('1'); // Should remain unchanged
  });

  it('should accept valid characters for base 2', () => {
    component.base = 2;
    component.value = '';

    const input = fixture.nativeElement.querySelector('input');
    input.value = '101';
    input.dispatchEvent(new Event('input'));

    expect(component.value).toBe('101');
  });

  it('should accept valid characters for base 16', () => {
    component.base = 16;
    component.value = '';

    const input = fixture.nativeElement.querySelector('input');
    input.value = 'A1F';
    input.dispatchEvent(new Event('input'));

    expect(component.value).toBe('A1F');
  });

  it('should reject invalid characters for base 16', () => {
    component.base = 16;
    component.value = 'A';

    const input = fixture.nativeElement.querySelector('input');
    input.value = 'G'; // Invalid for base 16
    input.dispatchEvent(new Event('input'));

    expect(component.value).toBe('A'); // Should remain unchanged
  });

  it('should implement ControlValueAccessor correctly', () => {
    const testValue = '123';
    component.writeValue(testValue);
    expect(component.value).toBe(testValue);

    let onChangeValue = '';
    component.registerOnChange((value: string) => {
      onChangeValue = value;
    });

    // Test onChange through onInput method
    component.base = 10;
    const input = fixture.nativeElement.querySelector('input');
    input.value = '456';
    input.dispatchEvent(new Event('input'));
    expect(onChangeValue).toBe('456');

    let touched = false;
    component.registerOnTouched(() => {
      touched = true;
    });

    // Test onTouched through onBlur method
    input.dispatchEvent(new Event('blur'));
    expect(touched).toBe(true);
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toBe(true);

    component.setDisabledState(false);
    expect(component.disabled).toBe(false);
  });

  it('should return correct allowedChars for base 10', () => {
    component.base = 10;
    expect(component.allowedChars).toBe('0-9');
  });

  it('should return correct allowedChars for base 16', () => {
    component.base = 16;
    expect(component.allowedChars).toBe('0-9, A-F');
  });

  it('should prevent input of zero when preventZero is true', () => {
    component.preventZero = true;
    component.value = '';

    const input = fixture.nativeElement.querySelector('input');
    input.value = '0';
    input.dispatchEvent(new Event('input'));

    expect(component.value).toBe(''); // Should remain empty
  });

  it('should allow input of zero when preventZero is false', () => {
    component.preventZero = false;
    component.base = 10;
    component.value = '';

    const input = fixture.nativeElement.querySelector('input');
    input.value = '0';
    input.dispatchEvent(new Event('input'));

    expect(component.value).toBe('0');
  });
});
