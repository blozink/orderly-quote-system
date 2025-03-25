
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  CreditCard, 
  DollarSign, 
  ShoppingCart, 
  Users,
  BarChart3,
  LineChart
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for charts
const orderData = [
  { name: "Mon", orders: 5 },
  { name: "Tue", orders: 7 },
  { name: "Wed", orders: 12 },
  { name: "Thu", orders: 9 },
  { name: "Fri", orders: 16 },
  { name: "Sat", orders: 11 },
  { name: "Sun", orders: 8 }
];

// Mock recent orders data
const recentOrders = [
  { id: "#ORD-5678", customer: "John Smith", date: "2023-06-01", total: 257.35, status: "Completed" },
  { id: "#ORD-5679", customer: "Emma Johnson", date: "2023-06-02", total: 128.99, status: "Completed" },
  { id: "#ORD-5680", customer: "Michael Brown", date: "2023-06-03", total: 499.00, status: "Completed" },
  { id: "#ORD-5681", customer: "Sophia Williams", date: "2023-06-03", total: 89.95, status: "Completed" },
  { id: "#ORD-5682", customer: "James Davis", date: "2023-06-04", total: 345.25, status: "Completed" }
];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrder: 0
  });

  useEffect(() => {
    // Simulate API fetch for dashboard data
    const fetchDashboardData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        setStats({
          totalSales: 24582.75,
          totalOrders: 189,
          totalCustomers: 95,
          averageOrder: 130.07
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6 animate-fadeIn">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 bg-muted animate-pulse rounded" />
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    ${stats.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">+12.5%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 bg-muted animate-pulse rounded" />
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">+8.2%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 bg-muted animate-pulse rounded" />
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">+5.7%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Average Order</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 bg-muted animate-pulse rounded" />
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    ${stats.averageOrder.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <ArrowDownRight className="h-3.5 w-3.5 mr-1 text-red-500" />
                    <span className="text-red-500 font-medium">-2.1%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Orders chart */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Order Overview</CardTitle>
                <CardDescription>Daily order volume for the past week</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Bar
                </Button>
                <Button variant="ghost" size="sm" className="h-8">
                  <LineChart className="h-4 w-4 mr-2" />
                  Line
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 bg-muted/50 animate-pulse rounded" />
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }} 
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}
                    />
                    <Bar 
                      dataKey="orders" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                      barSize={35}
                      className="fill-primary/80 hover:fill-primary transition-colors"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Recent orders */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest completed orders from your store</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted/50 animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        className="border-b last:border-0 hover:bg-secondary/20 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm">{order.id}</td>
                        <td className="py-3 px-4 text-sm">{order.customer}</td>
                        <td className="py-3 px-4 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-sm">${order.total.toFixed(2)}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
