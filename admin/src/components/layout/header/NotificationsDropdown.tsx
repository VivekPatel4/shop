
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotificationItem from './NotificationItem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NotificationsDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-sidebar-accent rounded-full"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
            3
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          <NotificationItem 
            title="New order received" 
            description="Order #12345 has been placed"  
            time="5 min ago"
            isNew
          />
          <NotificationItem 
            title="New customer registered" 
            description="John Doe has created an account"  
            time="1 hour ago"
            isNew
          />
          <NotificationItem 
            title="Payment received" 
            description="$1,200 payment confirmed"  
            time="3 hours ago"
            isNew
          />
          <NotificationItem 
            title="Stock alert" 
            description="Product 'Wireless Headphones' is low on stock"  
            time="Yesterday"
          />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center font-medium text-primary">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
