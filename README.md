# 📱 Ứng dụng Quản lý Sản phẩm - PT1

Ứng dụng React Native được xây dựng với Expo Router để quản lý sản phẩm, bao gồm các chức năng đăng nhập, xem danh sách, thêm, sửa, xóa và tìm kiếm sản phẩm.

## 📋 Mục lục

1. [Tổng quan ứng dụng](#tổng-quan-ứng-dụng)
2. [Cấu trúc dự án chi tiết](#cấu-trúc-dự-án-chi-tiết)
3. [Cách code - Kiến trúc và Pattern](#cách-code---kiến-trúc-và-pattern)
4. [Triển khai Login](#triển-khai-login)
5. [Trang sản phẩm](#trang-sản-phẩm)
6. [Chức năng CRUD](#chức-năng-crud)
7. [Chức năng tìm kiếm](#chức-năng-tìm-kiếm)
8. [Lưu trữ dữ liệu](#lưu-trữ-dữ-liệu)
9. [Cài đặt và chạy](#cài-đặt-và-chạy)
10. [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)

---

## 🎯 Tổng quan ứng dụng

Ứng dụng React Native quản lý sản phẩm với các tính năng:

- **Authentication**: Đăng nhập/đăng xuất đơn giản
- **Product Management**: CRUD đầy đủ (Create, Read, Update, Delete)
- **Search**: Tìm kiếm sản phẩm theo tên theo thời gian thực
- **Image Handling**: Chọn ảnh từ thư viện hoặc camera
- **Persistent Storage**: Lưu trữ local với AsyncStorage
- **Dark Mode**: Hỗ trợ chế độ sáng/tối tự động
- **TypeScript**: Type-safe code

### Tech Stack

- **React Native** - Framework phát triển ứng dụng mobile
- **Expo** - Platform và toolchain cho React Native
- **Expo Router** - File-based routing cho React Native
- **React Context API** - Quản lý global state
- **AsyncStorage** - Lưu trữ dữ liệu local trên thiết bị
- **Expo Image** - Component hiển thị hình ảnh tối ưu
- **Expo Image Picker** - Chọn ảnh từ thư viện hoặc camera
- **TypeScript** - Type-safe JavaScript

---

## 📁 Cấu trúc dự án chi tiết

### 1. **`app/` - Routing & Screens**

Expo Router sử dụng file-based routing. Tên file = route path.

```
app/
├── _layout.tsx              # Root layout - Setup providers và navigation
├── index.tsx                # Entry point - Redirect logic dựa trên authentication
├── (auth)/                  # Route group - Authentication screens
│   ├── _layout.tsx          # Stack layout cho auth screens
│   └── login.tsx            # Màn hình đăng nhập
└── (tabs)/                  # Route group - Main app (Tab navigation)
    ├── _layout.tsx          # Tab navigation layout
    ├── index.tsx            # Tab 1: Danh sách sản phẩm
    ├── product-form.tsx     # Tab 2: Form thêm/sửa sản phẩm
    └── product-detail.tsx   # Hidden tab: Chi tiết sản phẩm (không hiện trong tab bar)
```

**Giải thích:**
- `(auth)` và `(tabs)` là route groups - không xuất hiện trong URL
- `_layout.tsx` định nghĩa layout cho nhóm routes
- `index.tsx` là route mặc định của folder
- File-based routing: tên file = route path

### 2. **`contexts/` - State Management**

Quản lý global state với React Context API.

```
contexts/
├── AuthContext.tsx      # Authentication state (isAuthenticated, login, logout)
└── ProductContext.tsx   # Products state + AsyncStorage integration
```

**Pattern sử dụng:**
- Context Provider bọc toàn bộ app trong `app/_layout.tsx`
- Custom hooks (`useAuth`, `useProducts`) để access context
- State được quản lý tập trung, dễ maintain

### 3. **`components/` - Reusable Components**

Các component tái sử dụng được sử dụng trong nhiều screens.

```
components/
├── ProductCard.tsx      # Card hiển thị sản phẩm trong danh sách
├── SearchBar.tsx         # Input tìm kiếm với theme support
├── themed-text.tsx      # Text component với theme support (dark/light)
├── themed-view.tsx      # View component với theme support
└── ui/                  # UI components khác (collapsible, icon-symbol)
```

**Pattern:**
- Component nhận props, tách biệt logic và presentation
- Hỗ trợ theme (dark/light mode) tự động
- Tái sử dụng code, dễ maintain

### 4. **`styles/` - StyleSheet Definitions**

Tập trung styling cho từng screen/component.

```
styles/
├── index.ts             # Styles cho danh sách sản phẩm
├── login.ts            # Styles cho login screen
├── product-form.ts     # Styles cho form thêm/sửa
├── product-detail.ts   # Styles cho màn hình chi tiết
├── ProductCard.ts      # Styles cho ProductCard component
└── SearchBar.ts        # Styles cho SearchBar component
```

**Pattern:**
- Mỗi file export một StyleSheet object
- Import và sử dụng trong component tương ứng
- Tách biệt styling khỏi logic, dễ quản lý

### 5. **`hooks/` - Custom Hooks**

Logic tái sử dụng được đóng gói trong hooks.

```
hooks/
├── use-color-scheme.ts    # Detect system theme (light/dark)
└── use-theme-color.ts      # Get color theo theme hiện tại
```

**Lợi ích:**
- Tách logic tái sử dụng
- Dễ test và maintain
- Code gọn gàng hơn

### 6. **`types/` - TypeScript Types**

Định nghĩa types/interfaces cho type safety.

```
types/
└── product.ts    # Product interface định nghĩa cấu trúc sản phẩm
```

### 7. **`constants/` - Constants**

Hằng số và cấu hình.

```
constants/
└── theme.ts    # Colors và fonts cho light/dark mode
```

### 8. **`assets/` - Static Assets**

Hình ảnh, icons, fonts.

```
assets/
└── images/     # App icons, splash screen, favicon, etc.
```

---

## 💻 Cách code - Kiến trúc và Pattern

### 1. **Component Structure Pattern**

Mỗi component tuân theo pattern chuẩn:

```typescript
// 1. Import dependencies
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// 2. Import custom hooks và contexts
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

// 3. Import styles
import { componentStyles } from '@/styles/component';

// 4. Define component
export default function ComponentName() {
  // 5. Hooks
  const { products, addProduct } = useProducts();
  const { isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();
  
  // 6. State (nếu cần)
  const [state, setState] = useState('');
  
  // 7. Handlers
  const handleAction = () => {
    // Logic
  };
  
  // 8. useEffect (nếu cần)
  useEffect(() => {
    // Side effects
  }, []);
  
  // 9. Render
  return (
    <View style={componentStyles.container}>
      {/* JSX */}
    </View>
  );
}
```

### 2. **Context Pattern**

```typescript
// 1. Define Context Type
interface ContextType {
  state: Type;
  actions: () => void;
}

// 2. Create Context
const Context = createContext<ContextType | undefined>(undefined);

// 3. Provider Component
export function Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);
  
  const actions = () => {
    // Logic
    setState(newState);
  };
  
  return (
    <Context.Provider value={{ state, actions }}>
      {children}
    </Context.Provider>
  );
}

// 4. Custom Hook để access context
export function useContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Must be used within Provider');
  }
  return context;
}
```

### 3. **Styling Pattern**

```typescript
// styles/component.ts
import { StyleSheet } from 'react-native';

export const componentStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

// Component
import { componentStyles } from '@/styles/component';

<View style={componentStyles.container}>
  <Text style={componentStyles.title}>Title</Text>
</View>
```

### 4. **Navigation Pattern (Expo Router)**

```typescript
// Navigate to screen
import { router } from 'expo-router';

// Push (có thể back)
router.push('/(tabs)/product-detail?id=123');

// Replace (không thể back)
router.replace('/(auth)/login');

// Back
router.back();

// Get params từ URL
import { useLocalSearchParams } from 'expo-router';

const { id } = useLocalSearchParams<{ id: string }>();
```

---

## 🔐 Triển khai Login

### 1. **AuthContext Setup**

**File: `contexts/AuthContext.tsx`**

```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (username: string, password: string): boolean => {
    // Simple validation: chỉ cần username và password không rỗng
    if (username && password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Giải thích:**
- `AuthProvider` bọc toàn bộ app để cung cấp auth state
- `useAuth` hook để access context trong components
- State `isAuthenticated` quản lý trạng thái đăng nhập
- `login()` function validate và set state
- `logout()` function reset state về false

### 2. **Root Layout Setup**

**File: `app/_layout.tsx`**

```typescript
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ProductProvider>
    </AuthProvider>
  );
}
```

**Giải thích:**
- `AuthProvider` và `ProductProvider` bọc toàn bộ app
- Tất cả screens đều có thể access contexts
- Stack navigation định nghĩa 2 route groups

### 3. **Entry Point - Redirect Logic**

**File: `app/index.tsx`**

```typescript
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { isAuthenticated } = useAuth();

  // Nếu đã đăng nhập → redirect đến tabs
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  // Chưa đăng nhập → redirect đến login
  return <Redirect href="/(auth)/login" />;
}
```

**Flow:**
1. App khởi động → `app/index.tsx` được render đầu tiên
2. Check `isAuthenticated` từ `AuthContext`
3. Redirect đến màn hình phù hợp:
   - `true` → `/(tabs)` (màn hình chính)
   - `false` → `/(auth)/login` (màn hình đăng nhập)

### 4. **Login Screen**

**File: `app/(auth)/login.tsx`**

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = () => {
    // Gọi login function từ context
    if (login(username, password)) {
      // Login thành công → navigate đến tabs
      router.replace('/(tabs)');
    } else {
      // Login thất bại → hiển thị alert
      Alert.alert('Lỗi', 'Vui lòng nhập username và password');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Đăng Nhập</ThemedText>
      
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity onPress={handleLogin}>
        <ThemedText>Đăng Nhập</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
```

**Flow Login:**
1. User nhập username/password vào TextInput
2. Nhấn "Đăng Nhập" → `handleLogin()` được gọi
3. Gọi `login(username, password)` từ `AuthContext`
4. Nếu thành công → `setIsAuthenticated(true)` trong context
5. `router.replace('/(tabs)')` → chuyển đến màn hình chính
6. `app/index.tsx` detect `isAuthenticated = true` → không redirect về login nữa

### 5. **Protected Routes**

**File: `app/(tabs)/index.tsx`**

```typescript
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductsScreen() {
  const { isAuthenticated } = useAuth();

  // Nếu chưa đăng nhập → redirect về login
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Đã đăng nhập → render màn hình
  return (
    // ... UI
  );
}
```

**Giải thích:**
- Mỗi protected screen check `isAuthenticated` ở đầu component
- Nếu `false` → render `<Redirect>` về login
- Đảm bảo user phải đăng nhập mới truy cập được

### 6. **Logout Functionality**

```typescript
const handleLogout = () => {
  Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
    { text: 'Hủy', style: 'cancel' },
    {
      text: 'Đăng xuất',
      style: 'destructive',
      onPress: () => {
        logout(); // Gọi logout từ context
        router.replace('/(auth)/login'); // Navigate về login
      },
    },
  ]);
};
```

---

## 📦 Trang sản phẩm

### 1. **ProductContext - State Management**

**File: `contexts/ProductContext.tsx`**

```typescript
import { Product } from '@/types/product';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

const STORAGE_KEY = '@pt1/products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Initial products data (sản phẩm mẫu)
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    description: 'Điện thoại thông minh cao cấp với chip A17 Pro',
  },
  // ... more products
];

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load dữ liệu từ AsyncStorage khi app khởi động
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const storedProducts = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        }
      } catch (error) {
        console.warn('Failed to load products:', error);
      } finally {
        setIsHydrated(true);
      }
    };
    loadProducts();
  }, []);

  // Tự động lưu vào AsyncStorage khi products thay đổi
  useEffect(() => {
    if (!isHydrated) return;

    const saveProducts = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      } catch (error) {
        console.warn('Failed to save products:', error);
      }
    };
    saveProducts();
  }, [products, isHydrated]);

  // CRUD Functions
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(), // Generate unique ID
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, product: Omit<Product, 'id'>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...product, id } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProduct = (id: string) => {
    return products.find((p) => p.id === id);
  };

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
}
```

**Giải thích:**
- `isHydrated`: flag để đảm bảo load xong mới save (tránh overwrite dữ liệu)
- `loadProducts`: load từ AsyncStorage khi component mount
- `saveProducts`: tự động save khi `products` state thay đổi
- CRUD functions: thao tác với state, tự động trigger save effect

### 2. **Products List Screen**

**File: `app/(tabs)/index.tsx`**

```typescript
import React, { useState, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { router, Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { Product } from '@/types/product';

export default function ProductsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { products } = useProducts();
  const { logout, isAuthenticated } = useAuth();

  // Protected route check
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products; // Không có query → trả về tất cả
    }
    // Filter: tìm kiếm không phân biệt hoa thường
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Navigate to product detail
  const handleProductPress = (product: Product) => {
    router.push(`/(tabs)/product-detail?id=${product.id}`);
  };

  // Logout handler
  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <ThemedText type="title">Danh Sách Sản Phẩm</ThemedText>
        <TouchableOpacity onPress={handleLogout}>
          <ThemedText>Đăng xuất</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => handleProductPress(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText>
              {searchQuery ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm nào'}
            </ThemedText>
          </View>
        }
      />
    </SafeAreaView>
  );
}
```

**Giải thích:**
- `useMemo`: tối ưu filter, chỉ re-compute khi `products` hoặc `searchQuery` thay đổi
- `FlatList`: render danh sách hiệu quả với virtualization
- `ListEmptyComponent`: hiển thị khi không có sản phẩm

### 3. **ProductCard Component**

**File: `components/ProductCard.tsx`**

```typescript
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView style={styles.card}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          placeholder={require('@/assets/images/icon.png')}
          contentFit="cover"
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
```

**Giải thích:**
- Component nhận `product` và `onPress` callback
- `expo-image`: tối ưu hiển thị ảnh với placeholder
- `TouchableOpacity`: feedback khi nhấn

---

## 🔧 Chức năng CRUD

### 1. **CREATE - Thêm sản phẩm**

**File: `app/(tabs)/product-form.tsx`**

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useProducts } from '@/contexts/ProductContext';

export default function ProductFormScreen() {
  const { addProduct } = useProducts();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần cấp quyền truy cập thư viện ảnh');
      return;
    }

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

  // Chụp ảnh từ camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Lỗi', 'Cần cấp quyền camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  // Lưu sản phẩm
  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên sản phẩm');
      return;
    }

    if (!image.trim()) {
      Alert.alert('Lỗi', 'Vui lòng chọn ảnh sản phẩm');
      return;
    }

    // Gọi addProduct từ context
    addProduct({
      name: name.trim(),
      image: image.trim(),
      description: description.trim(),
    });

    Alert.alert('Thành công', 'Đã thêm sản phẩm mới', [
      { text: 'OK', onPress: () => router.replace('/(tabs)') },
    ]);
  };

  return (
    <View>
      <TextInput
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
      />
      
      <TouchableOpacity onPress={pickImage}>
        {/* Image picker UI */}
      </TouchableOpacity>
      
      <TextInput
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      
      <TouchableOpacity onPress={handleSave}>
        <Text>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
}
```

**Flow CREATE:**
1. User nhập thông tin sản phẩm (name, description)
2. Chọn ảnh (thư viện hoặc camera) → lưu URI vào state
3. Nhấn "Lưu" → validation (check name và image)
4. Gọi `addProduct()` từ context
5. Context tạo ID mới (`Date.now().toString()`) và thêm vào state
6. `useEffect` detect thay đổi → tự động save vào AsyncStorage
7. Alert thành công → navigate về danh sách

### 2. **READ - Đọc/Xem sản phẩm**

**File: `app/(tabs)/product-detail.tsx`**

```typescript
import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useProducts } from '@/contexts/ProductContext';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProduct } = useProducts();
  const product = id ? getProduct(id) : undefined;

  if (!product) {
    return <Text>Không tìm thấy sản phẩm</Text>;
  }

  return (
    <ScrollView>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      {product.description && (
        <Text style={styles.description}>{product.description}</Text>
      )}
    </ScrollView>
  );
}
```

**Giải thích:**
- Lấy `id` từ URL params bằng `useLocalSearchParams`
- Dùng `getProduct(id)` để tìm sản phẩm trong products array
- Hiển thị thông tin sản phẩm

### 3. **UPDATE - Sửa sản phẩm**

**File: `app/(tabs)/product-form.tsx` (Edit Mode)**

```typescript
import { useLocalSearchParams } from 'expo-router';
import { useProducts } from '@/contexts/ProductContext';

