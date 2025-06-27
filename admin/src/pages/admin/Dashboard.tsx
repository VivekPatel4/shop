import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingBag, DollarSign, ShoppingCart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

const Dashboard = () => {
  const [summary, setSummary] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [visitsData, setVisitsData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [summaryRes, salesRes, visitsRes, topProductsRes] = await Promise.all([
          api.get('/admin/analytics/summary'),
          api.get('/admin/analytics/sales'),
          api.get('/admin/analytics/visits'),
          api.get('/admin/analytics/top-products'),
        ]);
        setSummary(summaryRes.data);
        setSalesData(salesRes.data || []);
        setVisitsData(visitsRes.data || []);
        setTopProducts(topProductsRes.data || []);
      } catch (err) {
        setSummary(null);
        setSalesData([]);
        setVisitsData([]);
        setTopProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Last updated just now</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold">{loading ? '...' : `$${summary?.revenue?.toLocaleString() || '0'}`}</h3>
                  <span className="text-xs ml-2 text-green-500 font-medium">+8.2%</span>
                </div>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={64} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">+20.1% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold">{loading ? '...' : summary?.orders || '0'}</h3>
                  <span className="text-xs ml-2 text-green-500 font-medium">+12.5%</span>
                </div>
              </div>
              <div className="p-2 bg-orange-500/10 rounded-full">
                <ShoppingCart className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={72} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">+12.5% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold">{loading ? '...' : summary?.customers || '0'}</h3>
                  <span className="text-xs ml-2 text-green-500 font-medium">+5.3%</span>
                </div>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={53} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">+5.3% from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <div className="flex items-baseline">
                  <h3 className="text-2xl font-bold">{loading ? '...' : summary?.products || '0'}</h3>
                  <span className="text-xs ml-2 text-amber-500 font-medium">+0.5%</span>
                </div>
              </div>
              <div className="p-2 bg-purple-500/10 rounded-full">
                <ShoppingBag className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={32} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">+0.5% from last month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Website visits for the week</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visitsData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products</CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              {loading ? (
                <li>Loading...</li>
              ) : topProducts.length === 0 ? (
                <li>No data</li>
              ) : (
                topProducts.map((prod, idx) => (
                  <li key={idx} className="flex justify-between py-2 border-b last:border-b-0">
                    <span>{prod.name}</span>
                    <span className="font-bold">{prod.sales}</span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
