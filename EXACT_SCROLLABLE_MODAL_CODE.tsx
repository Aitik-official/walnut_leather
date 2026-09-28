// ============================================
// EXACT SCROLLABLE MODAL CODE FROM LAST REQUEST
// ============================================

// OUTER CONTAINER - Fixed Overlay with Centering
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  
  {/* INNER CONTAINER - Scrollable Content Box */}
  <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
    
    {/* CONTENT WRAPPER - Padding */}
    <div className="p-6">
      
      {/* Your modal content here */}
      {/* This area scrolls when content exceeds max-h-[90vh] */}
      
    </div>
  </div>
</div>

// ============================================
// COMPLETE EXAMPLE WITH HEADER
// ============================================

{showAddForm && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        {/* Modal Header - Stays at top when scrolling */}
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
        <form className="space-y-6">
          {/* All form fields - will scroll if content is tall */}
        </form>
      </div>
    </div>
  </div>
)}

// ============================================
// CLASS BREAKDOWN
// ============================================

/*
OUTER DIV:
- fixed          → Fixed positioning
- inset-0        → Full screen coverage
- bg-black/50    → Semi-transparent backdrop
- flex           → Flexbox container
- items-center   → Vertical centering
- justify-center → Horizontal centering
- z-50          → High z-index
- p-4           → Padding (mobile spacing)

INNER DIV (SCROLLABLE):
- bg-white       → White background
- rounded-lg     → Rounded corners
- max-w-4xl      → Max width 896px
- w-full         → Full width up to max
- max-h-[90vh]   → Max height 90% viewport
- overflow-y-auto → Vertical scroll when needed

CONTENT DIV:
- p-6           → Internal padding
*/

