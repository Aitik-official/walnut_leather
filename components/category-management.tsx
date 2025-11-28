"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Upload, Image as ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface MainCategory {
  _id: string
  name: string
  image: string
  createdAt: string
  updatedAt: string
}

interface SubCategory {
  _id: string
  name: string
  mainCategory: string
  image: string
  createdAt: string
  updatedAt: string
}

export default function CategoryManagement() {
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([])
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showMainCategoryDialog, setShowMainCategoryDialog] = useState(false)
  const [showSubCategoryDialog, setShowSubCategoryDialog] = useState(false)
  const [editingMainCategory, setEditingMainCategory] = useState<MainCategory | null>(null)
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null)
  
  const [mainCategoryForm, setMainCategoryForm] = useState({
    name: "",
    image: ""
  })
  
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: "",
    mainCategory: "",
    image: ""
  })
  
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const [mainRes, subRes] = await Promise.all([
        fetch('/api/categories/main'),
        fetch('/api/categories/sub')
      ])
      
      const mainData = await mainRes.json()
      const subData = await subRes.json()
      
      if (mainData.success) {
        setMainCategories(mainData.categories || [])
      }
      
      if (subData.success) {
        setSubCategories(subData.subCategories || [])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMainCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingMainCategory 
        ? `/api/categories/main/${editingMainCategory._id}`
        : '/api/categories/main'
      
      const method = editingMainCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mainCategoryForm)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success!",
          description: editingMainCategory 
            ? "Main category updated successfully" 
            : "Main category created successfully"
        })
        setShowMainCategoryDialog(false)
        setMainCategoryForm({ name: "", image: "" })
        setEditingMainCategory(null)
        fetchCategories()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save main category",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save main category",
        variant: "destructive"
      })
    }
  }

  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subCategoryForm.mainCategory) {
      toast({
        title: "Error",
        description: "Please select a main category",
        variant: "destructive"
      })
      return
    }
    
    try {
      const url = editingSubCategory
        ? `/api/categories/sub/${editingSubCategory._id}`
        : '/api/categories/sub'
      
      const method = editingSubCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subCategoryForm)
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success!",
          description: editingSubCategory
            ? "Sub category updated successfully"
            : "Sub category created successfully"
        })
        setShowSubCategoryDialog(false)
        setSubCategoryForm({ name: "", mainCategory: "", image: "" })
        setEditingSubCategory(null)
        fetchCategories()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save sub category",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save sub category",
        variant: "destructive"
      })
    }
  }

  const handleDeleteMainCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this main category? All sub-categories will also be affected.')) {
      return
    }
    
    try {
      const response = await fetch(`/api/categories/main/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success!",
          description: "Main category deleted successfully"
        })
        fetchCategories()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete main category",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete main category",
        variant: "destructive"
      })
    }
  }

  const handleDeleteSubCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sub category?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/categories/sub/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Success!",
          description: "Sub category deleted successfully"
        })
        fetchCategories()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete sub category",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sub category",
        variant: "destructive"
      })
    }
  }

  const handleEditMainCategory = (category: MainCategory) => {
    setEditingMainCategory(category)
    setMainCategoryForm({
      name: category.name,
      image: category.image || ""
    })
    setShowMainCategoryDialog(true)
  }

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory)
    setSubCategoryForm({
      name: subCategory.name,
      mainCategory: subCategory.mainCategory,
      image: subCategory.image || ""
    })
    setShowSubCategoryDialog(true)
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="main">Main Categories</TabsTrigger>
          <TabsTrigger value="sub">Sub Categories</TabsTrigger>
        </TabsList>

        {/* Main Categories Tab */}
        <TabsContent value="main" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Main Categories</h2>
              <p className="text-muted-foreground">Manage Mens and Womens categories</p>
            </div>
            <Dialog open={showMainCategoryDialog} onOpenChange={setShowMainCategoryDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingMainCategory(null)
                  setMainCategoryForm({ name: "", image: "" })
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Main Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingMainCategory ? 'Edit Main Category' : 'Add Main Category'}
                  </DialogTitle>
                  <DialogDescription>
                    Create or edit a main category (Mens or Womens)
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleMainCategorySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="main-category-name">Category Name *</Label>
                    <Select
                      value={mainCategoryForm.name}
                      onValueChange={(value) => setMainCategoryForm(prev => ({ ...prev, name: value }))}
                      disabled={!!editingMainCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mens">Mens</SelectItem>
                        <SelectItem value="Womens">Womens</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Main category must be either "Mens" or "Womens"
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="main-category-image">Category Image URL</Label>
                    <Input
                      id="main-category-image"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={mainCategoryForm.image}
                      onChange={(e) => setMainCategoryForm(prev => ({ ...prev, image: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Image URL for the category card (used in collections page)
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowMainCategoryDialog(false)
                        setMainCategoryForm({ name: "", image: "" })
                        setEditingMainCategory(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!mainCategoryForm.name}>
                      {editingMainCategory ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          ) : mainCategories.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No main categories yet. Create one to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Main Categories List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NAME</TableHead>
                      <TableHead>IMAGE</TableHead>
                      <TableHead>ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mainCategories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell>
                          <Badge variant="secondary" className="text-base px-3 py-1">
                            {category.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {category.image ? (
                            <img src={category.image} alt={category.name} className="w-16 h-16 object-cover rounded" />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditMainCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteMainCategory(category._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Sub Categories Tab */}
        <TabsContent value="sub" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Sub Categories</h2>
              <p className="text-muted-foreground">Manage jacket types (rider, bomber, etc.)</p>
            </div>
            <Dialog open={showSubCategoryDialog} onOpenChange={setShowSubCategoryDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingSubCategory(null)
                  setSubCategoryForm({ name: "", mainCategory: "", image: "" })
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sub Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingSubCategory ? 'Edit Sub Category' : 'Add Sub Category'}
                  </DialogTitle>
                  <DialogDescription>
                    Create or edit a sub category (jacket type)
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubCategorySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sub-main-category">Main Category *</Label>
                    <Select
                      value={subCategoryForm.mainCategory}
                      onValueChange={(value) => setSubCategoryForm(prev => ({ ...prev, mainCategory: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select main category" />
                      </SelectTrigger>
                      <SelectContent>
                        {mainCategories.map((cat) => (
                          <SelectItem key={cat._id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sub-category-name">Sub Category Name *</Label>
                    <Input
                      id="sub-category-name"
                      placeholder="e.g., Rider, Bomber, Biker"
                      value={subCategoryForm.name}
                      onChange={(e) => setSubCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Name of the jacket type (e.g., Rider, Bomber, Biker)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sub-category-image">Category Image URL</Label>
                    <Input
                      id="sub-category-image"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={subCategoryForm.image}
                      onChange={(e) => setSubCategoryForm(prev => ({ ...prev, image: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Image URL for the sub category card (used in collections page)
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowSubCategoryDialog(false)
                        setSubCategoryForm({ name: "", mainCategory: "", image: "" })
                        setEditingSubCategory(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!subCategoryForm.name || !subCategoryForm.mainCategory}>
                      {editingSubCategory ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading sub categories...</p>
            </div>
          ) : subCategories.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No sub categories yet. Create one to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sub Categories List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NAME</TableHead>
                      <TableHead>MAIN CATEGORY</TableHead>
                      <TableHead>IMAGE</TableHead>
                      <TableHead>ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subCategories.map((subCategory) => (
                      <TableRow key={subCategory._id}>
                        <TableCell>
                          <Badge variant="outline" className="text-base px-3 py-1">
                            {subCategory.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{subCategory.mainCategory}</Badge>
                        </TableCell>
                        <TableCell>
                          {subCategory.image ? (
                            <img src={subCategory.image} alt={subCategory.name} className="w-16 h-16 object-cover rounded" />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditSubCategory(subCategory)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteSubCategory(subCategory._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

