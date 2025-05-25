
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, ShoppingCart, BarChart2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ActionButtons = () => {
  const navigate = useNavigate();
  const actionButtonsList = [
    { label: "Kirim", icon: ArrowUp, path: "/send" },
    { label: "Terima", icon: ArrowDown, path: "/receive" },
    { label: "Beli", icon: ShoppingCart, path: "/buy" },
    { label: "Index", icon: BarChart2, path: "/market" },
    { label: "Lebih", icon: MoreHorizontal, path: "/settings" },
  ];

  return (
    <div className="grid grid-cols-5 gap-x-2 mb-6 element-spacing">
      {actionButtonsList.map(action => (
        <Button
          key={action.label}
          variant="ghost"
          className="flex flex-col items-center h-auto py-2 px-1 bg-transparent hover:bg-neutral-700/50 text-small"
          onClick={() => action.path && navigate(action.path)}
        >
          <div className="p-2.5 bg-neutral-700/60 rounded-full mb-1.5">
            <action.icon className="h-4 w-4 text-foreground" />
          </div>
          <span className="text-[11px]">{action.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default ActionButtons;
