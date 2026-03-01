/**
 * Normalization helpers for ensuring consistent data
 * All date fields use ISO 8601 format strings only
 */

import { 
  Plant, 
  CareLog, 
  CarePlan, 
  DEFAULT_CARE_PLAN,
  PlantFormData,
  PlantLog
} from './types';

export type CreatePlantInput = PlantFormData;
export type UpdatePlantInput = Partial<PlantFormData>;

export type CreateCareLogInput = {
  plantId: string;
  type: string;
  notes?: string;
  customType?: string;
  date: string;
};

export type CreateAIMessageInput = {
  plantId: string;
  role: 'user' | 'assistant';
  content: string;
};

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get current ISO timestamp (full ISO 8601)
 */
export function getCurrentISO(): string {
  return new Date().toISOString();
}

/**
 * Get current ISO date (YYYY-MM-DD only)
 */
export function getCurrentISODate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Validate ISO date string (YYYY-MM-DD or full ISO)
 */
export function isValidISODate(dateStr: string | undefined): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  
  // Check YYYY-MM-DD format
  const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
  // Check full ISO format
  const fullIsoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
  
  return dateOnlyRegex.test(dateStr) || fullIsoRegex.test(dateStr);
}

/**
 * Normalize care plan: merge with defaults
 */
export function normalizeCarePlan(carePlan?: Partial<CarePlan>): CarePlan {
  return {
    ...DEFAULT_CARE_PLAN,
    ...carePlan,
  };
}

/**
 * Normalize plant input: ensure all required fields and defaults
 * Handles both create (required name) and update (optional fields)
 */
export function normalizePlantInput(
  input: CreatePlantInput | UpdatePlantInput,
  existingPlant?: Plant
): Omit<Plant, 'id'> {
  const now = getCurrentISO();
  
  // For updates, name is optional; for create, it's required
  const nameValue = (input as CreatePlantInput).name;
  const name = nameValue?.trim() 
    ? nameValue.trim() 
    : (existingPlant?.name || '未命名植物');
  
  return {
    name,
    species: input.species?.trim() || existingPlant?.species || undefined,
    photoUrl: input.photoUrl || existingPlant?.photoUrl || undefined,
    dateAcquired: input.dateAcquired && isValidISODate(input.dateAcquired) 
      ? input.dateAcquired 
      : (existingPlant?.dateAcquired || undefined),
    notes: input.notes?.trim() || existingPlant?.notes || undefined,
    carePlan: normalizeCarePlan(input.carePlan || existingPlant?.carePlan),
    createdAt: existingPlant?.createdAt || now,
    updatedAt: now,
  };
}

/**
 * Normalize care log input: validate and set defaults
 */
export function normalizeCareLogInput(
  input: CreateCareLogInput,
  existingLog?: CareLog
): Omit<CareLog, 'id'> {
  const now = getCurrentISO();
  
  return {
    plantId: input.plantId,
    type: input.type as any,
    notes: input.notes?.trim() || existingLog?.notes || undefined,
    customType: input.type === 'other' 
      ? (input.customType?.trim() || existingLog?.customType || '其他')
      : undefined,
    date: isValidISODate(input.date) ? input.date.split('T')[0] : getCurrentISODate(),
    createdAt: existingLog?.createdAt || now,
  };
}

/**
 * Validate plant required fields
 */
export function validatePlant(input: CreatePlantInput | UpdatePlantInput): string[] {
  const errors: string[] = [];
  
  // For create, name is required; for update, it's optional
  if (input.name !== undefined && input.name.trim().length === 0) {
    errors.push('植物名称不能为空');
  }
  
  if (input.dateAcquired && !isValidISODate(input.dateAcquired)) {
    errors.push('到家日期必须是有效的 ISO 日期格式 (YYYY-MM-DD)');
  }
  
  return errors;
}

/**
 * Validate care log required fields
 */
export function validateCareLog(input: CreateCareLogInput): string[] {
  const errors: string[] = [];
  
  if (!input.plantId) {
    errors.push('植物 ID 不能为空');
  }
  
  if (!input.type) {
    errors.push('护理类型不能为空');
  }
  
  if (!input.date || !isValidISODate(input.date)) {
    errors.push('日期必须是有效的 ISO 日期格式 (YYYY-MM-DD)');
  }
  
  return errors;
}
