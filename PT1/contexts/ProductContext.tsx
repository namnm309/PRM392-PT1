import { Product } from '@/types/product';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);
const STORAGE_KEY = '@pt1/products';

// Dữ liệu sản phẩm mẫu
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    description: 'Điện thoại thông minh cao cấp với chip A17 Pro',
  },
  {
    id: '2',
    name: 'MacBook Pro M3',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
    description: 'Laptop chuyên nghiệp với chip Apple M3',
  },
  {
    id: '3',
    name: 'AirPods Pro',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
    description: 'Tai nghe không dây với chống ồn chủ động',
  },
  {
    id: '4',
    name: 'iPad Air',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
    description: 'Máy tính bảng đa năng với màn hình Retina',
  },
  {
    id: '5',
    name: 'Apple Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    description: 'Đồng hồ thông minh với nhiều tính năng sức khỏe',
  },
];

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isHydrated, setIsHydrated] = useState(false);

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

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const saveProducts = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      } catch (error) {
        console.warn('Failed to save products:', error);
      }
    };

    saveProducts();
  }, [products, isHydrated]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
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
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
