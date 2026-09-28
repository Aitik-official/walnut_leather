================================================================================
COMPLETE CATEGORY MANAGEMENT FUNCTIONALITY - MAIN & SUB CATEGORIES
================================================================================

ROUTE: /dashboard (Categories Tab)
COMPONENT: components/category-management.tsx
DISPLAY PAGE: /collection/[category] (Dynamic subcategory display)

================================================================================
1. OVERVIEW
================================================================================

The system implements a hierarchical category structure:
- Main Categories: "Mens" or "Womens" (Top level)
- Sub Categories: Jacket types like "Rider", "Bomber", "Biker" (Second level)

Main categories and sub categories are managed in the Dashboard, and dynamically
displayed on the /collection/[category] page in a 3-column grid layout.

================================================================================
2. MAIN CATEGORY CREATION & MANAGEMENT
================================================================================

LOCATION: Dashboard → Categories Tab → Main Categories Tab

2.1 MAIN CATEGORY FORM
-------------------------------------------------------------------------------

Fields:
- Category Name (Required): Dropdown selection
  * Options: "Mens" or "Womens"
  * Validation: Must be exactly "Mens" or "Womens" (case-normalized)
  * Disabled: When editing (prevents name changes)
  
- Category Image URL (Optional): Text input
  * Format: Full URL (e.g., "https://example.com/image.jpg")
  * Purpose: Image displayed on /collection page for main category cards
  * Usage: Used in hero section of /collection page

2.2 MAIN CATEGORY CREATION PROCESS
-------------------------------------------------------------------------------

Step 1: Admin clicks "Add Main Category" button
Step 2: Dialog opens with form
Step 3: Admin selects "Mens" or "Womens" from dropdown
Step 4: Admin optionally enters image URL
Step 5: Admin clicks "Create" button
Step 6: Form validation:
   - Category name is required
   - Name must be "Mens" or "Womens"
   - Checks if category already exists
Step 7: API call: POST /api/categories/main
Step 8: Database insertion:
   - Collection: main_categories
   - Document structure:
     {
       name: "Mens" or "Womens" (normalized),
       image: image URL string,
       createdAt: Date,
       updatedAt: Date
     }
Step 9: Success feedback via toast notification
Step 10: Form resets, dialog closes
Step 11: Category list refreshes automatically

2.3 MAIN CATEGORY VALIDATION RULES
-------------------------------------------------------------------------------

- Name must be "Mens" or "Womens" (case-insensitive input, normalized to title case)
- Duplicate names are not allowed
- Image URL is optional (can be empty string)

2.4 MAIN CATEGORY EDITING
-------------------------------------------------------------------------------

Process:
- Click Edit button on existing category in table
- Dialog opens with pre-filled form (name disabled, image editable)
- Update image URL
- Click "Update" button
- API call: PUT /api/categories/main/[id]
- Category list refreshes

2.5 MAIN CATEGORY DELETION
-------------------------------------------------------------------------------

Process:
- Click Delete button (trash icon)
- Confirmation dialog appears
- Warning message: "All sub-categories will also be affected"
- If confirmed, API call: DELETE /api/categories/main/[id]
- Category removed from database
- Category list refreshes

2.6 MAIN CATEGORY DATA STRUCTURE
-------------------------------------------------------------------------------

Interface:
{
  _id: string (MongoDB ObjectId)
  name: string ("Mens" or "Womens")
  image: string (URL or empty string)
  createdAt: Date/string
  updatedAt: Date/string
}

================================================================================
3. SUB CATEGORY CREATION & MANAGEMENT
================================================================================

LOCATION: Dashboard → Categories Tab → Sub Categories Tab

3.1 SUB CATEGORY FORM
-------------------------------------------------------------------------------

Fields:
- Main Category (Required): Dropdown selection
  * Options: All existing main categories (Mens, Womens)
  * Populated dynamically from main categories list
  * Must select before creating sub category
  
- Sub Category Name (Required): Text input
  * Format: Free text (e.g., "Rider", "Bomber", "Biker")
  * Placeholder: "e.g., Rider, Bomber, Biker"
  * Validation: Required field
  * Purpose: Name of jacket type
  
