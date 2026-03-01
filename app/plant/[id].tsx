import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogItem } from '../../src/components/LogItem';
import { LogFormModal } from '../../src/components/LogFormModal';
import { PlantFormModal } from '../../src/components/PlantFormModal';
import { getPlantWithLogs, addLog, deletePlant } from '../../src/data/mockStore';
import { PlantWithLogs, LogFormData, PlantFormData } from '../../src/types';
import { colors, spacing, borderRadius, fontSize } from '../../src/constants/theme';

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [plant, setPlant] = useState<PlantWithLogs | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const data = getPlantWithLogs(id);
      setPlant(data);
    }
  }, [id, showLogModal, showEditModal]);

  if (!plant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>植物不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredLogs = filterType ? plant.logs.filter(log => log.type === filterType) : plant.logs;

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleAddLog = (data: LogFormData) => {
    if (plant) { addLog(plant.id, data); }
  };

  const handleChatPress = () => {
    router.push('/chat/' + plant.id);
  };

  const handleEdit = (data: PlantFormData) => {};

  const handleDelete = () => {
    Alert.alert('确认删除', '确定要删除"' + plant.name + '"吗？此操作不可恢复。', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: () => { deletePlant(plant.id); router.back(); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: plant.photoUrl }} style={styles.image} resizeMode="cover" />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.name}>{plant.name}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => setShowEditModal(true)}>
                  <Text style={styles.actionText}>编辑</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                  <Text style={[styles.actionText, styles.deleteText]}>删除</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.species}>{plant.species}</Text>
            {plant.arrivalDate && <Text style={styles.date}>到家日期: {formatDate(plant.arrivalDate)}</Text>}
          </View>
          {plant.notes ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>备注</Text>
              <Text style={styles.notes}>{plant.notes}</Text>
            </View>
          ) : null}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>生长记录</Text>
              <TouchableOpacity onPress={handleChatPress}>
                <Text style={styles.chatLink}>咨询助手</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity style={[styles.filterChip, !filterType && styles.filterChipActive]} onPress={() => setFilterType(null)}>
                <Text style={[styles.filterText, !filterType && styles.filterTextActive]}>全部</Text>
              </TouchableOpacity>
              {['watering', 'fertilizing', 'pruning', 'pest_control', 'other'].map(type => (
                <TouchableOpacity key={type} style={[styles.filterChip, filterType === type && styles.filterChipActive]} onPress={() => setFilterType(type)}>
                  <Text style={[styles.filterText, filterType === type && styles.filterTextActive]}>
                    {type === 'watering' ? '浇水' : type === 'fertilizing' ? '施肥' : type === 'pruning' ? '修剪' : type === 'pest_control' ? '除虫' : '其他'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {filteredLogs.length > 0 ? (
              <View style={styles.timeline}>{filteredLogs.map(log => (<LogItem key={log.id} log={log} />))}</View>
            ) : (<Text style={styles.emptyLogs}>暂无记录</Text>)}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.addLogButton} onPress={() => setShowLogModal(true)}>
        <Text style={styles.addLogText}>+ 添加记录</Text>
      </TouchableOpacity>
      <LogFormModal visible={showLogModal} onClose={() => setShowLogModal(false)} onSubmit={handleAddLog} />
      <PlantFormModal visible={showEditModal} plant={plant} onClose={() => setShowEditModal(false)} onSubmit={handleEdit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: fontSize.lg, color: colors.textSecondary },
  image: { width: '100%', height: 280, backgroundColor: colors.secondary },
  content: { padding: spacing.md },
  header: { marginBottom: spacing.lg },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xs },
  name: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionButton: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  actionText: { fontSize: fontSize.sm, color: colors.primary },
  deleteText: { color: colors.error },
  species: { fontSize: fontSize.md, color: colors.textSecondary, fontStyle: 'italic', marginBottom: spacing.xs },
  date: { fontSize: fontSize.sm, color: colors.textLight },
  section: { marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text },
  chatLink: { fontSize: fontSize.sm, color: colors.primary, fontWeight: '600' },
  notes: { fontSize: fontSize.md, color: colors.textSecondary, lineHeight: 24, backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.sm },
  filterScroll: { marginBottom: spacing.md },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surface, marginRight: spacing.sm, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: fontSize.sm, color: colors.textSecondary },
  filterTextActive: { color: colors.textWhite },
  timeline: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md },
  emptyLogs: { fontSize: fontSize.md, color: colors.textLight, textAlign: 'center', paddingVertical: spacing.xl },
  addLogButton: { backgroundColor: colors.primary, margin: spacing.md, paddingVertical: spacing.md, borderRadius: borderRadius.md, alignItems: 'center' },
  addLogText: { color: colors.textWhite, fontSize: fontSize.md, fontWeight: '600' },
});
