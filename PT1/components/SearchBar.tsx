import React from 'react';
import { TextInput } from 'react-native';
import { ThemedView } from './themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { searchBarStyles } from '@/styles/SearchBar';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Tìm kiếm sản phẩm...' }: SearchBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const styles = searchBarStyles;

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.tabIconDefault}
      />
    </ThemedView>
  );
}
