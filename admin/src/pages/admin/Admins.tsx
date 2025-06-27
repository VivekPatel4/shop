import React, { useEffect, useState } from 'react';
import { adminApi } from '../../lib/api';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, IconButton, CircularProgress } from '@mui/material';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const Admins: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAdmins();
      setAdmins(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleOpen = () => { setOpen(true); setForm({ firstName: '', lastName: '', email: '', password: '' }); setError(''); };
  const handleClose = () => { setOpen(false); setError(''); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setForm({ ...form, [e.target.name]: e.target.value }); };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await adminApi.addAdmin(form);
      handleClose();
      fetchAdmins();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add admin');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminApi.deleteAdmin(deleteId);
      setDeleteId(null);
      fetchAdmins();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete admin');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Admins</h1>
        <Button onClick={handleOpen}>
          <AddIcon className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Admin Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center py-8"><CircularProgress /></div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">Name</th>
                      <th className="py-3 px-4 text-left font-medium">Email</th>
                      <th className="py-3 px-4 text-left font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.length === 0 ? (
                      <tr><td colSpan={3} className="text-center py-8 text-muted-foreground">No admins found.</td></tr>
                    ) : (
                      admins.map((admin) => (
                        <tr key={admin._id} className="border-t hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{admin.firstName} {admin.lastName}</td>
                          <td className="py-3 px-4 text-muted-foreground">{admin.email}</td>
                          <td className="py-3 px-4 text-right">
                            <IconButton color="error" onClick={() => setDeleteId(admin._id)} disabled={deleting}>
                              <DeleteIcon />
                            </IconButton>
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
      {/* Add Admin Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Admin</DialogTitle>
        <form onSubmit={handleAdd}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
            <TextField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required fullWidth />
            <TextField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required fullWidth />
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} required fullWidth type="email" />
            <TextField label="Password" name="password" value={form.password} onChange={handleChange} required fullWidth type="password" />
            {error && <Typography color="error">{error}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} type="button" variant="outline">Cancel</Button>
            <Button type="submit" variant="default">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Admin</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this admin?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} type="button" variant="outline">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="default" disabled={deleting}>
            {deleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Admins; 