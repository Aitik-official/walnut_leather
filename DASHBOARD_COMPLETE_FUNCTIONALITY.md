================================================================================
COMPLETE DASHBOARD FUNCTIONALITY & LOGIC - HOW IT AFFECTS MAIN WEBSITE
================================================================================

ROUTE: /dashboard
COMPONENT: app/dashboard/page.tsx
LAYOUT: components/dashboard-layout.tsx

================================================================================
1. DASHBOARD OVERVIEW
================================================================================

The Dashboard is the admin control center for managing all website content:
- Product Management (Create, Edit, Delete products)
- Category Management (Main & Sub Categories)
- Order Management (View and track customer orders)
- Analytics (Product statistics and insights)
- Customer Management (Coming soon)

Access: Protected by Admin Authentication
Location: /dashboard
Layout: No navbar/footer, only header with logo and admin profile

================================================================================
2. DASHBOARD STRUCTURE & TABS
================================================================================

2.1 TAB NAVIGATION
-------------------------------------------------------------------------------

Five Main Tabs (Horizontal Tab Bar):
1. Analytics Tab (Default)
   - Icon: BarChart3
   - Shows product statistics and metrics
   
2. Products Tab
   - Icon: Package
   - Product creation, editing, and listing
   
3. Orders Tab
   - Icon: ShoppingCart
   - Order management and tracking
   
4. Categories Tab
   - Icon: FolderTree
   - Main and sub category management
   
5. Customers Tab
   - Icon: Users
   - Customer database (placeholder for now)

2.2 LAYOUT STRUCTURE
-------------------------------------------------------------------------------

- Header: Logo + Firm Name + Admin Profile
- Tab Navigation: Below header
- Tab Content: Changes based on selected tab
- No Top Navigation Bar (removed)
- No Footer (dashboard-specific layout)

================================================================================
3. TAB 1: ANALYTICS
================================================================================

3.1 STATISTICS CARDS
-------------------------------------------------------------------------------

Four Metric Cards:

1. Total Products
   - Icon: Package (blue)
   - Value: products.length
   - Shows: Total count of all products in database

2. Active Products
   - Icon: Package (green)
   - Value: products.filter(p => p.stock > 0).length
   - Shows: Products with stock > 0

3. Featured Products
   - Icon: Package (yellow)
   - Value: products.filter(p => p.featured).length
   - Shows: Products marked as featured

4. Out of Stock
   - Icon: Package (red)
   - Value: products.filter(p => p.stock === 0).length
   - Shows: Products with zero stock

3.2 DATA SOURCE
-------------------------------------------------------------------------------

- Fetches from: GET /api/products/upload
- Updates: Real-time when products are added/edited/deleted
- Recalculation: Automatic on product list changes

================================================================================
4. TAB 2: PRODUCTS MANAGEMENT
================================================================================

4.1 PRODUCT CREATION FORM
-------------------------------------------------------------------------------

Location: Modal dialog (triggered by "Add Product" button)

Required Fields:
- Product Name * (Text input)
- Description * (Textarea)
- Price * (Number input, in USD)
- Main Category * (Dropdown: Shows categories where mainUse === "product")
- Sub Category * (Dropdown: Filtered by selected main category)
- Stock Quantity * (Number input)
- At least one Image * (File upload or URL)

Optional Fields:
- Available Sizes (Checkboxes: XXS, XS, S, M, L, XL, 2XL, 3XL, 4XL + Custom size)
- Color (Text input: e.g., "Brown", "Black", "Tan")
- Material (Text input: e.g., "Genuine Leather", "Suede")
- Product Tags:
  * Featured Product (Checkbox)
    - If checked: Shows additional field "Short Name / Nickname"
    - Nickname: Used on hover effect in Featured Jackets section
  * Exclusive Product (Checkbox)
  * Limited Time Deal (Checkbox)

Media Upload:
- Images: Multiple file uploads OR image URLs (or both)
- Videos: Multiple file uploads OR video URLs (optional)
- File uploads: Stored in Cloudinary
- URLs: Direct links from internet

4.2 PRODUCT CREATION PROCESS
-------------------------------------------------------------------------------

