import { DecimalPlacesPipe } from './decimal-places.pipe';

describe('DecimalPlacesPipe', () => {
  let pipe: DecimalPlacesPipe;

  beforeEach(() => {
    pipe = new DecimalPlacesPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format number with default 2 decimal places', () => {
    expect(pipe.transform(123.456)).toBe('123.46');
    expect(pipe.transform(10)).toBe('10.00');
    expect(pipe.transform(0)).toBe('0.00');
  });

  it('should format number with specified decimal places', () => {
    expect(pipe.transform(123.456, 0)).toBe('123');
    expect(pipe.transform(123.456, 1)).toBe('123.5');
    expect(pipe.transform(123.456, 3)).toBe('123.456');
    expect(pipe.transform(123.456, 5)).toBe('123.45600');
  });

  it('should handle string numbers', () => {
    expect(pipe.transform('123.456', 2)).toBe('123.46');
    expect(pipe.transform('10', 2)).toBe('10.00');
  });

  it('should handle negative numbers', () => {
    expect(pipe.transform(-123.456, 2)).toBe('-123.46');
    expect(pipe.transform(-10, 2)).toBe('-10.00');
  });

  it('should handle zero', () => {
    expect(pipe.transform(0, 2)).toBe('0.00');
    expect(pipe.transform(0, 0)).toBe('0');
  });

  it('should handle empty string', () => {
    expect(pipe.transform('', 2)).toBe('');
  });

  it('should handle null', () => {
    expect(pipe.transform(null as any, 2)).toBe('');
  });

  it('should handle undefined', () => {
    expect(pipe.transform(undefined as any, 2)).toBe('');
  });

  it('should return original value for invalid numbers', () => {
    expect(pipe.transform('abc', 2)).toBe('abc');
    expect(pipe.transform('not a number', 2)).toBe('not a number');
  });

  it('should handle very small numbers', () => {
    expect(pipe.transform(0.001, 3)).toBe('0.001');
    expect(pipe.transform(0.0001, 4)).toBe('0.0001');
  });

  it('should handle very large numbers', () => {
    expect(pipe.transform(123456789.123, 2)).toBe('123456789.12');
  });

  it('should round correctly', () => {
    expect(pipe.transform(123.455, 2)).toBe('123.45');
    expect(pipe.transform(123.454, 2)).toBe('123.45');
    expect(pipe.transform(123.456, 2)).toBe('123.46');
    expect(pipe.transform(123.465, 2)).toBe('123.47');
  });
});
