/**
 * Unit tests for normalization functions
 */

import { describe, it, expect } from 'vitest';
import {
  generateId,
  getCurrentISO,
  getCurrentISODate,
  isValidISODate,
  normalizeCarePlan,
  normalizePlantInput,
  validatePlant,
} from './normalize';
import { DEFAULT_CARE_PLAN, Plant } from './types';

describe('ID Generation', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });
});

describe('ISO Date Helpers', () => {
  it('should return valid full ISO timestamp', () => {
    const iso = getCurrentISO();
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('should return valid date-only ISO string', () => {
    const date = getCurrentISODate();
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  describe('isValidISODate', () => {
    it('should validate YYYY-MM-DD format', () => {
      expect(isValidISODate('2025-01-15')).toBe(true);
      expect(isValidISODate('2025-12-31')).toBe(true);
    });

    it('should validate full ISO format', () => {
      expect(isValidISODate('2025-01-15T10:00:00.000Z')).toBe(true);
      expect(isValidISODate('2025-06-20T14:30:00.000+08:00')).toBe(true);
    });

    it('should reject invalid dates', () => {
      expect(isValidISODate('2025/01/15')).toBe(false);
      expect(isValidISODate('01-15-2025')).toBe(false);
      expect(isValidISODate('')).toBe(false);
      expect(isValidISODate('invalid')).toBe(false);
    });

    it('should handle undefined', () => {
      expect(isValidISODate(undefined)).toBe(false);
    });
  });
});

describe('normalizeCarePlan', () => {
  it('should return default care plan when input is undefined', () => {
    const result = normalizeCarePlan();
    expect(result).toEqual(DEFAULT_CARE_PLAN);
  });

  it('should merge partial input with defaults', () => {
    const result = normalizeCarePlan({ wateringIntervalDays: 3 });
    expect(result.wateringIntervalDays).toBe(3);
    expect(result.fertilizingIntervalDays).toBe(DEFAULT_CARE_PLAN.fertilizingIntervalDays);
    expect(result.pruningSeason).toBe(DEFAULT_CARE_PLAN.pruningSeason);
  });

  it('should override defaults with provided values', () => {
    const custom = {
      wateringIntervalDays: 5,
      fertilizingIntervalDays: 15,
      notes: 'Custom notes',
    };
    const result = normalizeCarePlan(custom);
    expect(result.wateringIntervalDays).toBe(5);
    expect(result.fertilizingIntervalDays).toBe(15);
    expect(result.notes).toBe('Custom notes');
  });
});

describe('normalizePlantInput', () => {
  const existingPlant: Plant = {
    id: 'plant-1',
    name: '绿萝',
    species: 'Epipremnum aureum',
    carePlan: DEFAULT_CARE_PLAN,
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-15T10:00:00.000Z',
  };

  it('should create new plant with normalized data', () => {
    const input = {
      name: '多肉植物',
      species: 'Succulent',
    };
    const result = normalizePlantInput(input);
    
    expect(result.name).toBe('多肉植物');
    expect(result.species).toBe('Succulent');
    expect(result.carePlan).toEqual(DEFAULT_CARE_PLAN);
    expect(result.createdAt).toBeTruthy();
    expect(result.updatedAt).toBeTruthy();
  });

  it('should use default name when input name is empty', () => {
    const input = { name: '' };
    const result = normalizePlantInput(input);
    expect(result.name).toBe('未命名植物');
  });

  it('should trim whitespace from inputs', () => {
    const input = {
      name: '  绿萝  ',
      species: '  Epipremnum  ',
    };
    const result = normalizePlantInput(input);
    expect(result.name).toBe('绿萝');
    expect(result.species).toBe('Epipremnum');
  });

  it('should validate ISO date format for dateAcquired', () => {
    const input = {
      name: 'Test',
      dateAcquired: '2025-01-15',
    };
    const result = normalizePlantInput(input);
    expect(result.dateAcquired).toBe('2025-01-15');
  });

  it('should use existing plant data when updating', () => {
    const input = { name: 'New Name' };
    const result = normalizePlantInput(input, existingPlant);
    expect(result.name).toBe('New Name');
    expect(result.species).toBe(existingPlant.species);
    expect(result.createdAt).toBe(existingPlant.createdAt);
  });

  it('should set updatedAt to current time', () => {
    const result = normalizePlantInput({ name: 'Test' });
    expect(result.updatedAt).toBeTruthy();
  });
});

describe('validatePlant', () => {
  it('should return error for empty name', () => {
    const errors = validatePlant({ name: '' });
    expect(errors).toContain('植物名称不能为空');
  });

  it('should return error for whitespace-only name', () => {
    const errors = validatePlant({ name: '   ' });
    expect(errors).toContain('植物名称不能为空');
  });

  it('should return error for invalid date format', () => {
    const errors = validatePlant({ name: '绿萝', dateAcquired: '2025/01/15' });
    expect(errors).toContain('到家日期必须是有效的 ISO 日期格式 (YYYY-MM-DD)');
  });

  it('should return empty array for valid input', () => {
    const errors = validatePlant({ name: '绿萝', dateAcquired: '2025-01-15' });
    expect(errors).toHaveLength(0);
  });

  it('should allow optional fields to be undefined', () => {
    const errors = validatePlant({ name: '绿萝' });
    expect(errors).toHaveLength(0);
  });

  it('should allow update without name', () => {
    const errors = validatePlant({ notes: 'New notes' });
    expect(errors).toHaveLength(0);
  });
});