Step 1: Admin clicks "Add Product" button
Step 2: Modal dialog opens with empty form
Step 3: Admin fills in product details
Step 4: Admin selects Main Category (e.g., "Mens")
Step 5: Sub Category dropdown populates with relevant subcategories
Step 6: Admin selects Sub Category (e.g., "Rider")
Step 7: Admin uploads images (files or URLs)
Step 8: Admin optionally sets product tags (featured, exclusive, etc.)
Step 9: If "Featured" is checked, nickname field appears
Step 10: Admin clicks "Upload Product" button
Step 11: Form validation:
   - Required fields checked
   - At least one image required
   - Main category and sub category required
Step 12: Category string built: "Mens/Rider" (hierarchical format)
Step 13: Images uploaded to Cloudinary (if files provided)
Step 14: Videos uploaded to Cloudinary (if files provided)
Step 15: API call: POST /api/products/upload
Step 16: Product saved to MongoDB (products collection)
Step 17: Success toast notification
Step 18: Form resets, modal closes
Step 19: Product list refreshes automatically
Step 20: Analytics stats update automatically

4.3 PRODUCT DATA STRUCTURE
-------------------------------------------------------------------------------

Saved to Database:
{
  _id: MongoDB ObjectId
  name: string
  description: string
  price: number
  category: string (hierarchical: "Mens/Rider")
  mainCategory: string ("Mens")
  subCategory: string ("Rider")
  availableSizes: string[]
  color: string
  material: string
  stock: number
  featured: boolean
  featuredNickname?: string (if featured)
  exclusive: boolean
  limitedTimeDeal: boolean
  images: string[] (Cloudinary URLs or direct URLs)
  videos: string[] (Cloudinary URLs or direct URLs)
  createdAt: Date
  updatedAt: Date
}

4.4 PRODUCT EDITING
-------------------------------------------------------------------------------

Process:
- Click Edit button on product in table
- Modal opens with pre-filled form
- Existing images/videos shown (can remove individually)
- Can add new images/videos
- Can update any field
- Category dropdowns auto-populated based on existing product
- Click "Update Product" button
- API call: PUT /api/products/[id]
- Updates existing product in database
- Product list refreshes

4.5 PRODUCT DELETION
-------------------------------------------------------------------------------

Process:
- Click Delete button (trash icon)
- Confirmation dialog
- If confirmed, API call: DELETE /api/products/[id]
- Product removed from database
- Product list refreshes
- Analytics update automatically

4.6 PRODUCT LIST TABLE
-------------------------------------------------------------------------------

Columns:
- PRODUCT: Thumbnail image + Name + ID (last 8 chars)
- CATEGORY: Badge showing category string
- PRICE: Formatted price ($XX.XX)
- STATUS: Badges for:
  * NEW (green) - if featured
  * OUT OF STOCK (red) - if stock === 0
  * LOW STOCK (red) - if stock > 0 && stock < 5
- ACTIONS: View (opens in new tab), Edit, Delete

4.7 PRODUCT FILTERING & SORTING
-------------------------------------------------------------------------------

- All products displayed in table
- No filtering in dashboard (shows all)
- Sorted by creation date (newest first)

================================================================================
5. TAB 3: ORDERS MANAGEMENT
================================================================================

5.1 ORDER STATISTICS
-------------------------------------------------------------------------------

Four Stat Cards:
1. Total Orders: Total count of all orders
2. Pending Orders: Orders with "pending" status
3. Processing Orders: Orders with "processing" status
4. Delivered Orders: Orders with "delivered" status

5.2 ORDER FILTERING
-------------------------------------------------------------------------------

Filter Options:
- Status Filter: Dropdown with options:
  * All statuses
  * Pending
  * Confirmed
  * Processing
  * Shipped
  * Delivered
  * Cancelled

- Search: Text input to search by order ID, customer name, email

5.3 ORDER TABLE
-------------------------------------------------------------------------------

Columns:
- Order No.: Order ID/Number
- Customer: Customer name and email
- Items: Number of items in order
- Total: Total order amount
- Status: Color-coded badge
- Date: Order creation date
- Actions: View button (opens order details dialog)

