/**
 * Mock Store - In-memory data store for Plant Diary
 * All dates use ISO 8601 format strings only
 */

import { Plant, PlantLog, ChatMessage, PlantWithLogs, DEFAULT_CARE_PLAN } from '../types';

// Generate UUID
const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Get current ISO timestamp
const getCurrentISO = (): string => new Date().toISOString();

// Get current ISO date (YYYY-MM-DD)
const getCurrentISODate = (): string => new Date().toISOString().split('T')[0];

// Mock 植物数据 (using ISO strings)
const initialPlants: Plant[] = [
  {
    id: '1',
    name: '绿萝',
    species: 'Epipremnum aureum',
    photoUrl: 'https://images.unsplash.com/photo-1598880940080-ff9a29891b85?w=400',
    dateAcquired: '2024-03-15',
    notes: '放在客厅电视柜上，长得很好',
    carePlan: DEFAULT_CARE_PLAN,
    createdAt: '2024-03-15T00:00:00.000Z',
    updatedAt: '2024-03-15T00:00:00.000Z',
  },
  {
    id: '2',
    name: '多肉植物',
    species: 'Echeveria',
    photoUrl: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400',
    dateAcquired: '2024-05-20',
    notes: '阳台种植，需控水',
    carePlan: { ...DEFAULT_CARE_PLAN, wateringIntervalDays: 14 },
    createdAt: '2024-05-20T00:00:00.000Z',
    updatedAt: '2024-05-20T00:00:00.000Z',
  },
  {
    id: '3',
    name: '吊兰',
    species: 'Chlorophytum comosum',
    photoUrl: 'https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=400',
    dateAcquired: '2024-01-10',
    notes: '卧室窗台，空气净化',
    carePlan: DEFAULT_CARE_PLAN,
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
  },
];

// Mock 记录数据 (using ISO strings)
const initialLogs: PlantLog[] = [
  {
    id: 'l1',
    plantId: '1',
    type: 'watering',
    notes: '浇透水，叶子擦拭',
    date: '2024-12-01',
    createdAt: '2024-12-01T00:00:00.000Z',
  },
  {
    id: 'l2',
    plantId: '1',
    type: 'fertilizing',
    notes: '施加液态肥',
    date: '2024-11-15',
    createdAt: '2024-11-15T00:00:00.000Z',
  },
  {
    id: 'l3',
    plantId: '2',
    type: 'watering',
    notes: '少量浇水',
    date: '2024-12-02',
    createdAt: '2024-12-02T00:00:00.000Z',
  },
  {
    id: 'l4',
    plantId: '3',
    type: 'pruning',
    notes: '剪除黄叶',
    date: '2024-11-28',
    createdAt: '2024-11-28T00:00:00.000Z',
  },
];

// 内存存储
let plants: Plant[] = [...initialPlants];
let logs: PlantLog[] = [...initialLogs];
let chats: Map<string, ChatMessage[]> = new Map();

// 获取所有植物
export const getPlants = (): Plant[] => {
  return [...plants];
};

// 获取植物详情（含记录）
export const getPlantWithLogs = (plantId: string): PlantWithLogs | null => {
  const plant = plants.find(p => p.id === plantId);
  if (!plant) return null;
  
  const plantLogs = logs
    .filter(l => l.plantId === plantId)
    .sort((a, b) => b.date.localeCompare(a.date));
  
  return { ...plant, logs: plantLogs };
};

// 添加植物
export const addPlant = (plantData: Omit<Plant, 'id' | 'createdAt' | 'updatedAt'>): Plant => {
  const now = getCurrentISO();
  const newPlant: Plant = {
    ...plantData,
    id: generateId(),
    carePlan: plantData.carePlan || DEFAULT_CARE_PLAN,
    createdAt: now,
    updatedAt: now,
  };
  plants = [newPlant, ...plants];
  return newPlant;
};

// 更新植物
export const updatePlant = (plantId: string, updates: Partial<Plant>): Plant | null => {
  const index = plants.findIndex(p => p.id === plantId);
  if (index === -1) return null;
  
  plants[index] = {
    ...plants[index],
    ...updates,
    updatedAt: getCurrentISO(),
  };
  return plants[index];
};

// 删除植物
export const deletePlant = (plantId: string): boolean => {
  const index = plants.findIndex(p => p.id === plantId);
  if (index === -1) return false;
  
  plants = plants.filter(p => p.id !== plantId);
  logs = logs.filter(l => l.plantId !== plantId);
  chats.delete(plantId);
  return true;
};

// 添加记录
export const addLog = (plantId: string, logData: Omit<PlantLog, 'id' | 'plantId' | 'createdAt'>): PlantLog | null => {
  const plant = plants.find(p => p.id === plantId);
  if (!plant) return null;
  
  const now = getCurrentISO();
  const newLog: PlantLog = {
    ...logData,
    id: generateId(),
    plantId,
    date: logData.date || getCurrentISODate(),
    createdAt: now,
  };
  logs = [newLog, ...logs];
  return newLog;
};

// 获取植物的 AI 对话历史
export const getChatHistory = (plantId: string): ChatMessage[] => {
  return chats.get(plantId) || [];
};

// 发送 AI 消息（mock）
export const sendChatMessage = (plantId: string, userMessage: string): ChatMessage => {
  const now = getCurrentISO();
  
  // 用户消息
  const userMsg: ChatMessage = {
    id: generateId(),
    plantId,
    role: 'user',
    content: userMessage,
    timestamp: now,
  };
  
  // Mock AI 响应
  const plant = plants.find(p => p.id === plantId);
  const plantLogs = logs.filter(l => l.plantId === plantId).slice(0, 3);
  
  let aiResponse = '好的，我会帮你记录这个问题。';
  
  if (userMessage.includes('浇水') || userMessage.includes('浇水')) {
    aiResponse = '根据植物生长情况，建议每7-10天浇水一次。冬季可以适当减少浇水频率。';
  } else if (userMessage.includes('施肥') || userMessage.includes('肥')) {
    aiResponse = '生长季节（春夏季）每月施肥1-2次，秋冬季节可以停止施肥。';
  } else if (userMessage.includes('叶子') || userMessage.includes('黄')) {
    aiResponse = '叶子发黄可能有以下原因：1. 浇水过多或过少；2. 光照不足；3. 营养缺乏。建议检查土壤湿度和光照条件。';
  } else if (plant) {
    aiResponse = `这是您的${plant.name}，它现在状态良好。有什么我可以帮助您的吗？`;
  }
  
  const aiMsg: ChatMessage = {
    id: generateId(),
    plantId,
    role: 'assistant',
    content: aiResponse,
    timestamp: getCurrentISO(),
  };
  
  const history = chats.get(plantId) || [];
  chats.set(plantId, [...history, userMsg, aiMsg]);
  
  return aiMsg;
};

// 搜索植物
export const searchPlants = (query: string): Plant[] => {
  const lowerQuery = query.toLowerCase();
  return plants.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    (p.species?.toLowerCase().includes(lowerQuery) ?? false)
  );
};

// Re-export from services for convenience
export { listPlants, listLogs } from '../services';
