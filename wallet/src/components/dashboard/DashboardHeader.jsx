
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Bell, ChevronDown, Copy, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';

const DashboardHeader = ({ onHeaderAreaClick, onSecretSettingsClick }) => {
  const navigate = useNavigate();
  const { walletName, address } = useWallet();
  const { toast } = useToast();

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Alamat Disalin!",
      description: "Alamat wallet Anda telah disalin ke clipboard.",
      className: "bg-neutral-800 text-foreground border-neutral-700"
    });
  };

  return (
    <header className="py-3 h-[56px] flex items-center sticky top-0 z-40 bg-background">
      <div className="flex items-center flex-1" onClick={onHeaderAreaClick} style={{ cursor: 'pointer' }}>
        <Button variant="ghost" size="icon" className="h-9 w-9 mr-2" onClick={(e) => { e.stopPropagation(); onSecretSettingsClick(); }}>
          <Hexagon className="h-6 w-6 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 mr-3" onClick={(e) => { e.stopPropagation(); navigate('/notifications'); }}>
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" className="p-0 h-auto" onClick={(e) => { e.stopPropagation(); navigate('/wallet-management'); }}>
          <div className="flex items-center">
            <span className="text-[18px] font-semibold">{walletName}</span>
            <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground" />
          </div>
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 ml-1.5" onClick={(e) => { e.stopPropagation(); copyAddress(); }}>
          <Copy className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate('/dapps')}>
          <Scan className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