5.4 ORDER DETAILS DIALOG
-------------------------------------------------------------------------------

Shows:
- Order Number
- Customer Information (name, email, phone)
- Shipping Address
- Payment Method
- Order Items (product names, quantities, prices)
- Order Totals (subtotal, tax, shipping, total)
- Order Status
- Order Notes
- Order Dates (created, updated)

5.5 ORDER STATUS MANAGEMENT
-------------------------------------------------------------------------------

Status Options:
- pending (Yellow badge)
- confirmed (Green badge)
- processing (Blue badge)
- shipped (Purple badge)
- delivered (Green badge)
- cancelled (Red badge)

Status Updates:
- View order details
- Can be updated manually (if status update functionality added)

5.6 ORDER DATA FETCHING
-------------------------------------------------------------------------------

API: GET /api/orders
- Supports status filter query parameter
- Pagination support (default limit: 50)
- Returns: orders array with full order details

================================================================================
6. TAB 4: CATEGORIES MANAGEMENT
================================================================================

6.1 INTEGRATED COMPONENT
-------------------------------------------------------------------------------

Component: CategoryManagement (components/category-management.tsx)
- Two sub-tabs: Main Categories and Sub Categories
- Full CRUD operations for both
- See CATEGORY_MANAGEMENT_DOCUMENTATION.md for details

6.2 MAIN CATEGORIES
-------------------------------------------------------------------------------

- Create: "Mens" or "Womens" categories
- Edit: Update category image
- Delete: Remove category (with confirmation)
- Used in: Product creation, Collection page navigation

6.3 SUB CATEGORIES
-------------------------------------------------------------------------------

- Create: Jacket types (Rider, Bomber, etc.)
- Link to: Main category (Mens or Womens)
- Edit: Update name, main category, or image
- Delete: Remove subcategory (with confirmation)
- Used in: Product creation, /collection/[category] page display

================================================================================
7. TAB 5: CUSTOMERS
================================================================================

7.1 CURRENT STATUS
-------------------------------------------------------------------------------

- Placeholder tab
- Shows "Customer management features coming soon"
- Future: Customer database management

================================================================================
8. HOW DASHBOARD AFFECTS MAIN WEBSITE CONTENT
================================================================================

8.1 PRODUCT CREATION → WEBSITE DISPLAY
-------------------------------------------------------------------------------

Flow:
1. Admin creates product in Dashboard → Products Tab
2. Product saved to MongoDB (products collection)
3. Images uploaded to Cloudinary
4. Product immediately available via API: GET /api/products/upload

Main Website Pages Affected:

A. HOMEPAGE (/)
   - Component: DynamicProductGrid
   - Section: "Featured Jackets"
   - Shows: Featured products (featured = true) OR all products (limit: 5)
   - Priority: Database products shown first, then static products
   - Display: Large 2+3 grid layout (2 large cards top, 3 smaller bottom)
   - Hover Effect: Shows featured nickname if available, otherwise product name
   - API: GET /api/products/upload
   - Updates: Immediate (on page load/refresh)

B. SHOP PAGE (/shop)
   - Component: ShopProductGrid
   - Shows: All products (database + static)
   - Filtering: By category, size, color, material, price, search
   - Sorting: Price, name, featured, newest
   - Display: Grid layout with product cards
   - Features: Wishlist integration, currency conversion, language translation
   - API: GET /api/products/upload
   - Updates: Immediate (on page load/refresh)

C. COLLECTION PAGES (/collection/[category])
   - Component: ShopProductGrid (after subcategory selection)
   - Shows: Products filtered by mainCategory and subCategory
   - Filtering: Products matching selected main + sub category
   - Display: Same card format as shop page
   - API: GET /api/products/upload (filtered client-side)
   - Updates: Immediate (when subcategory selected)

D. BEST SELLERS SECTION (Homepage)
   - Component: BestSellers
   - Shows: Featured products or limited time deals (first 4)
   - Display: 4-column grid with hover effects
   - API: GET /api/products/upload
   - Filter: p.featured || p.limitedTimeDeal
   - Updates: Immediate

E. PRODUCT DETAIL PAGES (/products/[id])
   - Fetches: Single product by ID
   - API: GET /api/products/[id]
   - Shows: Full product details, images, videos, sizes, etc.
   - Updates: Immediate when product edited

