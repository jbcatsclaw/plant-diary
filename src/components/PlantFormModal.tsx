import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Plant, PlantFormData } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../constants/theme';

interface Props {
  visible: boolean;
  plant?: Plant | null;
  onClose: () => void;
  onSubmit: (data: PlantFormData) => void;
}

const defaultFormData: PlantFormData = {
  name: '',
  species: '',
  photoUrl: '',
  arrivalDate: new Date(),
  notes: '',
};

export const PlantFormModal: React.FC<Props> = ({ visible, plant, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<PlantFormData>(defaultFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof PlantFormData, string>>>({});

  useEffect(() => {
    if (plant) {
      setFormData({
        name: plant.name,
        species: plant.species,
        photoUrl: plant.photoUrl,
        arrivalDate: plant.arrivalDate,
        notes: plant.notes,
      });
    } else {
      setFormData(defaultFormData);
    }
    setErrors({});
  }, [plant, visible]);

  const handleSubmit = () => {
    const newErrors: Partial<Record<keyof PlantFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入植物名称';
    }
    if (!formData.species.trim()) {
      newErrors.species = '请输入品种';
    }
    if (!formData.photoUrl.trim()) {
      newErrors.photoUrl = '请输入图片地址';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    onClose();
  };

  const updateField = <K extends keyof PlantFormData>(field: K, value: PlantFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>取消</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{plant ? '编辑植物' : '添加植物'}</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.submitText}>保存</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.field}>
            <Text style={styles.label}>名称 *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(v) => updateField('name', v)}
              placeholder="如：绿萝"
              placeholderTextColor={colors.textLight}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>品种 *</Text>
            <TextInput
              style={[styles.input, errors.species && styles.inputError]}
              value={formData.species}
              onChangeText={(v) => updateField('species', v)}
              placeholder="如：Epipremnum aureum"
              placeholderTextColor={colors.textLight}
            />
            {errors.species && <Text style={styles.errorText}>{errors.species}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>图片地址 *</Text>
            <TextInput
              style={[styles.input, errors.photoUrl && styles.inputError]}
              value={formData.photoUrl}
              onChangeText={(v) => updateField('photoUrl', v)}
              placeholder="https://..."
              placeholderTextColor={colors.textLight}
              autoCapitalize="none"
              keyboardType="url"
            />
            {errors.photoUrl && <Text style={styles.errorText}>{errors.photoUrl}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>备注</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(v) => updateField('notes', v)}
              placeholder="添加备注..."
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  cancelText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  submitText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
  },
  form: {
    flex: 1,
    padding: spacing.md,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: fontSize.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
