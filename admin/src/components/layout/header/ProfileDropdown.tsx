import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const ProfileDropdown = () => {
  const { user, logout } = useAuth();

  // Helper for initials
  const getInitials = () => {
    if (!user) return 'U';
    const first = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const last = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    return `${first}${last}` || 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative rounded-full p-0 h-9 w-9 flex items-center gap-2">
          <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-700">
            {/* If you have a profile image URL, use it here. For now, fallback to initials */}
            {/* <AvatarImage src={user?.profileImageUrl || undefined} alt={user ? `${user.firstName} ${user.lastName}` : 'User'} /> */}
            <AvatarFallback className="bg-primary/10 text-primary dark:bg-primary/20">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" forceMount>
        <div className="flex items-center gap-3 p-3">
          <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
            {/* <AvatarImage src={user?.profileImageUrl || undefined} alt={user ? `${user.firstName} ${user.lastName}` : 'User'} /> */}
            <AvatarFallback className="bg-primary/10 text-primary dark:bg-primary/20">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium leading-none">{user ? `${user.firstName} ${user.lastName}` : ''}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
            <p className="text-xs text-muted-foreground font-medium leading-none mt-1 bg-primary/10 dark:bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm w-fit">
              {user?.role}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2" onClick={logout}>
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
