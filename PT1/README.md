# Ứng dụng Quản lý Sản phẩm

Ứng dụng React Native với Expo Router để quản lý sản phẩm, bao gồm các chức năng đăng nhập, xem danh sách, thêm, sửa, xóa và tìm kiếm sản phẩm.

## Tính năng

- ✅ Đăng nhập đơn giản
- ✅ Hiển thị danh sách sản phẩm với FlatList
- ✅ Tìm kiếm sản phẩm theo tên
- ✅ Xem chi tiết sản phẩm
- ✅ Thêm sản phẩm mới
- ✅ Sửa thông tin sản phẩm
- ✅ Xóa sản phẩm
- ✅ Giao diện đẹp mắt với hỗ trợ dark mode

## Cấu trúc dự án

- `app/` - Các màn hình (screens)
  - `login.tsx` - Màn hình đăng nhập
  - `products.tsx` - Màn hình danh sách sản phẩm
  - `product-detail.tsx` - Màn hình chi tiết sản phẩm
  - `product-form.tsx` - Form thêm/sửa sản phẩm
- `contexts/` - Context API để quản lý state
  - `AuthContext.tsx` - Quản lý authentication
  - `ProductContext.tsx` - Quản lý danh sách sản phẩm
- `components/` - Các component tái sử dụng
  - `ProductCard.tsx` - Card hiển thị sản phẩm
  - `SearchBar.tsx` - Thanh tìm kiếm
- `types/` - TypeScript types
  - `product.ts` - Định nghĩa interface Product

## Cách sử dụng

### Đăng nhập
- Nhập bất kỳ username và password nào để đăng nhập (đơn giản hóa cho demo)

### Quản lý sản phẩm
- Xem danh sách sản phẩm trên màn hình chính
- Sử dụng thanh tìm kiếm để lọc sản phẩm
- Nhấn vào sản phẩm để xem chi tiết
- Nhấn nút "Thêm Sản Phẩm" để thêm mới
- Trong màn hình chi tiết, có thể sửa hoặc xóa sản phẩm

---

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
