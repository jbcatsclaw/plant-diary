// Plant Diary Types
// All date/time fields MUST be ISO 8601 strings.

export type ISODate = string; // YYYY-MM-DD
export type ISOTimestamp = string; // full ISO

export type CareLogType = 'water' | 'fertilize' | 'prune' | 'pest' | 'other';

export type CarePlanItem = {
  enabled: boolean;
  intervalDays: number;
};

export type CarePlan = {
  water: CarePlanItem;
  fertilize: CarePlanItem;
  prune: CarePlanItem;
  pest: CarePlanItem;
};

export const DEFAULT_CARE_PLAN: CarePlan = {
  water: { enabled: true, intervalDays: 7 },
  fertilize: { enabled: false, intervalDays: 30 },
  prune: { enabled: false, intervalDays: 90 },
  pest: { enabled: false, intervalDays: 30 },
};

export type Plant = {
  id: string;
  name: string;
  species?: string;
  photoUrl?: string;
  dateAcquired?: ISODate;
  notes?: string;
  carePlan: CarePlan;
  createdAt: ISOTimestamp;
  updatedAt: ISOTimestamp;
};

export type CareLog = {
  id: string;
  plantId: string;
  type: CareLogType;
  notes?: string;
  customType?: string; // when type === 'other'
  date: ISODate;
  createdAt: ISOTimestamp;
};

export type ChatMessage = {
  id: string;
  plantId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: ISOTimestamp;
};

export type PlantWithLogs = Plant & { logs: CareLog[] };

export type PlantFormData = {
  name: string;
  species?: string;
  photoUrl?: string;
  dateAcquired?: ISODate;
  notes?: string;
  carePlan?: Partial<CarePlan>;
};

export type LogFormData = {
  type: CareLogType;
  notes?: string;
  customType?: string;
  date: ISODate;
};

export const CARE_LOG_TYPE_LABELS: Record<CareLogType, string> = {
  water: '浇水',
  fertilize: '施肥',
  prune: '修剪',
  pest: '除虫',
  other: '其他',
};

export function getCareLogTypeLabel(type: CareLogType): string {
  return CARE_LOG_TYPE_LABELS[type] ?? '其他';
}
