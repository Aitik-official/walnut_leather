// ============================================
// SCROLLABLE MODAL STRUCTURE - EXACT CODE
// ============================================
// This is the exact scrollable modal structure from the Add Product form
// Includes: Layout, Position, Scroll Behavior, and Z-index

// ============================================
// COMPLETE SCROLLABLE MODAL STRUCTURE
// ============================================

export default function ScrollableModal() {
  return (
    {/* 
      OUTER CONTAINER - Fixed Overlay
      - fixed: Position fixed relative to viewport
      - inset-0: Covers entire screen (top:0, right:0, bottom:0, left:0)
      - bg-black/50: Semi-transparent black background (50% opacity)
      - flex: Flexbox container
      - items-center: Centers content vertically
      - justify-center: Centers content horizontally
      - z-50: High z-index to appear above other content
      - p-4: Padding around the modal (prevents edge touching on mobile)
    */}
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      
      {/* 
        INNER CONTAINER - Scrollable Content Box
        - bg-white: White background
        - rounded-lg: Rounded corners
        - max-w-4xl: Maximum width of 4xl (896px) - prevents too wide on large screens
        - w-full: Full width up to max-width
        - max-h-[90vh]: Maximum height of 90% of viewport height
        - overflow-y-auto: Enables vertical scrolling when content exceeds max-height
      */}
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* 
          CONTENT WRAPPER - Padding Container
          - p-6: Padding inside the scrollable area
        */}
        <div className="p-6">
          
          {/* MODAL HEADER - Fixed at top when scrolling */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Add New Product</h2>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>

          {/* SCROLLABLE CONTENT AREA */}
          {/* All form content goes here - will scroll if exceeds max-h-[90vh] */}
          <form className="space-y-6">
            {/* Form fields... */}
          </form>
          
        </div>
      </div>
    </div>
  )
}

// ============================================
// BREAKDOWN OF SCROLLABLE BEHAVIOR
// ============================================

/*
LAYER STRUCTURE (from outside to inside):

1. OUTER LAYER (Backdrop/Overlay):
   className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
   
   Purpose: 
   - Creates a dark overlay that covers the entire screen
   - Centers the modal in the viewport
   - Provides click-outside-to-close area
   - Padding prevents modal from touching screen edges on mobile

2. MIDDLE LAYER (Scrollable Container):
   className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
   
   Purpose:
   - White content box with rounded corners
   - Constrains width to max-w-4xl (896px) for readability
   - Constrains height to 90% of viewport (max-h-[90vh])
   - Enables vertical scrolling (overflow-y-auto) when content exceeds height
   - This is the KEY scrollable element

3. INNER LAYER (Content Padding):
   className="p-6"
   
   Purpose:
   - Adds padding inside the scrollable area
   - Ensures content doesn't touch the edges when scrolling

SCROLL BEHAVIOR:
- When content height < 90vh: No scrollbar appears, content is fully visible
- When content height > 90vh: Vertical scrollbar appears, user can scroll
- Scroll happens ONLY within the white box, not the entire screen
- Backdrop (black overlay) remains fixed and doesn't scroll

POSITIONING:
- Modal is centered both horizontally and vertically
- Fixed positioning means it stays in place even if page scrolls
- z-50 ensures it appears above all other page content

RESPONSIVE BEHAVIOR:
- p-4 on outer container: Adds space on mobile devices
- max-w-4xl: Prevents modal from being too wide on large screens
- w-full: Ensures modal uses available width up to max-width
- max-h-[90vh]: Adapts to different screen heights (mobile, tablet, desktop)
*/

// ============================================
// EXACT CODE FROM DASHBOARD (Copy-Paste Ready)
// ============================================

{/* Add Product Form Modal */}
{showAddForm && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Add New Product</h2>
          <Button 
            variant="ghost" 
            onClick={() => setShowAddForm(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </Button>
        </div>

        {/* Scrollable Form Content */}
        <Card className="shadow-xl border-primary/20">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* All your form fields go here */}
              {/* This content will scroll if it exceeds 90vh */}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
)}

// ============================================
// ALTERNATIVE: WITH SMOOTH SCROLLING
// ============================================

{/* If you want smooth scrolling behavior, add scroll-smooth */}
<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto scroll-smooth">
  {/* content */}
</div>

// ============================================
// ALTERNATIVE: WITH CUSTOM SCROLLBAR STYLING
// ============================================

{/* For custom scrollbar (requires CSS) */}
<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
  {/* content */}
</div>

/* Add to your CSS/globals.css:
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
*/

// ============================================
// KEY CSS CLASSES EXPLAINED
// ============================================

/*
fixed          → Position: fixed (relative to viewport, not parent)
inset-0        → top: 0, right: 0, bottom: 0, left: 0 (full screen coverage)
bg-black/50    → Background: black with 50% opacity
flex           → Display: flex
items-center   → Align-items: center (vertical centering)
justify-center → Justify-content: center (horizontal centering)
z-50          → Z-index: 50 (appears above other content)
p-4           → Padding: 1rem (16px) all sides
max-w-4xl      → Max-width: 56rem (896px)
w-full         → Width: 100%
max-h-[90vh]   → Max-height: 90% of viewport height
overflow-y-auto → Overflow-y: auto (shows scrollbar when needed)
rounded-lg     → Border-radius: 0.5rem (8px)
bg-white       → Background: white
*/

