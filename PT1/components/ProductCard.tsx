import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Product } from '@/types/product';
import { productCardStyles } from '@/styles/ProductCard';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const styles = productCardStyles;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView style={styles.card}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          placeholder={require('@/assets/images/icon.png')}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.content}>
          <ThemedText type="defaultSemiBold" style={styles.name}>
            {product.name}
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
