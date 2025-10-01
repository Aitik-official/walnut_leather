# Admin Dashboard Setup Guide

## 🚀 Dashboard Features

- **Product Upload**: Upload products with images and videos
- **Product Management**: View, edit, and delete products
- **MongoDB Integration**: Store product data in MongoDB
- **Cloudinary Integration**: Store images and videos in Cloudinary
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Built with Tailwind CSS and shadcn/ui

## 📋 Prerequisites

1. **MongoDB Database**: You'll need a MongoDB database
2. **Cloudinary Account**: You'll need a Cloudinary account for media storage
3. **Node.js**: Version 18 or higher

## 🔧 Installation

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file in your project root with the following variables:

   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB=leather_website

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## 🗄️ MongoDB Setup

1. **Create Database**: Create a database named `leather_website` (or update `MONGODB_DB` in env)
2. **Collections**: The following collections will be created automatically:
   - `products`: Stores product information
   - `users`: For future user management
   - `orders`: For future order management
   - `categories`: For product categories

## ☁️ Cloudinary Setup

1. **Create Account**: Sign up at [cloudinary.com](https://cloudinary.com)
2. **Get Credentials**: Find your cloud name, API key, and API secret in the dashboard
3. **Update Environment**: Add your credentials to `.env.local`

## 🎯 Usage

### Access Dashboard

- Navigate to `/dashboard` in your browser
- Upload new products with the form
- Manage existing products at `/dashboard/products`

### Product Upload

1. Fill in product details (name, description, price, category)
2. Upload product images (required)
3. Upload product videos (optional)
4. Set stock quantity and featured status
5. Click "Upload Product"

### Product Management

- View all products with search and filtering
- Edit product details
- Delete products
- Mark products as featured

## 📁 File Structure

```
app/
├── dashboard/
│   ├── page.tsx              # Main dashboard page
│   ├── products/
│   │   └── page.tsx          # Product management page
│   └── layout.tsx            # Dashboard layout
├── api/
│   └── products/
│       ├── upload/
│       │   └── route.ts      # Product upload API
│       ├── [id]/
│       │   └── route.ts      # Product CRUD API
│       └── route.ts          # Products listing API
components/
├── dashboard-layout.tsx      # Dashboard layout component
├── dashboard-nav.tsx         # Dashboard navigation
lib/
├── mongodb.ts               # MongoDB connection utility
├── cloudinary.ts            # Cloudinary utilities
└── types.ts                 # TypeScript types
```

## 🔒 Security Notes

- The dashboard is currently open to all users
- Consider adding authentication for production use
- Validate file uploads and sanitize inputs
- Use environment variables for sensitive data

## 🚀 Deployment

1. **Vercel**: Deploy to Vercel with environment variables
2. **MongoDB Atlas**: Use MongoDB Atlas for production database
3. **Cloudinary**: Your Cloudinary account will work in production

## 📝 API Endpoints

- `POST /api/products/upload` - Upload new product
- `GET /api/products/upload` - Get all products (admin)
- `GET /api/products` - Get products (public)
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

## 🎨 Customization

- Update colors in `tailwind.config.js`
- Modify product categories in the form
- Add new fields to the product schema
- Customize the dashboard layout

## 🐛 Troubleshooting

1. **MongoDB Connection Issues**: Check your connection string
2. **Cloudinary Upload Fails**: Verify your API credentials
3. **File Upload Errors**: Check file size limits and formats
4. **Build Errors**: Ensure all dependencies are installed

## 📞 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB and Cloudinary are accessible
4. Check file permissions and network connectivity
