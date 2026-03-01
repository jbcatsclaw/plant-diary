import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Plant } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

interface Props {
  plant: Plant;
  onPress: () => void;
}

export const PlantCard: React.FC<Props> = ({ plant, onPress }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image 
        source={{ uri: plant.photoUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{plant.name}</Text>
        <Text style={styles.species} numberOfLines={1}>{plant.species}</Text>
        {plant.arrivalDate && (
          <Text style={styles.date}>到家: {formatDate(plant.arrivalDate)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.secondary,
  },
  content: {
    padding: spacing.md,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  species: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontStyle: 'italic',
  },
  date: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
});