export default function ProductFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getProduct, addProduct, updateProduct } = useProducts();
  
  const isEditMode = !!id; // Có id = edit mode, không có = create mode
  const existingProduct = id ? getProduct(id) : undefined;

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  // Load dữ liệu sản phẩm khi edit mode
  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setImage(existingProduct.image);
      setDescription(existingProduct.description || '');
    }
  }, [existingProduct]);

  const handleSave = () => {
    // Validation
    if (!name.trim() || !image.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (isEditMode && id) {
      // UPDATE: Gọi updateProduct với id
      updateProduct(id, {
        name: name.trim(),
        image: image.trim(),
        description: description.trim(),
      });
      Alert.alert('Thành công', 'Đã cập nhật sản phẩm', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      // CREATE: Gọi addProduct
      addProduct({
        name: name.trim(),
        image: image.trim(),
        description: description.trim(),
      });
      Alert.alert('Thành công', 'Đã thêm sản phẩm mới', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    }
  };

  return (
    <View>
      <Text>{isEditMode ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</Text>
      {/* Form fields */}
    </View>
  );
}
```

**Flow UPDATE:**
1. Navigate với `id`: `router.push('/(tabs)/product-form?id=123')`
2. Component detect `id` → `isEditMode = true`
3. `useEffect` load dữ liệu sản phẩm hiện tại vào form
4. User chỉnh sửa thông tin
5. Nhấn "Lưu" → validation → gọi `updateProduct(id, {...})`
6. Context update state bằng `map()` → tự động save AsyncStorage
7. Alert → navigate back

### 4. **DELETE - Xóa sản phẩm**

**File: `app/(tabs)/product-detail.tsx`**

```typescript
import { useProducts } from '@/contexts/ProductContext';
import { router } from 'expo-router';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProduct, deleteProduct } = useProducts();
  const product = id ? getProduct(id) : undefined;

  const handleDelete = () => {
    if (!product) return;

    // Xác nhận trước khi xóa
    Alert.alert(
      'Xóa sản phẩm',
      `Bạn có chắc chắn muốn xóa "${product.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            // Gọi deleteProduct từ context
            deleteProduct(product.id);
            // Navigate về danh sách
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  return (
    <View>
      {/* Product details */}
      <TouchableOpacity onPress={handleDelete}>
        <Text style={{ color: '#ff4444' }}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );
}
```

**Flow DELETE:**
1. User nhấn nút "Xóa" trong màn hình chi tiết
2. Alert xác nhận hiển thị
3. Nếu confirm → gọi `deleteProduct(id)`
4. Context filter sản phẩm khỏi state bằng `filter()`
5. `useEffect` detect thay đổi → tự động save AsyncStorage
6. Navigate về danh sách

---

## 🔍 Chức năng tìm kiếm

### 1. **SearchBar Component**

**File: `components/SearchBar.tsx`**

```typescript
import React from 'react';
import { TextInput } from 'react-native';
import { ThemedView } from './themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm sản phẩm...',
}: SearchBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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
```

**Giải thích:**
- Controlled component: nhận `value` và `onChangeText` từ parent
- Hỗ trợ theme (dark/light mode) tự động
- Placeholder có thể customize

### 2. **Search Logic trong Products Screen**

**File: `app/(tabs)/index.tsx`**

```typescript
import { useState, useMemo } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { SearchBar } from '@/components/SearchBar';

export default function ProductsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { products } = useProducts();

  // Filter products với useMemo để tối ưu performance
  const filteredProducts = useMemo(() => {
    // Nếu không có query → trả về tất cả
    if (!searchQuery.trim()) {
      return products;
    }

    // Filter: tìm kiếm không phân biệt hoa thường
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]); // Chỉ re-compute khi products hoặc searchQuery thay đổi

  return (
    <View>
      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery} // Update searchQuery khi user nhập
      />

      {/* Render filtered products */}
      <FlatList
        data={filteredProducts} // Sử dụng filteredProducts thay vì products
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </View>
  );
}
```

**Giải thích:**
- `searchQuery`: state lưu text user nhập
- `useMemo`: tối ưu filter, chỉ chạy lại khi dependencies thay đổi
- Filter logic: `product.name.toLowerCase().includes(searchQuery.toLowerCase())`
- Real-time: mỗi khi `searchQuery` thay đổi → `filteredProducts` tự động update → UI re-render

### 3. **Search Flow**

```
User nhập vào SearchBar
    ↓
onChangeText được gọi
    ↓
setSearchQuery(newText)
    ↓
searchQuery state thay đổi
    ↓
useMemo detect dependency thay đổi
    ↓
Re-compute filteredProducts
    ↓
FlatList re-render với filteredProducts mới
    ↓
UI hiển thị kết quả tìm kiếm
```

**Tối ưu:**
- `useMemo`: tránh filter lại mỗi lần render
- Case-insensitive: không phân biệt hoa thường
- Trim: bỏ qua khoảng trắng thừa

---

## 💾 Lưu trữ dữ liệu

### AsyncStorage Implementation

**File: `contexts/ProductContext.tsx`**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@pt1/products';

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. LOAD: Load dữ liệu khi app khởi động
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const storedProducts = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedProducts) {
          // Parse JSON string thành array
          setProducts(JSON.parse(storedProducts));
        }
        // Nếu không có dữ liệu → dùng initialProducts
      } catch (error) {
        console.warn('Failed to load products:', error);
      } finally {
        setIsHydrated(true); // Đánh dấu đã load xong
      }
    };
    loadProducts();
  }, []);

  // 2. SAVE: Tự động lưu khi products thay đổi
  useEffect(() => {
    if (!isHydrated) return; // Chưa load xong → không save

    const saveProducts = async () => {
      try {
        // Convert array thành JSON string
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      } catch (error) {
        console.warn('Failed to save products:', error);
      }
    };
    saveProducts();
  }, [products, isHydrated]);
}
```

**Giải thích:**
- `isHydrated`: đảm bảo load xong mới save (tránh overwrite dữ liệu khi khởi động)
- Load: chạy 1 lần khi component mount
- Save: tự động khi `products` state thay đổi
- JSON: serialize/deserialize data

**Storage Location:**
- iOS: `Library/Preferences/`
- Android: `SharedPreferences`
- Web: `localStorage`

**Đặc điểm:**
- ✅ Dữ liệu tồn tại sau khi đóng app
- ✅ Tự động load khi mở lại app
- ✅ Tự động lưu khi có thay đổi
- ✅ Lưu trữ dạng JSON string

---

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn
- Expo CLI (tự động cài khi chạy lệnh)

### Cài đặt dependencies

   ```bash
   npm install
   ```

### Chạy ứng dụng

   ```bash
