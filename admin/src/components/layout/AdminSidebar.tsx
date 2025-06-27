import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  List,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

interface AdminSidebarProps {
  isOpen: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  
  const effectiveCollapsed = !isOpen || collapsed;

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: 'Categories',
      path: '/admin/categories',
      icon: <List size={20} />,
    },
    {
      title: 'Customers',
      path: '/admin/customers',
      icon: <Users size={20} />,
    },
    {
      title: 'Products',
      path: '/admin/products',
      icon: <ShoppingBag size={20} />,
    },
    {
      title: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingCart size={20} />,
    },
    {
      title: 'Admins',
      path: '/admin/admins',
      icon: <AdminPanelSettingsIcon fontSize="small" />,
    },
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <aside
      className={cn(
        'bg-sidebar h-screen border-r border-admin-border transition-all duration-300',
        effectiveCollapsed ? 'w-[70px]' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-admin-border">
          <div className={cn("flex items-center", effectiveCollapsed ? "justify-center w-full" : "")}>
            {!effectiveCollapsed && (
              <span className="text-xl font-bold text-sidebar-primary">Admin</span>
            )}
            {effectiveCollapsed && (
              <span className="text-xl font-bold text-sidebar-primary">A</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        <nav className="flex-1 py-4 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center px-3 py-2.5 rounded-md text-sm transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                      effectiveCollapsed ? 'justify-center' : ''
                    )
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {!effectiveCollapsed && <span>{item.title}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-admin-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              effectiveCollapsed ? "justify-center" : "justify-start"
            )}
            onClick={logout}
          >
            <LogOut size={20} className={cn(effectiveCollapsed ? "" : "mr-3")} />
            {!effectiveCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
