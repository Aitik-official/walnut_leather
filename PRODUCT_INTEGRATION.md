# Product Integration Guide

## 🎯 Overview

The website now displays products from two sources:

1. **Static Products**: Pre-defined products in the codebase
2. **Database Products**: Products uploaded through the admin dashboard

## 🔄 How It Works

### **Dynamic Product Grid**

- **Component**: `components/dynamic-product-grid.tsx`
- **Functionality**:
  - Fetches products from MongoDB database
  - Combines with static products
  - Displays all products in a unified grid
  - Shows source badges (New/Featured)
  - Handles loading states and errors

### **Product Sources**

#### **Static Products (8 items)**

- Classic Rider Jacket
- Shearling Aviator
- Heritage Bomber
- Minimalist Moto
- Field Jacket
- Modern Trucker
- City Biker
- Studio Leather Blazer

#### **Database Products (Dynamic)**

- Products uploaded via `/dashboard`
- Stored in MongoDB
- Images/videos stored in Cloudinary
- Real-time updates

## 🎨 Visual Indicators

### **Product Badges**

- **"New" Badge**: Blue badge for database products
- **"Featured" Badge**: Red badge for featured database products
- **"Featured" Badge**: Gray badge for static products

### **Product Information**

- **Static Products**: Basic info (name, price, image)
- **Database Products**: Full details (category, size, color, material, stock, description)

## 📍 Where Products Appear

1. **Homepage** (`/`): Featured products section
2. **Shop Page** (`/shop`): All products
3. **Product Stats**: Shows count of each product type

## 🔧 Technical Details

### **API Endpoints**

- `GET /api/products/upload`: Fetch all database products
- `POST /api/products/upload`: Upload new products

### **Data Structure**

```typescript
type CombinedProduct = {
  id: string;
  name: string;
  price: string;
  image: string;
  source: "static" | "database";
  category?: string;
  size?: string;
  color?: string;
  material?: string;
  stock?: number;
  featured?: boolean;
  description?: string;
};
```

### **Error Handling**

- Graceful fallback if database is unavailable
- Loading states with skeleton placeholders
- Error messages for failed API calls

## 🚀 Usage

### **For Users**

- Browse all products on homepage and shop page
- See real-time product updates
- Distinguish between static and new products

### **For Admins**

- Upload products via `/dashboard`
- Products appear immediately on website
- Manage inventory through dashboard

## 🔄 Future Enhancements

1. **Product Filtering**: Filter by source, category, price
2. **Search Functionality**: Search across all products
3. **Product Categories**: Separate sections for different types
4. **Inventory Management**: Real-time stock updates
5. **Product Reviews**: User reviews and ratings

## 📱 Responsive Design

- **Mobile**: 1 column grid
- **Tablet**: 2-3 column grid
- **Desktop**: 4 column grid
- **Loading States**: Skeleton placeholders
- **Error States**: User-friendly error messages

## 🎯 Next Steps

1. **Remove Static Products**: When ready, delete static product data
2. **Add More Categories**: Expand beyond jackets
3. **Implement Search**: Add search functionality
4. **Add Filters**: Category, price, size filters
5. **Product Details**: Individual product pages