8.2 CATEGORY CREATION → WEBSITE DISPLAY
-------------------------------------------------------------------------------

Flow:
1. Admin creates main category (Mens/Womens) in Dashboard
2. Admin creates sub categories (Rider, Bomber, etc.) linked to main category
3. Categories saved to MongoDB
4. Categories immediately available via API

Main Website Pages Affected:

A. COLLECTION PAGE (/collection)
   - Shows: Main category cards (Mens/Womens side by side)
   - Images: From main category image field
   - Navigation: Links to /collection/mens or /collection/womens
   - Updates: Immediate

B. COLLECTION CATEGORY PAGE (/collection/[category])
   - Shows: Subcategory cards in 3x3 grid
   - Data: GET /api/categories/sub?mainCategory={name}
   - Filters: Subcategories where mainCategory matches
   - Display: Each subcategory card shows:
     * Subcategory image (from database)
     * Subcategory name overlay
     * Animated borders on hover/click
   - Updates: Immediate when subcategories added/edited/deleted

C. PRODUCT CREATION FORMS
   - Main Category dropdown: Populated from database
   - Sub Category dropdown: Filtered by selected main category
   - Dynamic filtering ensures valid category combinations
   - Updates: Immediate (refreshes on form open)

8.3 PRODUCT TAGS → WEBSITE FEATURES
-------------------------------------------------------------------------------

Featured Tag (featured: true):
- Homepage: Appears in "Featured Jackets" section
- Hover Effect: Shows featured nickname on hover (if provided)
- Badge: "NEW" badge on product cards
- Priority: Featured products shown first in listings
- Best Sellers: Included in best sellers section

Exclusive Tag (exclusive: true):
- Display: Can show exclusive badge on product cards
- Filtering: Can be filtered in shop page

Limited Time Deal Tag (limitedTimeDeal: true):
- Price Display: Shows original price (strikethrough) + deal price
- Badge: Can show "Limited Time Deal" badge
- Best Sellers: Included in best sellers section

8.4 PRODUCT STOCK → WEBSITE BEHAVIOR
-------------------------------------------------------------------------------

Stock Management:
- Stock: 0 → Product shows "OUT OF STOCK" badge
- Stock: 1-4 → Product shows "LOW STOCK" badge
- Stock: > 4 → Normal display
- Filtering: Can filter "In Stock Only" on shop page
- Product Detail: Shows stock availability

================================================================================
9. DATA FLOW FROM DASHBOARD TO WEBSITE
================================================================================

9.1 PRODUCT DATA FLOW
-------------------------------------------------------------------------------

Dashboard → Database → API → Frontend Pages

Step 1: Admin creates product in Dashboard
Step 2: Product data + images sent to POST /api/products/upload
Step 3: Images uploaded to Cloudinary
Step 4: Product saved to MongoDB (products collection)
Step 5: Product immediately queryable via GET /api/products/upload

Frontend Pages Fetch:
- Homepage: Fetches on component mount (useEffect)
- Shop Page: Fetches on component mount
- Collection Pages: Fetches on component mount
- Best Sellers: Fetches on component mount

All pages use same API endpoint but filter/display differently.

9.2 CATEGORY DATA FLOW
-------------------------------------------------------------------------------

Dashboard → Database → API → Frontend Pages

Step 1: Admin creates main/sub category in Dashboard
Step 2: Category saved to MongoDB (main_categories or sub_categories)
Step 3: Category immediately queryable via API:
   - GET /api/categories/main
   - GET /api/categories/sub?mainCategory={name}

Frontend Pages Use:
- Product Forms: Fetch categories for dropdowns
- Collection Page: Fetches subcategories for grid display
- Product Filtering: Uses categories for filtering products

9.3 ORDER DATA FLOW
-------------------------------------------------------------------------------

Customer Checkout → Database → Dashboard

Step 1: Customer places order on website
Step 2: Order saved to MongoDB (orders collection)
Step 3: Dashboard fetches: GET /api/orders
Step 4: Orders displayed in Orders tab
Step 5: Admin can view order details and manage status