- Category Image URL (Optional): Text input
  * Format: Full URL (e.g., "https://example.com/image.jpg")
  * Purpose: Image displayed on subcategory card in /collection/[category] page
  * Usage: Used in 3x3 grid layout for subcategory cards

3.2 SUB CATEGORY CREATION PROCESS
-------------------------------------------------------------------------------

Step 1: Admin clicks "Add Sub Category" button
Step 2: Dialog opens with form
Step 3: Admin selects Main Category (Mens or Womens) from dropdown
Step 4: Admin enters sub category name (e.g., "Rider")
Step 5: Admin optionally enters image URL
Step 6: Admin clicks "Create" button
Step 7: Form validation:
   - Main category is required
   - Sub category name is required
   - Validates main category exists in database
   - Checks if sub category already exists for that main category
Step 8: API call: POST /api/categories/sub
Step 9: Database insertion:
   - Collection: sub_categories
   - Document structure:
     {
       name: "Rider" (sub category name),
       mainCategory: "Mens" or "Womens" (parent category name),
       image: image URL string,
       createdAt: Date,
       updatedAt: Date
     }
Step 10: Success feedback via toast notification
Step 11: Form resets, dialog closes
Step 12: Sub category list refreshes automatically

3.3 SUB CATEGORY VALIDATION RULES
-------------------------------------------------------------------------------

- Main category is required (must select from dropdown)
- Sub category name is required (cannot be empty)
- Main category must exist in database
- Duplicate sub categories for same main category are not allowed
  (e.g., cannot have two "Rider" subcategories under "Mens")
- Image URL is optional (can be empty string)

3.4 SUB CATEGORY EDITING
-------------------------------------------------------------------------------

Process:
- Click Edit button on existing sub category in table
- Dialog opens with pre-filled form (all fields editable)
- Can change:
  * Main Category (can reassign to different main category)
  * Sub Category Name
  * Image URL
- Click "Update" button
- API call: PUT /api/categories/sub/[id]
- Sub category list refreshes

3.5 SUB CATEGORY DELETION
-------------------------------------------------------------------------------

Process:
- Click Delete button (trash icon)
- Confirmation dialog appears
- Warning message: "Are you sure you want to delete this sub category?"
- If confirmed, API call: DELETE /api/categories/sub/[id]
- Sub category removed from database
- Sub category list refreshes

3.6 SUB CATEGORY DATA STRUCTURE
-------------------------------------------------------------------------------

Interface:
{
  _id: string (MongoDB ObjectId)
  name: string (Sub category name, e.g., "Rider")
  mainCategory: string (Parent main category name, e.g., "Mens")
  image: string (URL or empty string)
  createdAt: Date/string
  updatedAt: Date/string
}

================================================================================
4. API ENDPOINTS
================================================================================

4.1 MAIN CATEGORIES API
-------------------------------------------------------------------------------

GET /api/categories/main
- Purpose: Fetch all main categories
- Response: 
  {
    success: boolean,
    categories: MainCategory[]
  }
- Sorting: Alphabetical by name

POST /api/categories/main
- Purpose: Create new main category
- Request Body:
  {
    name: string ("Mens" or "Womens"),
    image: string (optional URL)
  }
- Validation:
  * Name required
  * Name must be "Mens" or "Womens"
  * No duplicate names
- Response:
  {
    success: boolean,
    category: MainCategory object,
    error?: string
  }

PUT /api/categories/main/[id]
- Purpose: Update existing main category
- Request Body:
  {
    name: string ("Mens" or "Womens"),
    image: string (optional URL)
  }
- Response:
  {
    success: boolean,
    error?: string
  }

DELETE /api/categories/main/[id]
- Purpose: Delete main category
- Response:
  {
    success: boolean,
    error?: string
  }

4.2 SUB CATEGORIES API
-------------------------------------------------------------------------------

GET /api/categories/sub
- Purpose: Fetch all sub categories (optionally filtered)
- Query Parameters:
  * mainCategory (optional): Filter by main category name
    Example: /api/categories/sub?mainCategory=Mens
- Response:
  {
    success: boolean,
    subCategories: SubCategory[]
  }
- Sorting: Alphabetical by name

POST /api/categories/sub
- Purpose: Create new sub category
- Request Body:
  {
    name: string (Sub category name),
    mainCategory: string (Parent main category name),
    image: string (optional URL)
  }