# Khởi động development server
npm start
# hoặc
   npx expo start
   ```

Sau khi chạy, bạn sẽ thấy QR code và các tùy chọn:
- Nhấn `a` để mở trên Android emulator
- Nhấn `i` để mở trên iOS simulator
- Quét QR code bằng Expo Go app trên điện thoại thật

### Chạy trên platform cụ thể

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

### Scripts khác

```bash
# Lint code
npm run lint

# Reset project về trạng thái ban đầu
npm run reset-project
```

---

## 📖 Hướng dẫn sử dụng

### Đăng nhập

1. Mở ứng dụng
2. Nhập bất kỳ **username** và **password** nào (không cần đúng format)
3. Nhấn "Đăng Nhập"
4. Ứng dụng sẽ chuyển đến màn hình danh sách sản phẩm

### Xem danh sách sản phẩm

- Màn hình chính hiển thị tất cả sản phẩm
- Sử dụng thanh tìm kiếm ở trên để lọc sản phẩm theo tên
- Nhấn vào một sản phẩm để xem chi tiết

### Thêm sản phẩm mới

1. Nhấn tab **"Thêm mới"** ở bottom navigation
2. Nhập tên sản phẩm (bắt buộc)
3. Chọn ảnh sản phẩm:
   - Nhấn vào khung ảnh
   - Chọn "Thư viện ảnh" hoặc "Chụp ảnh"
   - Ảnh sẽ được hiển thị preview
4. Nhập mô tả (tùy chọn)
5. Nhấn **"Lưu"**
6. Sản phẩm sẽ được thêm vào danh sách

### Sửa sản phẩm

1. Mở chi tiết sản phẩm
2. Nhấn nút **"Sửa"**
3. Chỉnh sửa thông tin trong form
4. Nhấn **"Lưu"**
5. Thay đổi sẽ được cập nhật

### Xóa sản phẩm

1. Mở chi tiết sản phẩm
2. Nhấn nút **"Xóa"**
3. Xác nhận xóa trong dialog
4. Sản phẩm sẽ bị xóa khỏi danh sách

### Đăng xuất

1. Nhấn nút **"Đăng xuất"** ở góc trên bên phải
2. Xác nhận đăng xuất
3. Ứng dụng sẽ quay về màn hình đăng nhập

---

## 📝 Tóm tắt

### Kiến trúc tổng thể:

```
App Entry (app/index.tsx)
    ↓
