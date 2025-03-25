
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ChevronLeft, Plus, Trash2, Save, SendHorizontal } from "lucide-react";

// Mock products data
const mockProducts = [
  { id: "P001", name: "Premium Desk Chair", price: 199.99, image: "https://placehold.co/80x80/e2e8f0/1e293b?text=Chair" },
  { id: "P002", name: "Ergonomic Keyboard", price: 89.95, image: "https://placehold.co/80x80/e2e8f0/1e293b?text=Keyboard" },
  { id: "P003", name: "Ultra-Wide Monitor", price: 349.99, image: "https://placehold.co/80x80/e2e8f0/1e293b?text=Monitor" },
  { id: "P004", name: "Wireless Mouse", price: 45.50, image: "https://placehold.co/80x80/e2e8f0/1e293b?text=Mouse" },
  { id: "P005", name: "USB-C Hub", price: 65.00, image: "https://placehold.co/80x80/e2e8f0/1e293b?text=Hub" },
  { id: "P006", name: "Laptop Stand", price: 35.99, image: "https://placehold.co/80x80/e2e8f0/1e293b?text=Stand" },
];

// Mock draft order (for edit mode)
const mockDraftOrder = {
  id: "DRF-1001",
  customer: {
    name: "Robert Miller",
    email: "robert.miller@example.com",
    phone: "+1 (555) 123-4567",
    company: "Miller Enterprises"
  },
  items: [
    { id: "P001", name: "Premium Desk Chair", price: 199.99, quantity: 2, total: 399.98 },
    { id: "P004", name: "Wireless Mouse", price: 45.50, quantity: 1, total: 45.50 }
  ],
  subtotal: 445.48,
  discount: 0,
  tax: 35.64,
  shipping: 15.00,
  total: 496.12,
  notes: "Customer prefers delivery on weekends. Contact before shipping.",
  status: "Draft",
  created: "2023-06-10",
  updated: "2023-06-12"
};