- Validation:
  * Name and mainCategory required
  * Main category must exist
  * No duplicate sub categories for same main category
- Response:
  {
    success: boolean,
    subCategory: SubCategory object,
    error?: string
  }

PUT /api/categories/sub/[id]
- Purpose: Update existing sub category
- Request Body:
  {
    name: string,
    mainCategory: string,
    image: string (optional)
  }
- Response:
  {
    success: boolean,
    error?: string
  }

DELETE /api/categories/sub/[id]
- Purpose: Delete sub category
- Response:
  {
    success: boolean,
    error?: string
  }

================================================================================
5. DYNAMIC DISPLAY ON /COLLECTION PAGE
================================================================================

ROUTE: /collection/[category]
COMPONENT: app/collection/[category]/page.tsx

5.1 PAGE STRUCTURE
-------------------------------------------------------------------------------

Two Main Views:
1. Subcategory Grid View (Initial state)
   - Shows 3x3 grid of subcategory cards
   - Each card shows subcategory image and name
   
2. Products View (After subcategory selection)
   - Shows products filtered by selected subcategory
   - Uses ShopProductGrid component
   - Back button to return to subcategories

5.2 ROUTE PARAMETER MAPPING
-------------------------------------------------------------------------------

URL Structure: /collection/[category]
Examples: /collection/mens, /collection/womens

Category Parameter Mapping:
- "mens" → Main Category Name: "Mens"
- "womens" → Main Category Name: "Womens"
- Other values → Used as-is

Code:
const mainCategoryName = category === 'mens' ? 'Mens' : category === 'womens' ? 'Womens' : category

5.3 SUBCATEGORY FETCHING PROCESS
-------------------------------------------------------------------------------

Step 1: Component mounts with category parameter
Step 2: Extract main category name from URL parameter
Step 3: API call: GET /api/categories/sub?mainCategory={mainCategoryName}
   Example: GET /api/categories/sub?mainCategory=Mens
Step 4: Server filters sub categories by mainCategory field
Step 5: Response contains only subcategories for that main category
Step 6: State updates with fetched subcategories
Step 7: Grid renders with subcategory cards

5.4 SUBCATEGORY GRID DISPLAY
-------------------------------------------------------------------------------

Grid Layout:
- Container: grid grid-cols-1 lg:grid-cols-3
- Columns: 3 columns on desktop (lg+), 1 column on mobile
- Gap: gap-8 md:gap-10 lg:gap-12 xl:gap-16 (Responsive spacing)
- Aspect Ratio: aspect-[4/3.5] (Consistent card proportions)

Card Structure:
- Image: Full coverage with object-cover
- Text Overlay: Bottom-centered, white text
- Hover Effects: Image zoom, border animations
- Click Action: Selects subcategory, shows products

5.5 SUBCATEGORY CARD FEATURES
-------------------------------------------------------------------------------

Visual Elements:
- Background Image: subcategory.image (from database)
- Category Name: Large white text overlay at bottom
- Border Animation: Animated borders on hover/click
- Hover Effects: Scale transform on image

Interactive States:
- Hover State: Border expands, image zooms
- Active State: Top border completes, triggers product view
- Loading State: Skeleton loaders while fetching

5.6 PRODUCT FILTERING
-------------------------------------------------------------------------------

When Subcategory Selected:
- Filter Options Created:
  {
    category: "all",
    size: "all",
    color: "all",
    material: "all",
    priceRange: [0, 1000],
    searchTerm: "",
    sortBy: "featured",
    showInStock: false,
    subCategory: selectedSubCategory, // e.g., "Rider"
    mainCategory: mainCategoryName     // e.g., "Mens"
  }

- Products Filtered By:
  * mainCategory matches the main category
  * subCategory matches the selected subcategory
  * Uses ShopProductGrid component (same as /shop page)

5.7 DATA FLOW
-------------------------------------------------------------------------------

1. User navigates to /collection/mens
2. Page extracts "Mens" as main category
3. Fetches: GET /api/categories/sub?mainCategory=Mens
4. Receives subcategories array:
   [
     { _id: "...", name: "Rider", mainCategory: "Mens", image: "..." },
     { _id: "...", name: "Bomber", mainCategory: "Mens", image: "..." },
     ...
   ]
