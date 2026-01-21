import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useProducts } from '@/contexts/ProductContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { productFormStyles } from '@/styles/product-form';

export default function ProductFormScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  // Normalize id - có thể là string hoặc array
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { getProduct, addProduct, updateProduct } = useProducts();
  const isEditMode = !!id;
  const existingProduct = id ? getProduct(id) : undefined;

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const prevIdRef = useRef<string | undefined>(undefined);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Reset form dựa trên id - reset khi id thay đổi hoặc không có id
  useEffect(() => {
    // Nếu không có id (chế độ thêm mới), reset form
    if (!id) {
      setName('');
      setImage('');
      setDescription('');
      prevIdRef.current = id;
      return;
    }

    // Nếu có id (chế độ chỉnh sửa)
    if (existingProduct) {
      // Load dữ liệu sản phẩm
      setName(existingProduct.name);
      setImage(existingProduct.image);
      setDescription(existingProduct.description || '');
    } else {
      // Có id nhưng không tìm thấy sản phẩm, reset form
      setName('');
      setImage('');
      setDescription('');
    }
    prevIdRef.current = id;
  }, [id, existingProduct]);

  const pickImage = async () => {
    // Xin quyền truy cập thư viện ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần cấp quyền truy cập thư viện ảnh để chọn ảnh');
      return;
    }

    // Mở thư viện ảnh
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Xin quyền camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần cấp quyền camera để chụp ảnh');
      return;
    }

    // Mở camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Chọn ảnh', 'Bạn muốn lấy ảnh từ đâu?', [
      { text: 'Thư viện ảnh', onPress: pickImage },
      { text: 'Chụp ảnh', onPress: takePhoto },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên sản phẩm');
      return;
    }

    if (!image.trim()) {
      Alert.alert('Lỗi', 'Vui lòng chọn ảnh sản phẩm');
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
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

            <ThemedText style={styles.label}>Ảnh sản phẩm *</ThemedText>
            <TouchableOpacity
              style={[
                styles.imagePickerButton,
                {
                  backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
                  borderColor: colors.tabIconDefault,
                },
              ]}
              onPress={showImageOptions}
            >
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={styles.imagePreview}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <ThemedText style={[styles.imagePlaceholderText, { color: colors.tabIconDefault }]}>
                    📷 Nhấn để chọn ảnh
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
            {image && (
              <TouchableOpacity onPress={() => setImage('')}>
                <ThemedText style={[styles.removeImageText, { color: '#ff4444' }]}>
                  Xóa ảnh
                </ThemedText>
              </TouchableOpacity>
            )}

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
