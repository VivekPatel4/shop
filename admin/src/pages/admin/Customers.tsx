import { useState, useEffect } from 'react';
import { adminApi } from '../../lib/api';
import { useToast } from '@/context/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, Shield, Plus } from 'lucide-react';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  blocked: boolean;
  createdAt: string;
}

export default function Customers() {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getCustomers();
      setCustomers(response.data);
    } catch (error) {
      showToast('Error fetching customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    try {
      await adminApi.createCustomer(newCustomer);
      showToast('Customer added successfully', 'success');
      setIsAddDialogOpen(false);
      setNewCustomer({ firstName: '', lastName: '', email: '', password: '', mobile: '' });
      fetchCustomers();
    } catch (error) {
      showToast('Error adding customer', 'error');
    }
  };

  const handleEditCustomer = async () => {
    if (!selectedCustomer) return;
    try {
      await adminApi.updateCustomer(selectedCustomer._id, {
        firstName: selectedCustomer.firstName,
        lastName: selectedCustomer.lastName,
        email: selectedCustomer.email,
        mobile: selectedCustomer.mobile || '',
      });
      showToast('Customer updated successfully', 'success');
      setIsEditDialogOpen(false);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (error) {
      showToast('Error updating customer', 'error');
    }
  };

  const handleBlockCustomer = async (customer: Customer) => {
    try {
      await adminApi.blockOrUnblockCustomer(customer._id);
      showToast(`Customer ${customer.blocked ? 'unblocked' : 'blocked'} successfully`, 'success');
      fetchCustomers();
    } catch (error) {
      showToast('Error updating customer status', 'error');
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    try {
      await adminApi.deleteCustomer(customer._id);
      showToast('Customer deleted successfully', 'success');
      fetchCustomers();
    } catch (error) {
      showToast('Error deleting customer', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Customer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center py-8">Loading...</div>
              ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium">Name</th>
                    <th className="py-3 px-4 text-left font-medium">Email</th>
                      <th className="py-3 px-4 text-left font-medium">Mobile</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                      <th className="py-3 px-4 text-left font-medium">Created At</th>
                    <th className="py-3 px-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                    {customers.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No customers found.</td></tr>
                    ) : (
                      customers.map((customer) => (
                        <tr key={customer._id} className="border-t hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{customer.firstName} {customer.lastName}</td>
                          <td className="py-3 px-4 text-muted-foreground">{customer.email}</td>
                          <td className="py-3 px-4 text-muted-foreground">{customer.mobile || '-'}</td>
                      <td className="py-3 px-4">
                            <Badge variant={customer.blocked ? 'destructive' : 'default'}>
                              {customer.blocked ? 'Blocked' : 'Active'}
                            </Badge>
                      </td>
                          <td className="py-3 px-4 text-muted-foreground">{new Date(customer.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedCustomer(customer); setIsEditDialogOpen(true); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleBlockCustomer(customer)}>
                              <Shield className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCustomer(customer)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                      </td>
                    </tr>
                      ))
                    )}
                </tbody>
              </table>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Add Customer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">First Name</Label>
              <Input id="firstName" value={newCustomer.firstName} onChange={e => setNewCustomer({ ...newCustomer, firstName: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">Last Name</Label>
              <Input id="lastName" value={newCustomer.lastName} onChange={e => setNewCustomer({ ...newCustomer, lastName: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" type="email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">Password</Label>
              <Input id="password" type="password" value={newCustomer.password} onChange={e => setNewCustomer({ ...newCustomer, password: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mobile" className="text-right">Mobile</Label>
              <Input id="mobile" value={newCustomer.mobile} onChange={e => setNewCustomer({ ...newCustomer, mobile: e.target.value })} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editFirstName" className="text-right">First Name</Label>
                <Input id="editFirstName" value={selectedCustomer.firstName} onChange={e => setSelectedCustomer({ ...selectedCustomer, firstName: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editLastName" className="text-right">Last Name</Label>
                <Input id="editLastName" value={selectedCustomer.lastName} onChange={e => setSelectedCustomer({ ...selectedCustomer, lastName: e.target.value })} className="col-span-3" />
                </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editEmail" className="text-right">Email</Label>
                <Input id="editEmail" type="email" value={selectedCustomer.email} onChange={e => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editMobile" className="text-right">Mobile</Label>
                <Input id="editMobile" value={selectedCustomer.mobile || ''} onChange={e => setSelectedCustomer({ ...selectedCustomer, mobile: e.target.value })} className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCustomer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
