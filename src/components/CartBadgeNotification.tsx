import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface CartBadgeNotificationProps {
  totalItems: number;
  showNotification: boolean;
  changeAmount: number;
}

export const CartBadgeNotification: React.FC<CartBadgeNotificationProps> = ({ 
  totalItems, 
  showNotification, 
  changeAmount 
}) => {
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    if (showNotification) {
      setDisplayAmount(changeAmount);
      const timer = setTimeout(() => {
        setDisplayAmount(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showNotification, changeAmount]);

  return (
    <div className="relative">
      {totalItems > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {totalItems}
        </Badge>
      )}
      
      {/* Notification animation */}
      {showNotification && displayAmount !== 0 && (
        <div className="absolute -top-3 -right-3 z-10">
          <div className="animate-fade-in">
            <Badge 
              variant={changeAmount > 0 ? "default" : "secondary"}
              className="h-6 w-auto px-2 rounded-full text-xs font-bold animate-scale-in shadow-lg"
            >
              {changeAmount > 0 ? `+${changeAmount}` : changeAmount}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};