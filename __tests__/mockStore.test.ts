/**
 * Mock Store Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getPlants, 
  getPlantWithLogs, 
  addPlant, 
  updatePlant, 
  deletePlant,
  searchPlants,
  addLog,
  getChatHistory,
  sendChatMessage
} from '../src/data/mockStore';
import { DEFAULT_CARE_PLAN } from '../src/types';

describe('Mock Data Store', () => {
  describe('getPlants', () => {
    it('should return an array of plants', () => {
      const plants = getPlants();
      expect(Array.isArray(plants)).toBe(true);
      expect(plants.length).toBeGreaterThan(0);
    });

    it('should have correct plant structure', () => {
      const plants = getPlants();
      const plant = plants[0];
      expect(plant).toHaveProperty('id');
      expect(plant).toHaveProperty('name');
      expect(plant).toHaveProperty('species');
      expect(plant).toHaveProperty('photoUrl');
      expect(plant).toHaveProperty('dateAcquired');
      expect(plant).toHaveProperty('notes');
      expect(plant).toHaveProperty('carePlan');
      // Verify dates are ISO strings
      expect(plant.dateAcquired).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(plant.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('getPlantWithLogs', () => {
    it('should return plant with logs', () => {
      const plants = getPlants();
      if (plants.length > 0) {
        const plantWithLogs = getPlantWithLogs(plants[0].id);
        expect(plantWithLogs).not.toBeNull();
        expect(plantWithLogs).toHaveProperty('logs');
        expect(Array.isArray(plantWithLogs!.logs)).toBe(true);
      }
    });

    it('should return null for non-existent plant', () => {
      const plant = getPlantWithLogs('non-existent-id');
      expect(plant).toBeNull();
    });
  });

  describe('searchPlants', () => {
    it('should find plants by name', () => {
      const results = searchPlants('绿萝');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toBe('绿萝');
    });

    it('should find plants by species', () => {
      const results = searchPlants('Echeveria');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', () => {
      const results = searchPlants('不存在的植物');
      expect(results).toEqual([]);
    });
  });

  describe('addPlant', () => {
    it('should add a new plant', () => {
      const initialCount = getPlants().length;
      const newPlant = addPlant({
        name: '测试植物',
        species: 'Test species',
        photoUrl: 'https://example.com/photo.jpg',
        dateAcquired: '2025-01-01',
        notes: '测试备注',
        carePlan: DEFAULT_CARE_PLAN,
      });
      
      expect(newPlant).toHaveProperty('id');
      expect(newPlant.name).toBe('测试植物');
      expect(getPlants().length).toBe(initialCount + 1);
      // Verify dates are ISO strings
      expect(newPlant.dateAcquired).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(newPlant.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('updatePlant', () => {
    it('should update an existing plant', () => {
      const plants = getPlants();
      const plantToUpdate = plants[0];
      
      const updated = updatePlant(plantToUpdate.id, { name: '更新后的名称' });
      
      expect(updated).not.toBeNull();
      expect(updated!.name).toBe('更新后的名称');
    });
  });

  describe('deletePlant', () => {
    it('should delete a plant', () => {
      const newPlant = addPlant({
        name: '待删除植物',
        species: 'To delete',
        photoUrl: 'https://example.com/photo.jpg',
        dateAcquired: '2025-01-01',
        notes: '',
        carePlan: DEFAULT_CARE_PLAN,
      });
      
      const initialCount = getPlants().length;
      const result = deletePlant(newPlant.id);
      
      expect(result).toBe(true);
      expect(getPlants().length).toBe(initialCount - 1);
    });
  });

  describe('addLog', () => {
    it('should add a log to a plant', () => {
      const plants = getPlants();
      const plant = plants[0];
      
      const newLog = addLog(plant.id, {
        type: 'watering',
        notes: '测试浇水',
        date: '2025-03-01',
      });
      
      expect(newLog).not.toBeNull();
      expect(newLog!.type).toBe('watering');
      // Verify dates are ISO strings
      expect(newLog!.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(newLog!.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('Chat', () => {
    it('should get chat history', () => {
      const plants = getPlants();
      const history = getChatHistory(plants[0].id);
      expect(Array.isArray(history)).toBe(true);
    });

    it('should send and receive chat messages', () => {
      const plants = getPlants();
      const plantId = plants[0].id;
      
      const response = sendChatMessage(plantId, '测试消息');
      
      expect(response).toHaveProperty('id');
      expect(response.role).toBe('assistant');
      expect(response.content).toBeTruthy();
    });
  });
});