const DraftOrder = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const isEditMode = draftId !== "new";
  
  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // Form state
  const [draftOrder, setDraftOrder] = useState({
    customer: {
      name: "",
      email: "",
      phone: "",
      company: ""
    },
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    notes: "",
    status: "Draft"
  });
  
  // Load draft data for edit mode
  useEffect(() => {
    const fetchDraftOrder = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from API using draftId
        if (isEditMode) {
          await new Promise(resolve => setTimeout(resolve, 800));
          setDraftOrder(mockDraftOrder);
        }
      } catch (error) {
        console.error("Error fetching draft order:", error);
        toast.error("Failed to load draft order data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDraftOrder();
  }, [draftId, isEditMode]);
  
  // Handle customer info changes
  const handleCustomerChange = (field, value) => {
    setDraftOrder(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value
      }
    }));
  };
  
  // Add item to order
  const addItem = (product) => {
    // Check if already in items
    const existingItemIndex = draftOrder.items.findIndex(item => item.id === product.id);
    
    let newItems;
    if (existingItemIndex >= 0) {
      // Increase quantity if already exists
      newItems = [...draftOrder.items];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + 1,
        total: (newItems[existingItemIndex].quantity + 1) * newItems[existingItemIndex].price
      };
    } else {
      // Add new item
      newItems = [
        ...draftOrder.items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          total: product.price
        }
      ];
    }
    
    // Recalculate totals
    const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + tax + draftOrder.shipping - draftOrder.discount;
    
    setDraftOrder(prev => ({
      ...prev,
      items: newItems,
      subtotal,
      tax,
      total
    }));
    
    setProductDialogOpen(false);
  };
  
  // Update item quantity
  const updateItemQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    
    const newItems = draftOrder.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          quantity,
          total: quantity * item.price
        };
      }
      return item;
    });
    
    // Recalculate totals
    const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + tax + draftOrder.shipping - draftOrder.discount;
    
    setDraftOrder(prev => ({
      ...prev,
      items: newItems,
      subtotal,
      tax,
      total
    }));
  };
  
  // Remove item from order
  const removeItem = (itemId) => {
    const newItems = draftOrder.items.filter(item => item.id !== itemId);
    
    // Recalculate totals
    const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + tax + draftOrder.shipping - draftOrder.discount;
    
    setDraftOrder(prev => ({
      ...prev,
      items: newItems,
      subtotal,
      tax,
      total
    }));
  };
  
  // Handle shipping and discount changes
  const handleAmountChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    
    let newTotal;
    if (field === "shipping") {
      newTotal = draftOrder.subtotal + draftOrder.tax + numValue - draftOrder.discount;
    } else if (field === "discount") {
      newTotal = draftOrder.subtotal + draftOrder.tax + draftOrder.shipping - numValue;
    }
    
    setDraftOrder(prev => ({
      ...prev,
      [field]: numValue,
      total: newTotal
    }));
  };
  
  // Save draft order
  const saveDraftOrder = async (asFinal = false) => {
    if (!draftOrder.customer.name || !draftOrder.customer.email) {
      toast.error("Please provide customer name and email");
      return;
    }
    
    if (draftOrder.items.length === 0) {
      toast.error("Please add at least one product to the order");
      return;
    }
    
    setSaveLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const status = asFinal ? "Pending Approval" : "Draft";
      
      // In a real app, send to API
      console.log("Saving draft order with status:", status);
      
      toast.success(`Order successfully ${asFinal ? 'finalized' : 'saved'} as ${status}`);
      navigate("/drafts"); // Redirect to drafts page
    } catch (error) {
      console.error("Error saving draft order:", error);
      toast.error("Failed to save draft order");
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Cancel and discard changes
  const cancelAndGoBack = () => {
    // Check if there are changes to confirm discard
    if (draftOrder.customer.name || draftOrder.items.length > 0) {
      setConfirmDialogOpen(true);
    } else {
      navigate("/drafts");
    }
  };
  
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };
  
  return (
    <DashboardLayout title={isEditMode ? "Edit Draft Order" : "Create New Draft Order"}>
      <div className="space-y-6 animate-fadeIn">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-muted/50 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <>
            {/* Top actions */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={cancelAndGoBack}
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Drafts
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={saveLoading}
                  onClick={() => saveDraftOrder(false)}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button
                  variant="default"
                  disabled={saveLoading}
                  onClick={() => saveDraftOrder(true)}
                >
                  <SendHorizontal className="h-4 w-4 mr-2" />
                  Finalize Quote
                </Button>
              </div>
            </div>
            
            {/* Customer Information */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  Enter the customer details for this quote
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="customerName"
                      placeholder="Full Name"
                      value={draftOrder.customer.name}
                      onChange={(e) => handleCustomerChange("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={draftOrder.customer.email}
                      onChange={(e) => handleCustomerChange("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <Input
                      id="customerPhone"
                      placeholder="(555) 123-4567"
                      value={draftOrder.customer.phone}
                      onChange={(e) => handleCustomerChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerCompany">Company (Optional)</Label>
                    <Input
                      id="customerCompany"
                      placeholder="Company Name"
                      value={draftOrder.customer.company}
                      onChange={(e) => handleCustomerChange("company", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Order Items */}
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription className="mt-1">
                    Add products to the quote
                  </CardDescription>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setProductDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent>
                {draftOrder.items.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-md">
                    <p className="text-muted-foreground">No items added to this order yet.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setProductDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Item
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {draftOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.id}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.price)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-6 w-6 rounded-r-none border-r-0"
                                  onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </Button>
                                <Input
                                  className="w-14 h-9 text-center rounded-none"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value) || 1;
                                    updateItemQuantity(item.id, val);
                                  }}
                                />
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-6 w-6 rounded-l-none border-l-0"
                                  onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.total)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Notes */}
              <Card className="bg-card md:col-span-2">
                <CardHeader>
                  <CardTitle>Order Notes</CardTitle>
                  <CardDescription>
                    Add any special instructions or notes about this order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter any notes for this order..."
                    className="min-h-[120px]"
                    value={draftOrder.notes}
                    onChange={(e) => setDraftOrder(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </CardContent>
              </Card>
              
              {/* Order Summary */}
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>{formatCurrency(draftOrder.subtotal)}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="discount" className="text-muted-foreground">Discount:</Label>
                      <Input
                        id="discount"
                        type="number"
                        className="w-24 text-right"
                        value={draftOrder.discount}
                        onChange={(e) => handleAmountChange("discount", e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Label htmlFor="shipping" className="text-muted-foreground">Shipping:</Label>
                      <Input
                        id="shipping"
                        type="number"
                        className="w-24 text-right"
                        value={draftOrder.shipping}
                        onChange={(e) => handleAmountChange("shipping", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (8%):</span>
                    <span>{formatCurrency(draftOrder.tax)}</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>{formatCurrency(draftOrder.total)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-2">
                  <Button
                    className="w-full"
                    disabled={saveLoading}
                    onClick={() => saveDraftOrder(true)}
                  >
                    <SendHorizontal className="h-4 w-4 mr-2" />
                    Finalize Quote
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={saveLoading}
                    onClick={() => saveDraftOrder(false)}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </>
        )}
      </div>
      
      {/* Product Selection Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Select a product to add to this order.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {mockProducts.map((product) => (
              <div 
                key={product.id}
                className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                onClick={() => addItem(product)}
              >
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="w-10 h-10 rounded" />
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground">{product.id}</div>
                  </div>
                </div>
                <div className="font-semibold">{formatCurrency(product.price)}</div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Discard Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmDialogOpen(false);
                navigate("/drafts");
              }}
            >
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DraftOrder;
