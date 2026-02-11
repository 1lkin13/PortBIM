import { describe, it, expect } from 'vitest';
import { Designer } from '../models/Designer';

describe('Designer Domain Model', () => {
  it('should create a designer with 0 objects by default', () => {
    const designer = Designer.create('1', 'Test Designer', 8);
    expect(designer.attachedObjectsCount).toBe(0);
  });

  it('should throw error for invalid working hours', () => {
    expect(() => Designer.create('1', 'Test Designer', 25)).toThrow();
    expect(() => Designer.create('1', 'Test Designer', -1)).toThrow();
  });
});
