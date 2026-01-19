import React from 'react';
import { View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useProducts } from '@/contexts/ProductContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { productDetailStyles } from '@/styles/product-detail';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProduct, deleteProduct } = useProducts();
  const product = id ? getProduct(id) : undefined;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const styles = productDetailStyles;

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.errorText}>Không tìm thấy sản phẩm</ThemedText>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint }]}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.buttonText}>Quay lại</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const handleEdit = () => {
    router.push(`/(tabs)/product-form?id=${product.id}`);
  };

  const handleDelete = () => {
    Alert.alert('Xóa sản phẩm', `Bạn có chắc chắn muốn xóa "${product.name}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          deleteProduct(product.id);
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ThemedText>← Quay lại</ThemedText>
          </TouchableOpacity>

          <Image
            source={{ uri: product.image }}
            style={styles.image}
            placeholder={require('@/assets/images/icon.png')}
            contentFit="cover"
            transition={200}
          />

          <View style={styles.content}>
            <ThemedText type="title" style={styles.name}>
              {product.name}
            </ThemedText>

            {product.description && (
              <ThemedText style={styles.description}>{product.description}</ThemedText>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.editButton, { backgroundColor: colors.tint }]}
                onPress={handleEdit}
              >
                <ThemedText style={styles.buttonText}>Sửa</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton, { backgroundColor: '#ff4444' }]}
                onPress={handleDelete}
              >
                <ThemedText style={styles.buttonText}>Xóa</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