Note: Orders created by customers, viewed/managed in dashboard.

================================================================================
10. REAL-TIME UPDATES
================================================================================

10.1 PRODUCT UPDATES
-------------------------------------------------------------------------------

When Admin:
- Creates Product → Appears immediately on all pages (after refresh)
- Edits Product → Changes reflect immediately (after refresh)
- Deletes Product → Removed from all pages (after refresh)
- Changes Stock → Badges and availability update (after refresh)
- Toggles Featured → Homepage Featured section updates (after refresh)

10.2 CATEGORY UPDATES
-------------------------------------------------------------------------------

When Admin:
- Creates Main Category → Available in product forms immediately
- Creates Sub Category → Appears in /collection/[category] page grid
- Deletes Category → Removed from dropdowns and collection page
- Updates Category Image → Collection page image updates

10.3 REFRESH REQUIREMENTS
-------------------------------------------------------------------------------

- Dashboard: Auto-refreshes after create/edit/delete operations
- Frontend Pages: Require page refresh to see new data
- No automatic polling (updates on page navigation/reload)

================================================================================
11. PRODUCT PRIORITY & SORTING
================================================================================

11.1 PRODUCT DISPLAY PRIORITY
-------------------------------------------------------------------------------

Homepage Featured Section:
1. Featured database products (featured: true)
2. Static products (if less than limit)

Shop Page:
1. Database products (all)
2. Static products (all)

Sorting Logic:
- Featured products first
- Database products before static products
- Then by creation date (newest first)

11.2 PRODUCT FILTERING LOGIC
-------------------------------------------------------------------------------

By Category:
- Checks mainCategory field (exact match)
- Checks subCategory field (exact match)
- Falls back to category string (hierarchical: "Mens/Rider")

By Stock:
- Filter: showInStock === true
- Only shows products with stock > 0

By Tags:
- Featured filter: featured === true
- Exclusive filter: exclusive === true
- Limited Deal filter: limitedTimeDeal === true

================================================================================
12. MEDIA MANAGEMENT
================================================================================

12.1 IMAGE HANDLING
-------------------------------------------------------------------------------

Upload Methods:
1. File Upload: Images uploaded to Cloudinary
   - Folder: walnut_leathers/images
   - Transformation: 800x800, auto quality, auto format
   - Returns: secure_url

2. URL Input: Direct image URLs from internet
   - Stored as-is in database
   - No processing/upload

Storage:
- Database: Array of image URLs (strings)
- Cloudinary: Permanent storage for uploaded files
- Multiple images supported per product

12.2 VIDEO HANDLING
-------------------------------------------------------------------------------

Upload Methods:
1. File Upload: Videos uploaded to Cloudinary
   - Folder: walnut_leathers/videos
   - Transformation: 800x600, auto quality
   - Returns: secure_url

2. URL Input: Direct video URLs from internet
   - Stored as-is in database

12.3 MEDIA DISPLAY
-------------------------------------------------------------------------------

Product Cards:
- First image: Primary display image
- Hover effect: Second image fades in (if available)
- Fallback: Placeholder image if no images

Product Detail Pages:
- Image gallery: All images displayed
- Video player: All videos displayed
- Image zoom: Interactive image viewing

================================================================================
13. CATEGORY HIERARCHY & PRODUCT RELATIONSHIP
================================================================================

13.1 HIERARCHICAL STRUCTURE
-------------------------------------------------------------------------------

Main Category (Level 1):
- Examples: "Mens", "Womens"
- Stored in: main_categories collection
- Used for: Product organization, collection navigation

Sub Category (Level 2):
- Examples: "Rider", "Bomber", "Biker"
- Stored in: sub_categories collection
- Linked to: Main category via mainCategory field
- Used for: Product filtering, collection grid display

Product Categories:
- Hierarchical String: "Mens/Rider" (stored in category field)
- Main Category: "Mens" (stored in mainCategory field)
- Sub Category: "Rider" (stored in subCategory field)
- Allows: Flexible filtering by any level

13.2 PRODUCT-CATEGORY RELATIONSHIP
-------------------------------------------------------------------------------

