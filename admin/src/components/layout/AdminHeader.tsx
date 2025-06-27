import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeSwitcher from './header/ThemeSwitcher';
import NotificationsDropdown from './header/NotificationsDropdown';
import ProfileDropdown from './header/ProfileDropdown';
import SearchInput from './header/SearchInput';

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white dark:bg-sidebar border-b border-admin-border dark:border-sidebar-border py-4 px-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-600 dark:text-gray-300">
            <Menu className="h-5 w-5" />
          </Button>
          
          <SearchInput />
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeSwitcher />

          {/* User Profile */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
