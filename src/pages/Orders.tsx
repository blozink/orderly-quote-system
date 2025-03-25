
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Download, Filter, MoreHorizontal, RefreshCcw, Search, Eye } from "lucide-react";

// Mock orders data
const mockOrders = [
  {
    id: "ORD-5678",
    customer: {
      name: "John Smith",
      email: "john.smith@example.com"
    },
    date: "2023-06-01",
    total: 257.35,
    status: "Completed",
    items: 3
  },
  {
    id: "ORD-5679",
    customer: {
      name: "Emma Johnson",
      email: "emma.johnson@example.com"
    },
    date: "2023-06-02",
    total: 128.99,
    status: "Completed",
    items: 2
  },
  {
    id: "ORD-5680",
    customer: {
      name: "Michael Brown",
      email: "michael.brown@example.com"
    },
    date: "2023-06-03",
    total: 499.00,
    status: "Completed",
    items: 1
  },
  {
    id: "ORD-5681",
    customer: {
      name: "Sophia Williams",
      email: "sophia.williams@example.com"
    },
    date: "2023-06-03",
    total: 89.95,
    status: "Completed",
    items: 1
  },
  {
    id: "ORD-5682",
    customer: {
      name: "James Davis",
      email: "james.davis@example.com"
    },
    date: "2023-06-04",
    total: 345.25,
    status: "Completed",
    items: 4
  },
  {
    id: "ORD-5683",
    customer: {
      name: "Olivia Wilson",
      email: "olivia.wilson@example.com"
    },
    date: "2023-06-05",
    total: 209.75,
    status: "Completed",
    items: 2
  },
  {
    id: "ORD-5684",
    customer: {
      name: "William Taylor",
      email: "william.taylor@example.com"
    },
    date: "2023-06-06",
    total: 179.50,
    status: "Completed",
    items: 3
  },
  {
    id: "ORD-5685",
    customer: {
      name: "Ava Martinez",
      email: "ava.martinez@example.com"
    },
    date: "2023-06-07",
    total: 132.49,
    status: "Completed",
    items: 2
  },
  {
    id: "ORD-5686",
    customer: {
      name: "Alexander Anderson",
      email: "alexander.anderson@example.com"
    },
    date: "2023-06-08",
    total: 429.99,
    status: "Completed",
    items: 5
  },
  {
    id: "ORD-5687",
    customer: {
      name: "Charlotte Thomas",
      email: "charlotte.thomas@example.com"
    },
    date: "2023-06-09",
    total: 75.25,
    status: "Completed",
    items: 1
  }
];

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateSort, setDateSort] = useState("desc");
  
  useEffect(() => {
    // Simulate API fetch
    const fetchOrders = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          order.id.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.email.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(order => {
      // Status filter
      if (statusFilter !== "all") {
        return order.status.toLowerCase() === statusFilter;
      }
      return true;
    })
    .sort((a, b) => {
      // Date sort
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateSort === "desc" ? dateB - dateA : dateA - dateB;
    });
  
  const refreshOrders = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      toast.success("Orders refreshed successfully");
      setIsLoading(false);
    }, 1000);
  };
  
  const viewOrderDetails = (orderId: string) => {
    console.log(`View details for order: ${orderId}`);
    toast.info(`Viewing details for order ${orderId}`);
  };
  
  const downloadOrder = (orderId: string) => {
    console.log(`Download order: ${orderId}`);
    toast.success(`Order ${orderId} download started`);
  };
  
  return (
    <DashboardLayout title="Completed Orders">
      <div className="space-y-6 animate-fadeIn">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Orders</CardTitle>
                <CardDescription>View and manage your completed orders from Shopify</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshOrders}
                  disabled={isLoading}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
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
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background"
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[180px] bg-background">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="bg-background">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className={dateSort === "desc" ? "bg-accent" : ""}
                        onClick={() => setDateSort("desc")}
                      >
                        Newest first
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className={dateSort === "asc" ? "bg-accent" : ""}
                        onClick={() => setDateSort("asc")}
                      >
                        Oldest first
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        /* Would implement high to low price sort */
                      }}>
                        Price: High to Low
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        /* Would implement low to high price sort */
                      }}>
                        Price: Low to High
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Orders Table */}
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted/50 animate-pulse rounded" />
                  ))}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-2">No orders found</div>
                  <p className="text-sm">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-secondary/50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Items</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-card">
                      {filteredOrders.map((order) => (
                        <tr 
                          key={order.id} 
                          className="border-t hover:bg-secondary/20 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm font-medium">#{order.id}</td>
                          <td className="py-3 px-4 text-sm">
                            <div>{order.customer.name}</div>
                            <div className="text-xs text-muted-foreground">{order.customer.email}</div>
                          </td>
                          <td className="py-3 px-4 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-sm">{order.items}</td>
                          <td className="py-3 px-4 text-sm font-medium">${order.total.toFixed(2)}</td>
                          <td className="py-3 px-4 text-sm">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => viewOrderDetails(order.id)}
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => downloadOrder(order.id)}
                                className="h-8 w-8"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => viewOrderDetails(order.id)}>
                                    View details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => downloadOrder(order.id)}>
                                    Download invoice
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    Request refund
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
              {!isLoading && filteredOrders.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>1</strong> to <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={filteredOrders.length >= orders.length}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
