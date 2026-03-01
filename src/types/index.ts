import { type } from "react-native";

// 植物类型
export interface Plant {
  id: string;
  name: string;
  species: string;
  photoUrl: string;
  arrivalDate: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

// 记录类型
export type LogType = 'watering' | 'fertilizing' | 'pruning' | 'pest_control' | 'other';

export interface PlantLog {
  id: string;
  plantId: string;
  type: LogType;
  notes: string;
  date: Date;
  createdAt: Date;
}

// AI 对话消息
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// 植物详情（含记录）
export interface PlantWithLogs extends Plant {
  logs: PlantLog[];
}

// 表单数据
export interface PlantFormData {
  name: string;
  species: string;
  photoUrl: string;
  arrivalDate: Date;
  notes: string;
}

export interface LogFormData {
  type: LogType;
  notes: string;
  date: Date;
}

// 记录类型选项
export const LOG_TYPE_OPTIONS: { value: LogType; label: string }[] = [
  { value: 'watering', label: '浇水' },
  { value: 'fertilizing', label: '施肥' },
  { value: 'pruning', label: '修剪' },
  { value: 'pest_control', label: '除虫' },
  { value: 'other', label: '其他' },
];

export const getLogTypeLabel = (type: LogType): string => {
  const option = LOG_TYPE_OPTIONS.find(o => o.value === type);
  return option?.label ?? '其他';
};