When Creating Product:
1. Select Main Category → Filters available subcategories
2. Select Sub Category → Must match selected main category
3. Category string built: "MainCategory/SubCategory"
4. All three fields saved: category, mainCategory, subCategory

When Filtering Products:
- Can filter by mainCategory only
- Can filter by subCategory only
- Can filter by both (mainCategory + subCategory)
- Falls back to hierarchical category string parsing

================================================================================
14. FEATURED PRODUCT NICKNAME FEATURE
================================================================================

14.1 FEATURED NICKNAME FUNCTIONALITY
-------------------------------------------------------------------------------

Purpose: Display short name on hover in Featured Jackets section

Setup:
1. Admin marks product as "Featured" (checkbox)
2. "Short Name / Nickname" field appears
3. Admin enters nickname (e.g., "Rider", "Bomber")
4. Nickname saved to database: featuredNickname field

Display:
- Homepage Featured Jackets: Hover shows nickname instead of full name
- Fallback: If no nickname, shows full product name
- Format: Uppercase, large text overlay

14.2 DATA STRUCTURE
-------------------------------------------------------------------------------

Product Document:
{
  featured: true,
  featuredNickname: "Rider", // Optional, only if featured
  ...
}

Display Logic:
- If featured && featuredNickname exists → Show nickname
- Else → Show full product name

================================================================================
15. DASHBOARD AUTHENTICATION
================================================================================

15.1 AUTHENTICATION FLOW
-------------------------------------------------------------------------------

Access Control:
- Route: Protected route (requires admin authentication)
- Check: GET /api/auth/admin-me on page load
- If not authenticated: Shows AdminAuthModal
- If authenticated: Shows dashboard content

15.2 AUTHENTICATION STATE
-------------------------------------------------------------------------------

State Management:
- isAuthenticated: boolean state
- checkAdminAuth(): Validates admin session
- On mount: Checks authentication before loading data
- On logout: Clears session, shows auth modal

================================================================================
16. COMPLETE DATA FLOW DIAGRAM
================================================================================

ADMIN ACTIONS IN DASHBOARD:
│
├─ Create Product
│  └─→ POST /api/products/upload
│     ├─→ Upload images to Cloudinary
│     ├─→ Save to MongoDB (products)
│     └─→ Returns success
│        └─→ Dashboard refreshes product list
│           └─→ WEBSITE PAGES (on refresh):
│              ├─→ Homepage fetches via GET /api/products/upload
│              ├─→ Shop page fetches via GET /api/products/upload
│              ├─→ Collection pages filter from fetched products
│              └─→ Best Sellers filters featured products
│
├─ Create Main Category
│  └─→ POST /api/categories/main
│     └─→ Save to MongoDB (main_categories)
│        └─→ Available immediately for:
│           ├─→ Product form dropdowns
│           └─→ Collection page navigation
│
├─ Create Sub Category
│  └─→ POST /api/categories/sub
│     └─→ Save to MongoDB (sub_categories)
│        └─→ Available immediately for:
│           ├─→ Product form dropdowns (filtered)
│           └─→ /collection/[category] page grid
│
└─ View Orders
   └─→ GET /api/orders
      └─→ Display in Orders tab
         └─→ View order details
            └─→ Update order status (if implemented)

================================================================================
17. WEBSITE PAGES DATA DEPENDENCIES
================================================================================

17.1 HOMEPAGE (/)
-------------------------------------------------------------------------------

Components Using Dashboard Data:
- DynamicProductGrid (Featured Jackets section)
  * API: GET /api/products/upload
  * Filters: featured products OR limit 5
  * Uses: featuredNickname on hover
  
- BestSellers
  * API: GET /api/products/upload
  * Filters: featured || limitedTimeDeal, first 4
  * Shows: Product cards with hover effects

Data Impact:
- New featured products → Appear in Featured Jackets
- Featured nickname changes → Update hover text
- Product deletions → Removed from display
- Stock changes → Badges update (if stock display added)

17.2 SHOP PAGE (/shop)
-------------------------------------------------------------------------------

Components Using Dashboard Data:
- ShopProductGrid
  * API: GET /api/products/upload
  * Shows: All database products + static products
  * Filtering: By category, size, color, material, price, search
  * Uses: Currency conversion, language translation

