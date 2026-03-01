import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlantCard } from '../src/components/PlantCard';
import { PlantFormModal } from '../src/components/PlantFormModal';
import { getPlants, searchPlants, addPlant, updatePlant, deletePlant } from '../src/data/mockStore';
import { Plant, PlantFormData } from '../src/types';
import { colors, spacing, borderRadius, fontSize } from '../src/constants/theme';

export default function GardenScreen() {
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>(getPlants());
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filteredPlants = searchQuery ? searchPlants(searchQuery) : plants;

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPlants(getPlants());
    setRefreshing(false);
  }, []);

  const handlePlantPress = (plant: Plant) => {
    router.push(`/plant/${plant.id}`);
  };

  const handleAddPlant = () => {
    setEditingPlant(null);
    setShowModal(true);
  };

  const handleEditPlant = (plant: Plant) => {
    setEditingPlant(plant);
    setShowModal(true);
  };

  const handleSubmit = (data: PlantFormData) => {
    if (editingPlant) {
      updatePlant(editingPlant.id, data);
    } else {
      addPlant(data);
    }
    setPlants(getPlants());
  };

  const handleDelete = (plantId: string) => {
    deletePlant(plantId);
    setPlants(getPlants());
  };

  const renderPlant = ({ item }: { item: Plant }) => (
    <PlantCard 
      plant={item} 
      onPress={() => handlePlantPress(item)} 
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>还没有植物</Text>
      <Text style={styles.emptySubtext}>点击下方按钮添加您的第一株植物</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>我的花园</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddPlant}>
          <Text style={styles.addButtonText}>+ 添加</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索植物名称或品种..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredPlants}
        renderItem={renderPlant}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      />

      <PlantFormModal
        visible={showModal}
        plant={editingPlant}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    color: colors.textWhite,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  searchContainer: {
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  searchInput: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    fontSize: fontSize.md,
    color: colors.text,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
});
