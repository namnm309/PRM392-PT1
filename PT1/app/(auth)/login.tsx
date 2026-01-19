import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { loginStyles } from '@/styles/login';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogin = () => {
    if (login(username, password)) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Lỗi', 'Vui lòng nhập username và password');
    }
  };

  const styles = loginStyles;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Đăng Nhập
          </ThemedText>

          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
                  borderColor: colors.tabIconDefault,
                },
              ]}
              placeholder="Username"
              placeholderTextColor={colors.tabIconDefault}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
                  borderColor: colors.tabIconDefault,
                },
              ]}
              placeholder="Password"
              placeholderTextColor={colors.tabIconDefault}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.tint }]}
              onPress={handleLogin}
            >
              <ThemedText style={styles.buttonText}>Đăng Nhập</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
