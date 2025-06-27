
import React from 'react';

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  isNew?: boolean;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  title, 
  description, 
  time, 
  isNew 
}) => (
  <div className={`px-4 py-3 hover:bg-muted/50 cursor-pointer ${isNew ? 'bg-primary/5' : ''}`}>
    <div className="flex justify-between items-start">
      <p className="font-medium text-sm">
        {title}
        {isNew && <span className="ml-2 text-xs bg-primary text-white px-1.5 py-0.5 rounded-full">New</span>}
      </p>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
    <p className="text-xs text-muted-foreground mt-1">{description}</p>
  </div>
);

export default NotificationItem;