5. Renders 3-column grid with subcategory cards
6. User clicks on "Rider" card
7. State updates: selectedSubCategory = "Rider"
8. Shows products filtered by:
   - mainCategory: "Mens"
   - subCategory: "Rider"
9. User can click "Back to Categories" to return to grid view

================================================================================
6. COMPLETE WORKFLOW - FROM CREATION TO DISPLAY
================================================================================

6.1 ADMIN CREATES MAIN CATEGORY
-------------------------------------------------------------------------------

1. Admin logs into Dashboard
2. Navigates to Categories tab
3. Clicks "Main Categories" tab
4. Clicks "Add Main Category" button
5. Selects "Mens" from dropdown
6. Enters image URL (optional): "https://example.com/mens.jpg"
7. Clicks "Create"
8. Category saved to MongoDB (main_categories collection)
9. Appears in main categories list table

6.2 ADMIN CREATES SUB CATEGORY
-------------------------------------------------------------------------------

1. Admin stays in Categories tab
2. Clicks "Sub Categories" tab
3. Clicks "Add Sub Category" button
4. Selects "Mens" from main category dropdown
5. Enters sub category name: "Rider"
6. Enters image URL (optional): "https://example.com/rider-jacket.jpg"
7. Clicks "Create"
8. Sub category saved to MongoDB (sub_categories collection)
9. Appears in sub categories list table
10. Linked to "Mens" main category via mainCategory field

6.3 USER VIEWS ON /COLLECTION PAGE
-------------------------------------------------------------------------------

1. User navigates to /collection page
2. Sees two main category cards (Mens and Womens) side by side
3. User clicks on "Mens" card
4. Redirects to /collection/mens
5. Page fetches subcategories: GET /api/categories/sub?mainCategory=Mens
6. Receives all subcategories where mainCategory = "Mens"
7. Renders 3-column grid:
   - "Rider" card (with image)
   - "Bomber" card (with image)
   - "Biker" card (with image)
   - ... (all subcategories for Mens)
8. Each card displays:
   - Subcategory image from database
   - Subcategory name as overlay text
   - Hover effects and animations
9. User clicks on "Rider" card
10. Page shows products filtered by:
    - mainCategory: "Mens"
    - subCategory: "Rider"
11. Products displayed in same format as /shop page
12. User can click "Back to Categories" to return to subcategory grid

================================================================================
7. STATE MANAGEMENT
================================================================================

7.1 DASHBOARD CATEGORY MANAGEMENT STATE
-------------------------------------------------------------------------------

State Variables:
- mainCategories: MainCategory[] - All main categories
- subCategories: SubCategory[] - All sub categories
- loading: boolean - Loading state
- showMainCategoryDialog: boolean - Main category form visibility
- showSubCategoryDialog: boolean - Sub category form visibility
- editingMainCategory: MainCategory | null - Currently editing main category
- editingSubCategory: SubCategory | null - Currently editing sub category
- mainCategoryForm: { name: string, image: string } - Main category form data
- subCategoryForm: { name: string, mainCategory: string, image: string } - Sub category form data

State Updates:
- fetchCategories() - Loads all categories on mount
- handleMainCategorySubmit() - Creates/updates main category
- handleSubCategorySubmit() - Creates/updates sub category
- handleDeleteMainCategory() - Removes main category
- handleDeleteSubCategory() - Removes sub category
- After successful operations, fetchCategories() is called to refresh lists

7.2 /COLLECTION/[CATEGORY] PAGE STATE
-------------------------------------------------------------------------------

State Variables:
- subcategories: SubCategory[] - Fetched subcategories for current main category
- loading: boolean - Loading state while fetching
- selectedSubCategory: string | null - Currently selected subcategory name
- activeCard: string | null - Card with active animation
- hoveredCard: string | null - Card being hovered

State Updates:
- fetchSubCategories() - Fetches on mount and when category param changes
- handleCardClick() - Sets selectedSubCategory after animation
- handleBackToCategories() - Resets to grid view

================================================================================
8. DATABASE COLLECTIONS
================================================================================

8.1 MAIN_CATEGORIES COLLECTION
-------------------------------------------------------------------------------

