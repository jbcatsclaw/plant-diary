/**
 * Normalization helpers for consistent mock data.
 * All date fields use ISO 8601 strings only.
 */

import {
  Plant,
  CareLog,
  CarePlan,
  DEFAULT_CARE_PLAN,
  PlantFormData,
  LogFormData,
} from './types';

export type CreatePlantInput = PlantFormData;
export type UpdatePlantInput = Partial<PlantFormData>;

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getCurrentISO(): string {
  return new Date().toISOString();
}

export function getCurrentISODate(): string {
  return new Date().toISOString().split('T')[0];
}

export function isValidISODate(dateStr: string | undefined): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  // Accept date-only (YYYY-MM-DD) or full ISO timestamp.
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return true;
  // Basic ISO timestamp check (e.g. 2025-01-15T10:00:00.000Z or with offset)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.test(dateStr)) return true;
  return false;
}

export function normalizeCarePlan(input?: Partial<CarePlan> | null): CarePlan {
  const cp: any = input ?? {};
  return {
    ...DEFAULT_CARE_PLAN,
    ...cp,
    water: { ...DEFAULT_CARE_PLAN.water, ...(cp.water ?? {}) },
    fertilize: { ...DEFAULT_CARE_PLAN.fertilize, ...(cp.fertilize ?? {}) },
    prune: { ...DEFAULT_CARE_PLAN.prune, ...(cp.prune ?? {}) },
    pest: { ...DEFAULT_CARE_PLAN.pest, ...(cp.pest ?? {}) },
  };
}

export function normalizePlantInput(input: CreatePlantInput, existing?: Plant): Omit<Plant, 'id'> {
  const now = getCurrentISO();
  const name = input.name?.trim() || existing?.name || '未命名植物';

  const dateAcquired =
    input.dateAcquired && isValidISODate(input.dateAcquired)
      ? input.dateAcquired
      : existing?.dateAcquired;

  return {
    name,
    species: input.species?.trim() || existing?.species,
    photoUrl: input.photoUrl || existing?.photoUrl,
    dateAcquired,
    notes: input.notes?.trim() || existing?.notes,
    carePlan: normalizeCarePlan(input.carePlan ?? existing?.carePlan),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
}

export function validatePlant(input: Partial<CreatePlantInput>): string[] {
  const errors: string[] = [];

  if (typeof input.name === 'string' && !input.name.trim()) {
    errors.push('植物名称不能为空');
  }

  if (input.dateAcquired && !isValidISODate(input.dateAcquired)) {
    errors.push('到家日期必须是有效的 ISO 日期格式 (YYYY-MM-DD)');
  }

  return errors;
}

export function validateCareLog(input: Partial<LogFormData>): string[] {
  const errors: string[] = [];

  if (!input.date || !isValidISODate(input.date)) {
    errors.push('日期必须是有效的 ISO 日期格式 (YYYY-MM-DD)');
  }

  if (input.type === 'other' && !input.customType?.trim()) {
    errors.push('请选择“其他”时需要填写自定义类型');
  }

  return errors;
}

export function normalizeCareLog(plantId: string, input: LogFormData): Omit<CareLog, 'id'> {
  const now = getCurrentISO();
  return {
    plantId,
    type: input.type,
    notes: input.notes?.trim() || undefined,
    customType: input.type === 'other' ? input.customType?.trim() || undefined : undefined,
    date: input.date,
    createdAt: now,
  };
}
