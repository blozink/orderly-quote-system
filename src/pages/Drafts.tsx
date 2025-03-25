
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ClipboardEdit, Filter, MoreHorizontal, Plus, RefreshCcw, Search, Trash2, SendHorizontal } from "lucide-react";

// Mock drafts data
const mockDrafts = [
  {
    id: "DRF-1001",
    customer: {
      name: "Robert Miller",
      email: "robert.miller@example.com"
    },
    created: "2023-06-10",
    updated: "2023-06-12",
    total: 357.95,
    status: "Draft",
    items: 4
  },
  {
    id: "DRF-1002",
    customer: {
      name: "Sarah Clark",
      email: "sarah.clark@example.com"
    },
    created: "2023-06-11",
    updated: "2023-06-11",
    total: 128.50,
    status: "Pending Approval",
    items: 2
  },
  {
    id: "DRF-1003",
    customer: {
      name: "David Wilson",
      email: "david.wilson@example.com"
    },
    created: "2023-06-12",
    updated: "2023-06-14",
    total: 249.99,
    status: "Draft",
    items: 1
  },
  {
    id: "DRF-1004",
    customer: {
      name: "Jennifer Thompson",
      email: "jennifer.thompson@example.com"
    },
    created: "2023-06-13",
    updated: "2023-06-15",
    total: 175.25,
    status: "Draft",
    items: 3
  },
  {
    id: "DRF-1005",
    customer: {
      name: "Christopher Moore",
      email: "christopher.moore@example.com"
    },
    created: "2023-06-14",
    updated: "2023-06-14",
    total: 498.75,
    status: "Pending Approval",
    items: 5
  },
  {
    id: "DRF-1006",
    customer: {
      name: "Amanda Lewis",
      email: "amanda.lewis@example.com"
    },
    created: "2023-06-15",
    updated: "2023-06-16",
    total: 159.95,
    status: "Draft",
    items: 2
  }
];

const Drafts = () => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate API fetch
    const fetchDrafts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1200));
        setDrafts(mockDrafts);
      } catch (error) {
        console.error("Error fetching draft orders:", error);
        toast.error("Failed to load draft orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDrafts();
  }, []);
  
  // Filter drafts
  const filteredDrafts = drafts
    .filter(draft => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          draft.id.toLowerCase().includes(query) ||
          draft.customer.name.toLowerCase().includes(query) ||
          draft.customer.email.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(draft => {
      // Status filter
      if (statusFilter !== "all") {
        return draft.status.toLowerCase().replace(" ", "-") === statusFilter;
      }
      return true;
    });
  
  const refreshDrafts = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      toast.success("Draft orders refreshed successfully");
      setIsLoading(false);
    }, 1000);
  };
  
  const handleEditDraft = (draftId: string) => {
    console.log(`Edit draft: ${draftId}`);
    navigate(`/drafts/${draftId}`);
  };
  
  const handleSendQuote = (draftId: string) => {
    console.log(`Send quote for draft: ${draftId}`);
    toast.success(`Quote for ${draftId} sent to customer`);
  };
  
  const handleDeleteDraft = (draftId: string) => {
    setSelectedDraft(draftId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedDraft) {
      // Simulate delete API call
      setDrafts(drafts.filter(draft => draft.id !== selectedDraft));
      toast.success(`Draft order ${selectedDraft} deleted successfully`);
      setDeleteDialogOpen(false);
      setSelectedDraft(null);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
            Draft
          </Badge>
        );
      case "Pending Approval":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">
            Pending Approval
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };
  
  return (
    <DashboardLayout title="Preliminary Orders">
      <div className="space-y-6 animate-fadeIn">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Draft Orders</CardTitle>
                <CardDescription>Manage and edit your preliminary orders and quotations</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshDrafts}
                  disabled={isLoading}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/drafts/new")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Quote
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search drafts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-3 pr-10 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Draft</option>
                    <option value="pending-approval">Pending Approval</option>
                  </select>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-background">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {
                        /* Sort implementation */
                      }}>
                        Recently updated
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        /* Sort implementation */
                      }}>
                        Recently created
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        /* Sort implementation */
                      }}>
                        Price: High to Low
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        /* Sort implementation */
                      }}>
                        Price: Low to High
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Drafts Table */}
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted/50 animate-pulse rounded" />
                  ))}
                </div>
              ) : filteredDrafts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-2">No draft orders found</div>
                  <p className="text-sm">Try adjusting your search or create a new quote.</p>
                  <Button 
                    className="mt-4"
                    onClick={() => navigate("/drafts/new")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Quote
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-secondary/50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Draft ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Items</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-card">
                      {filteredDrafts.map((draft) => (
                        <tr 
                          key={draft.id} 
                          className="border-t hover:bg-secondary/20 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm font-medium">{draft.id}</td>
                          <td className="py-3 px-4 text-sm">
                            <div>{draft.customer.name}</div>
                            <div className="text-xs text-muted-foreground">{draft.customer.email}</div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div>{new Date(draft.created).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              Updated: {new Date(draft.updated).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{draft.items}</td>
                          <td className="py-3 px-4 text-sm font-medium">${draft.total.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm">
                            {getStatusBadge(draft.status)}
                          </td>
                          <td className="py-3 px-4 text-sm text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditDraft(draft.id)}
                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <ClipboardEdit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleSendQuote(draft.id)}
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <SendHorizontal className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteDraft(draft.id)}
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditDraft(draft.id)}>
                                    Edit draft
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSendQuote(draft.id)}>
                                    Send quote to customer
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleDeleteDraft(draft.id)}
                                  >
                                    Delete draft
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Pagination would go here */}
              {!isLoading && filteredDrafts.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>1</strong> to <strong>{filteredDrafts.length}</strong> of <strong>{drafts.length}</strong> drafts
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={filteredDrafts.length >= drafts.length}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete draft order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this draft order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Drafts;