Data Impact:
- New products → Appear in shop grid
- Product edits → Updated information shown
- Product deletions → Removed from grid
- Category changes → Filter options update
- Stock changes → Filter by availability

17.3 COLLECTION PAGES (/collection/[category])
-------------------------------------------------------------------------------

Components Using Dashboard Data:
- Subcategory Grid (initial view)
  * API: GET /api/categories/sub?mainCategory={name}
  * Shows: All subcategories for main category
  * Display: 3-column grid with cards
  
- ShopProductGrid (after selection)
  * API: GET /api/products/upload
  * Filters: By mainCategory and subCategory
  * Shows: Products matching selected subcategory

Data Impact:
- New subcategory → Appears in grid
- Subcategory image update → Card image updates
- Products with matching categories → Appear when subcategory selected

17.4 PRODUCT DETAIL PAGE (/products/[id])
-------------------------------------------------------------------------------

API: GET /api/products/[id]

Shows:
- Full product information
- All product images (gallery)
- All product videos
- Available sizes
- Stock availability
- Category information
- Wishlist functionality

Data Impact:
- Product edits → All details update
- Image additions → Gallery updates
- Stock changes → Availability display updates

================================================================================
18. STATE MANAGEMENT & DATA SYNC
================================================================================

18.1 DASHBOARD STATE
-------------------------------------------------------------------------------

State Variables:
- products: DatabaseProduct[] - All products
- mainCategories: MainCategory[] - All main categories
- subCategories: SubCategory[] - All sub categories
- orders: Order[] - All orders
- formData: ProductFormData - Current form state
- loading: boolean - Loading states

State Updates:
- fetchProducts() - Refreshes product list
- fetchCategories() - Refreshes category lists
- fetchOrders() - Refreshes order list
- Auto-refresh after create/edit/delete operations

18.2 FRONTEND PAGE STATE
-------------------------------------------------------------------------------

Each Page Maintains Own State:
- databaseProducts: Fetched from API on mount
- Static products: Hardcoded in components
- Combined: Merged for display

Data Freshness:
- Fetches on component mount (useEffect)
- No automatic polling
- Updates on page navigation/reload

================================================================================
19. KEY VALIDATIONS & BUSINESS RULES
================================================================================

19.1 PRODUCT VALIDATIONS
-------------------------------------------------------------------------------

Required Fields:
- Name (non-empty)
- Description (non-empty)
- Price (positive number)
- Main Category (must exist in database)
- Sub Category (must exist and match main category)
- At least one image (file or URL)

Business Rules:
- Sub category must belong to selected main category
- Price must be positive number
- Stock must be non-negative integer
- Featured nickname only available if featured checked
- Images uploaded to Cloudinary (permanent storage)

19.2 CATEGORY VALIDATIONS
-------------------------------------------------------------------------------

Main Category:
- Name must be "Mens" or "Womens"
- No duplicates allowed
- Image URL optional

Sub Category:
- Name required
- Main category required (must exist)
- No duplicate subcategories for same main category
- Image URL optional

19.3 ORDER VALIDATIONS
-------------------------------------------------------------------------------

- Orders created by customers during checkout
- Dashboard only views/manages orders
- Status updates (if implemented) require validation

================================================================================
20. ERROR HANDLING
================================================================================

20.1 DASHBOARD ERRORS
-------------------------------------------------------------------------------

Product Operations:
- Creation failure: Error toast, form stays open
- Update failure: Error toast, form stays open
- Delete failure: Error toast, product remains in list
- Network errors: Graceful error messages

Category Operations:
- Creation failure: Error toast
- Validation errors: Field-specific error messages
- Network errors: Retry option

20.2 FRONTEND ERRORS
-------------------------------------------------------------------------------

Data Fetching:
- API failures: Error messages in components
- Empty states: Helpful messages for no data
- Loading states: Skeleton loaders while fetching

================================================================================
21. COMPLETE FUNCTIONALITY SUMMARY
================================================================================

✓ PRODUCT MANAGEMENT
  - Create products with full details
  - Edit existing products
  - Delete products
  - Upload multiple images/videos
  - Set product tags (featured, exclusive, limited deal)
  - Featured nickname for hover effects
  - Stock management
  - Category assignment (hierarchical)

