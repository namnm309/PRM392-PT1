import React, { useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Redirect } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { Product } from '@/types/product';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { productsStyles } from '@/styles/index';

export default function ProductsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { products } = useProducts();
  const { logout, isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Redirect đến login nếu chưa đăng nhập
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleProductPress = (product: Product) => {
    router.push(`/(tabs)/product-detail?id=${product.id}`);
  };

  const handleAddProduct = () => {
    router.push('/(tabs)/product-form');
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const styles = productsStyles;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Danh Sách Sản Phẩm
          </ThemedText>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.tabIconDefault }]}
            onPress={handleLogout}
          >
            <ThemedText style={styles.logoutText}>Đăng xuất</ThemedText>
          </TouchableOpacity>
        </View>

        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => handleProductPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                {searchQuery ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm nào'}
              </ThemedText>
            </View>
          }
        />

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={handleAddProduct}
        >
          <ThemedText style={styles.addButtonText}>+ Thêm Sản Phẩm</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}
