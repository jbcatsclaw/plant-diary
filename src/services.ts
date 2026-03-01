/**
 * Mock data services for Plant Diary
 * All data is stored in memory - suitable for MVP/mock scenarios
 * All dates use ISO 8601 format strings only
 */

import {
  Plant,
  PlantLog,
  ChatMessage,
  PlantFormData,
  DEFAULT_CARE_PLAN,
} from './types';
import {
  generateId,
  getCurrentISO,
  getCurrentISODate,
  normalizePlantInput,
  normalizeCareLogInput,
  validatePlant,
  validateCareLog,
  CreatePlantInput,
  UpdatePlantInput,
  CreateCareLogInput,
  CreateAIMessageInput,
} from './normalize';

// Types alias for internal use
type CareLogType = 'watering' | 'fertilizing' | 'pruning' | 'pest_control' | 'other';

// In-memory storage
let plants: Plant[] = [];
let careLogs: PlantLog[] = [];
let aiMessages: ChatMessage[] = [];

// Initialize with sample data
function initializeMockData() {
  const now = getCurrentISO();
  
  const samplePlants: Plant[] = [
    {
      id: 'plant-1',
      name: '绿萝',
      species: 'Epipremnum aureum',
      photoUrl: 'https://example.com/luolu.jpg',
      dateAcquired: '2025-01-15',
      notes: '放在客厅散射光处',
      carePlan: {
        wateringIntervalDays: 7,
        fertilizingIntervalDays: 30,
        pruningSeason: 'spring',
        notes: '喜阴，避免直射',
      },
      createdAt: '2025-01-15T10:00:00.000Z',
      updatedAt: '2025-01-15T10:00:00.000Z',
    },
    {
      id: 'plant-2',
      name: '多肉植物',
      species: 'Succulent',
      dateAcquired: '2025-02-01',
      carePlan: {
        wateringIntervalDays: 14,
        fertilizingIntervalDays: 60,
        pruningSeason: 'autumn',
        notes: '宁干勿湿',
      },
      createdAt: '2025-02-01T14:30:00.000Z',
      updatedAt: '2025-02-01T14:30:00.000Z',
    },
  ];
  
  const sampleLogs: PlantLog[] = [
    {
      id: 'log-1',
      plantId: 'plant-1',
      type: 'watering',
      notes: '浇透水',
      date: '2025-02-20',
      createdAt: '2025-02-20T09:00:00.000Z',
    },
    {
      id: 'log-2',
      plantId: 'plant-1',
      type: 'fertilizing',
      notes: '稀释液肥',
      date: '2025-02-15',
      createdAt: '2025-02-15T10:00:00.000Z',
    },
    {
      id: 'log-3',
      plantId: 'plant-2',
      type: 'watering',
      notes: '少量浇水',
      date: '2025-02-25',
      createdAt: '2025-02-25T11:00:00.000Z',
    },
  ];
  
  const sampleMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      plantId: 'plant-1',
      role: 'assistant',
      content: '你好！我是你的植物助手。有什么关于绿萝的问题可以问我。',
      timestamp: '2025-02-20T10:00:00.000Z',
    },
  ];
  
  plants = samplePlants;
  careLogs = sampleLogs;
  aiMessages = sampleMessages;
}

// Initialize on module load
initializeMockData();

// ==================== Plant Services ====================

/**
 * List all plants
 */
export function listPlants(): Plant[] {
  return [...plants];
}

/**
 * Get plant by ID
 */
export function getPlant(id: string): Plant | undefined {
  return plants.find(p => p.id === id);
}

/**
 * Create a new plant
 */
export function createPlant(input: CreatePlantInput): { 
  success: boolean; 
  plant?: Plant; 
  errors?: string[];
} {
  const errors = validatePlant(input);
  if (errors.length > 0) {
    return { success: false, errors };
  }
  
  const normalized = normalizePlantInput(input);
  const newPlant: Plant = {
    id: generateId(),
    ...normalized,
  };
  
  plants.push(newPlant);
  return { success: true, plant: newPlant };
}

/**
 * Update an existing plant
 */
export function updatePlant(
  id: string, 
  input: UpdatePlantInput
): { 
  success: boolean; 
  plant?: Plant; 
  errors?: string[];
} {
  const existingIndex = plants.findIndex(p => p.id === id);
  if (existingIndex === -1) {
    return { success: false, errors: ['植物不存在'] };
  }
  
  const existingPlant = plants[existingIndex];
  const errors = validatePlant(input);
  if (errors.length > 0) {
    return { success: false, errors };
  }
  
  const normalized = normalizePlantInput(input, existingPlant);
  const updatedPlant: Plant = {
    ...existingPlant,
    ...normalized,
  };
  
  plants[existingIndex] = updatedPlant;
  return { success: true, plant: updatedPlant };
}