✓ CATEGORY MANAGEMENT
  - Create main categories (Mens/Womens)
  - Create sub categories (jacket types)
  - Link subcategories to main categories
  - Upload category images
  - Edit/delete categories
  - Real-time updates

✓ ORDER MANAGEMENT
  - View all customer orders
  - Filter by status
  - Search orders
  - View order details
  - Order statistics

✓ ANALYTICS
  - Total products count
  - Active products count
  - Featured products count
  - Out of stock count
  - Real-time statistics

✓ AUTHENTICATION
  - Admin-only access
  - Session management
  - Protected routes

================================================================================
22. WEBSITE CONTENT IMPACT SUMMARY
================================================================================

WHEN ADMIN CREATES PRODUCT:
→ Appears on Homepage (if featured)
→ Appears on Shop page
→ Appears on Collection page (if category matches)
→ Appears in Best Sellers (if featured/deal)
→ Accessible via Product Detail page

WHEN ADMIN CREATES CATEGORY:
→ Main category available in product forms
→ Sub category appears in /collection/[category] grid
→ Sub category available in product forms (filtered)
→ Category image displays on collection pages

WHEN ADMIN EDITS PRODUCT:
→ All website pages show updated information
→ Images/videos update on product detail page
→ Stock badges update
→ Featured status affects homepage display

WHEN ADMIN DELETES PRODUCT:
→ Removed from all website pages
→ No longer accessible via product detail page
→ Analytics statistics update

================================================================================
23. API ENDPOINTS USED
================================================================================

Products:
- GET /api/products/upload - Fetch all products (used by all pages)
- POST /api/products/upload - Create product
- GET /api/products/[id] - Get single product
- PUT /api/products/[id] - Update product
- DELETE /api/products/[id] - Delete product

Categories:
- GET /api/categories/main - Fetch main categories
- POST /api/categories/main - Create main category
- PUT /api/categories/main/[id] - Update main category
- DELETE /api/categories/main/[id] - Delete main category
- GET /api/categories/sub - Fetch sub categories (filtered)
- POST /api/categories/sub - Create sub category
- PUT /api/categories/sub/[id] - Update sub category
- DELETE /api/categories/sub/[id] - Delete sub category

Orders:
- GET /api/orders - Fetch all orders (with filters)

Authentication:
- GET /api/auth/admin-me - Check admin authentication

================================================================================
24. DATABASE COLLECTIONS
================================================================================

Collections Used:
- products: All product data
- main_categories: Main category data (Mens/Womens)
- sub_categories: Sub category data (Rider, Bomber, etc.)
- orders: Customer order data
- users: User/customer data (for authentication)

================================================================================
25. COMPLETE WORKFLOW EXAMPLE
================================================================================

EXAMPLE: Admin adds new featured jacket

Step 1: Admin logs into Dashboard
Step 2: Navigates to Products tab
Step 3: Clicks "Add Product" button
Step 4: Fills form:
   - Name: "Classic Brown Rider Jacket"
   - Description: "Premium leather..."
   - Price: 480
   - Main Category: "Mens"
   - Sub Category: "Rider" (auto-filtered)
   - Sizes: M, L, XL
   - Color: "Brown"
   - Material: "Genuine Leather"
   - Stock: 10
   - Featured: ✓ (checked)
   - Featured Nickname: "Rider" (appears when featured checked)
   - Images: Uploads 3 images
Step 5: Clicks "Upload Product"
Step 6: Images upload to Cloudinary
Step 7: Product saved to MongoDB
Step 8: Success notification shown
Step 9: Product appears in dashboard product list
Step 10: Analytics stats update

WEBSITE IMPACT:
- Homepage: Product appears in Featured Jackets section
- Hover Effect: Shows "RIDER" instead of full name
- Shop Page: Product appears in product grid
- Collection: Product appears when "Mens" → "Rider" selected
- Best Sellers: Product appears (if in top 4 featured)
- Product Detail: Full product page accessible at /products/[id]

================================================================================
END OF DOCUMENTATION
================================================================================

