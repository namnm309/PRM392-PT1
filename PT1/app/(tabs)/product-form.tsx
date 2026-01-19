import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useProducts } from '@/contexts/ProductContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { productFormStyles } from '@/styles/product-form';

export default function ProductFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getProduct, addProduct, updateProduct } = useProducts();
  const isEditMode = !!id;
  const existingProduct = id ? getProduct(id) : undefined;

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setImage(existingProduct.image);
      setDescription(existingProduct.description || '');
    }
  }, [existingProduct]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên sản phẩm');
      return;
    }

    if (!image.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập URL ảnh');
      return;
    }

    if (isEditMode && id) {
      updateProduct(id, { name: name.trim(), image: image.trim(), description: description.trim() });
      Alert.alert('Thành công', 'Đã cập nhật sản phẩm', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      addProduct({ name: name.trim(), image: image.trim(), description: description.trim() });
      Alert.alert('Thành công', 'Đã thêm sản phẩm mới', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    }
  };

  const styles = productFormStyles;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>
            {isEditMode ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}
          </ThemedText>

          <View style={styles.form}>
            <ThemedText style={styles.label}>Tên sản phẩm *</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
                  borderColor: colors.tabIconDefault,
                },
              ]}
              placeholder="Nhập tên sản phẩm"
              placeholderTextColor={colors.tabIconDefault}
              value={name}
              onChangeText={setName}
            />

            <ThemedText style={styles.label}>URL ảnh *</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
                  borderColor: colors.tabIconDefault,
                },
              ]}
              placeholder="Nhập URL ảnh"
              placeholderTextColor={colors.tabIconDefault}
              value={image}
              onChangeText={setImage}
              autoCapitalize="none"
              keyboardType="url"
            />

            <ThemedText style={styles.label}>Mô tả</ThemedText>
            <TextInput
              style={[
                styles.textArea,
                {
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
                  borderColor: colors.tabIconDefault,
                },
              ]}
              placeholder="Nhập mô tả sản phẩm (tùy chọn)"
              placeholderTextColor={colors.tabIconDefault}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { borderColor: colors.tabIconDefault }]}
                onPress={() => router.back()}
              >
                <ThemedText style={[styles.cancelButtonText, { color: colors.text }]}>
                  Hủy
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton, { backgroundColor: colors.tint }]}
                onPress={handleSave}
              >
                <ThemedText style={styles.saveButtonText}>Lưu</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