/**
 * Delete a plant
 */
export function deletePlant(id: string): { 
  success: boolean; 
  errors?: string[];
} {
  const existingIndex = plants.findIndex(p => p.id === id);
  if (existingIndex === -1) {
    return { success: false, errors: ['植物不存在'] };
  }
  
  plants.splice(existingIndex, 1);
  
  // Also delete associated care logs and AI messages
  careLogs = careLogs.filter(log => log.plantId !== id);
  aiMessages = aiMessages.filter(msg => msg.plantId !== id);
  
  return { success: true };
}

// ==================== Care Log Services ====================

/**
 * List care logs for a plant (optional filter by type)
 */
export function listLogs(
  plantId: string, 
  filterType?: CareLogType
): PlantLog[] {
  let logs = careLogs.filter(log => log.plantId === plantId);
  
  if (filterType) {
    logs = logs.filter(log => log.type === filterType);
  }
  
  // Sort by date descending (newest first)
  return logs.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Get a single care log by ID
 */
export function getCareLog(id: string): PlantLog | undefined {
  return careLogs.find(log => log.id === id);
}

/**
 * Add a new care log
 */
export function addLog(input: CreateCareLogInput): {
  success: boolean;
  log?: PlantLog;
  errors?: string[];
} {
  const errors = validateCareLog(input);
  if (errors.length > 0) {
    return { success: false, errors };
  }
  
  // Verify plant exists
  const plant = plants.find(p => p.id === input.plantId);
  if (!plant) {
    return { success: false, errors: ['植物不存在'] };
  }
  
  const normalized = normalizeCareLogInput(input);
  const newLog: PlantLog = {
    id: generateId(),
    ...normalized,
  };
  
  careLogs.push(newLog);
  return { success: true, log: newLog };
}

/**
 * Delete a care log
 */
export function deleteCareLog(id: string): {
  success: boolean;
  errors?: string[];
} {
  const existingIndex = careLogs.findIndex(log => log.id === id);
  if (existingIndex === -1) {
    return { success: false, errors: ['记录不存在'] };
  }
  
  careLogs.splice(existingIndex, 1);
  return { success: true };
}

// ==================== AI Message Services ====================

/**
 * List AI messages for a plant
 */
export function listAIMessages(plantId: string): ChatMessage[] {
  return aiMessages
    .filter(msg => msg.plantId === plantId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

/**
 * Add AI message (mock response for MVP)
 */
export function addAIMessage(input: CreateAIMessageInput): ChatMessage {
  const newMessage: ChatMessage = {
    id: generateId(),
    plantId: input.plantId,
    role: input.role,
    content: input.content,
    timestamp: getCurrentISO(),
  };
  
  aiMessages.push(newMessage);
  
  // If user message, generate mock AI response
  if (input.role === 'user') {
    const plant = plants.find(p => p.id === input.plantId);
    const mockResponse: ChatMessage = {
      id: generateId(),
      plantId: input.plantId,
      role: 'assistant',
      content: generateMockAIResponse(plant?.name || '植物'),
      timestamp: getCurrentISO(),
    };
    aiMessages.push(mockResponse);
  }
  
  return newMessage;
}

/**
 * Generate mock AI response
 */
function generateMockAIResponse(plantName: string): string {
  const responses = [
    `好的，我注意到您的${plantName}。建议保持当前的护理频率，注意观察叶片状态。`,
    `感谢您的记录！根据您提供的信息，${plantName}的生长状况看起来不错。记得定期检查土壤湿度。`,
    `收到！如果您发现${plantName}有任何异常变化，比如叶片发黄或卷曲，请及时告诉我。`,
    `记录已保存。根据护理计划，您的${plantName}下次浇水时间大概在3天后。`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// ==================== Utility Services ====================

/**
 * Reset all data (useful for testing)
 */
export function resetMockData() {
  plants = [];
  careLogs = [];
  aiMessages = [];
  initializeMockData();
}

/**
 * Get data statistics
 */
export function getStats() {
  return {
    plantsCount: plants.length,
    careLogsCount: careLogs.length,
    aiMessagesCount: aiMessages.length,
  };
}