Collection Name: main_categories
Schema:
{
  _id: ObjectId,
  name: String (required, "Mens" or "Womens"),
  image: String (optional, URL),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- name: Unique index (prevents duplicates)

8.2 SUB_CATEGORIES COLLECTION
-------------------------------------------------------------------------------

Collection Name: sub_categories
Schema:
{
  _id: ObjectId,
  name: String (required, e.g., "Rider"),
  mainCategory: String (required, "Mens" or "Womens"),
  image: String (optional, URL),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- Compound index on (name, mainCategory) - Prevents duplicates per main category

================================================================================
9. INTEGRATION WITH PRODUCT CREATION
================================================================================

9.1 PRODUCT FORM CATEGORY SELECTION
-------------------------------------------------------------------------------

When creating/editing products:
1. Main Category dropdown shows all main categories (filtered for products)
2. Sub Category dropdown shows only subcategories for selected main category
3. Dynamic filtering ensures valid category combinations
4. Categories stored in product document:
   - category: "Mens/Rider" (hierarchical string)
   - mainCategory: "Mens" (separate field)
   - subCategory: "Rider" (separate field)

9.2 CATEGORY FILTERING IN PRODUCTS
-------------------------------------------------------------------------------

Products are filtered using:
- mainCategory field: Exact match
- subCategory field: Exact match
- category field: Hierarchical string match (backward compatibility)

================================================================================
10. RESPONSIVE BEHAVIOR
================================================================================

10.1 SUBCATEGORY GRID
-------------------------------------------------------------------------------

- Mobile: 1 column (grid-cols-1)
- Desktop (lg+): 3 columns (lg:grid-cols-3)
- Gaps: Responsive spacing (8 → 10 → 12 → 16 units)
- Cards maintain 4:3.5 aspect ratio on all screens

10.2 CARDS
-------------------------------------------------------------------------------

- Text size: text-4xl → sm:text-5xl → md:text-6xl (responsive)
- Padding: pb-8 → sm:pb-10 (responsive)
- Image: Full coverage with object-cover
- Animations: Same on all screen sizes

================================================================================
11. ERROR HANDLING
================================================================================

11.1 VALIDATION ERRORS
-------------------------------------------------------------------------------

Main Category:
- Missing name: "Category name is required"
- Invalid name: "Main category must be either 'Mens' or 'Womens'"
- Duplicate: "Category already exists"

Sub Category:
- Missing main category: "Please select a main category"
- Missing name: "Sub category name is required"
- Invalid main category: "Main category does not exist"
- Duplicate: "Sub category already exists for this main category"

11.2 NETWORK ERRORS
-------------------------------------------------------------------------------

- API fetch failures show error toast
- Loading states prevent duplicate requests
- Empty states show helpful messages
- Error boundaries catch unexpected errors

================================================================================
12. KEY FEATURES SUMMARY
================================================================================

✓ Hierarchical category structure (Main → Sub)
✓ Full CRUD operations (Create, Read, Update, Delete)
✓ Dynamic filtering by main category
✓ Image support for categories
✓ Real-time list updates after operations
✓ Form validation and error handling
✓ Duplicate prevention
✓ Responsive 3-column grid layout
✓ Animated card interactions
✓ Product filtering by categories
✓ Integration with product creation
✓ Breadcrumb navigation
✓ Loading and empty states

================================================================================
13. COMPLETE CODE REFERENCES
================================================================================

Dashboard Category Management:
- Component: components/category-management.tsx
- Location: Dashboard → Categories Tab

Main Categories API:
- GET/POST: app/api/categories/main/route.ts
- PUT/DELETE: app/api/categories/main/[id]/route.ts

Sub Categories API:
- GET/POST: app/api/categories/sub/route.ts
- PUT/DELETE: app/api/categories/sub/[id]/route.ts

Collection Page:
- Main page: app/collection/page.tsx (Shows Mens/Womens)
- Category page: app/collection/[category]/page.tsx (Shows subcategories)

Database Collections:
- Main Categories: COLLECTIONS.MAIN_CATEGORIES = 'main_categories'
- Sub Categories: COLLECTIONS.SUB_CATEGORIES = 'sub_categories'

================================================================================
END OF DOCUMENTATION
================================================================================

