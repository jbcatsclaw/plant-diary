import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PlantLog, getLogTypeLabel } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

interface Props {
  log: PlantLog;
}

const getLogTypeColor = (type: string): string => {
  switch (type) {
    case 'watering':
      return '#7BA05B';
    case 'fertilizing':
      return '#D4A574';
    case 'pruning':
      return '#A8C686';
    case 'pest_control':
      return '#C97B7B';
    default:
      return colors.textSecondary;
  }
};

export const LogItem: React.FC<Props> = ({ log }) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: getLogTypeColor(log.type) }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.typeBadge, { backgroundColor: getLogTypeColor(log.type) + '20' }]}>
            <Text style={[styles.typeText, { color: getLogTypeColor(log.type) }]}>
              {getLogTypeLabel(log.type)}
            </Text>
          </View>
          <Text style={styles.date}>{formatDate(log.date)}</Text>
        </View>
        {log.notes ? <Text style={styles.notes}>{log.notes}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingRight: spacing.md,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.md,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  date: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
  notes: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