Root Layout (app/_layout.tsx) - Providers
    ↓
Auth Check → Redirect
    ↓
Screens (Protected)
    ↓
Components (Reusable)
    ↓
Contexts (State Management)
    ↓
AsyncStorage (Persistence)
```

### Flow hoàn chỉnh:

1. **Login** → AuthContext → Redirect
2. **View Products** → ProductContext → FlatList
3. **Search** → Filter → Re-render
4. **Create** → addProduct → Auto-save
5. **Update** → updateProduct → Auto-save
6. **Delete** → deleteProduct → Auto-save

### Best Practices áp dụng:

- ✅ Separation of Concerns
- ✅ Component Reusability
- ✅ Type Safety (TypeScript)
- ✅ Performance Optimization (useMemo)
- ✅ Error Handling
- ✅ User Feedback (Alerts)
- ✅ Persistent Storage
- ✅ Protected Routes

---

## 🐛 Troubleshooting

### Lỗi không load được ảnh

- Kiểm tra quyền truy cập thư viện ảnh/camera
- Đảm bảo đã cấp quyền trong settings

### Dữ liệu bị mất

- Kiểm tra AsyncStorage có hoạt động không
- Xóa app và cài lại nếu cần

### Lỗi TypeScript

```bash
# Xóa cache và rebuild
npm start -- --clear
```

---

## 📄 License

Dự án này được tạo cho mục đích học tập và demo.

---

## 👨‍💻 Tác giả

**PT1 - NamNMSE182871**

---

## 📚 Tài liệu tham khảo

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)

---

**Lưu ý:** Đây là một ứng dụng demo được xây dựng cho mục đích học tập. Authentication được đơn giản hóa, trong production cần tích hợp backend API và authentication thực tế.
