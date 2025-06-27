import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreHorizontal, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5454/api/admin/orders';

const statusOptions = [
  { value: 'PLACED', label: 'Placed' },
  { value: 'ORDER_CONFIRMED', label: 'Order Confirmed' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'OUT_FOR_DELIVERY', label: 'Out For Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const { toast } = useToast();

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to fetch orders', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.user?.firstName + ' ' + order.user?.lastName).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const openUpdateStatusDialog = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setIsUpdateStatusDialogOpen(true);
  };

  // Map status to endpoint suffix
  const statusToEndpoint: Record<string, string> = {
    ORDER_CONFIRMED: 'confirmed',
    SHIPPED: 'ship',
    OUT_FOR_DELIVERY: 'out-for-delivery',
    DELIVERED: 'deliver',
    CANCELLED: 'cancel',
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus || newStatus === selectedOrder.orderStatus) return;
    const token = localStorage.getItem('admin_token');
    const endpoint = statusToEndpoint[newStatus];
    if (!endpoint) return;
    try {
      await axios.put(`${API_BASE_URL}/${selectedOrder._id}/${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: 'Order Status Updated',
        description: `Order ${selectedOrder._id} status changed to ${newStatus}.`,
      });
      setIsUpdateStatusDialogOpen(false);
      fetchOrders();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update order status', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PLACED':
        return <Badge variant="outline" className="bg-blue-900 text-blue-200 border-blue-700">Placed</Badge>;
      case 'ORDER_CONFIRMED':
        return <Badge variant="outline" className="bg-indigo-900 text-indigo-200 border-indigo-700">Order Confirmed</Badge>;
      case 'SHIPPED':
        return <Badge variant="outline" className="bg-amber-900 text-amber-200 border-amber-700">Shipped</Badge>;
      case 'OUT_FOR_DELIVERY':
        return <Badge variant="outline" className="bg-purple-900 text-purple-200 border-purple-700">Out For Delivery</Badge>;
      case 'DELIVERED':
        return <Badge variant="outline" className="bg-green-900 text-green-200 border-green-700">Delivered</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="bg-red-900 text-red-200 border-red-700">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-900 text-gray-200 border-gray-700">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Order Management</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="w-full md:w-1/3 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">Export</Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr className="bg-gray-900">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-100">{order._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-100">{order.user?.firstName} {order.user?.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.orderStatus)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-100">${order.totalPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => viewOrder(order)}>
                        <Eye className="w-4 h-4 mr-1" /> View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openUpdateStatusDialog(order)}>
                        Update Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of order <span className="font-semibold">{selectedOrder?._id}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateStatus} disabled={newStatus === selectedOrder?.orderStatus}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Order Dialog (optional, can be expanded for details) */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-2">
              <div><span className="font-semibold">Order ID:</span> {selectedOrder._id}</div>
              <div><span className="font-semibold">Customer:</span> {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</div>
              <div><span className="font-semibold">Status:</span> {getStatusBadge(selectedOrder.orderStatus)}</div>
              <div><span className="font-semibold">Total:</span> ${selectedOrder.totalPrice}</div>
              <div><span className="font-semibold">Products:</span>
                <ul className="list-disc ml-6">
                  {selectedOrder.orderItems?.map((item: any, idx: number) => (
                    <li key={item._id || idx}>{item.product?.name} x {item.quantity} (${item.price})</li>
                  ))}
                </ul>
              </div>
              <div><span className="font-semibold">Shipping Address:</span> {selectedOrder.shippingAddress?.streetAddress}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}, {selectedOrder.shippingAddress?.zipCode}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
