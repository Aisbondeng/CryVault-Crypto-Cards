
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Copy, Scan, Settings as SettingsIcon, Hexagon } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import AssetTabs from '@/components/dashboard/AssetTabs';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext.jsx';
import { useToast } from '@/components/ui/use-toast.js';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ walletName, displayAddress, onHeaderAreaClick, onCopyAddress, onScanClick, onNotificationsClick, onSettingsClick }) => (
  <header className="p-3 sticky top-0 bg-background z-50 border-b border-neutral-700/80 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={onHeaderAreaClick}>
        <Hexagon className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-sm font-semibold leading-tight">{walletName}</h1>
          <div className="flex items-center">
            <span className="text-xs text-muted-foreground mr-1 truncate max-w-[100px] sm:max-w-[150px]">{displayAddress}</span>
            <Copy className="h-3 w-3 text-muted-foreground hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); onCopyAddress(); }}/>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1.5">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onScanClick}>
          <Scan className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNotificationsClick}>
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onSettingsClick}>
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </header>
);


const Dashboard = () => {
  const { 
    walletName, 
    displayAddress, 
    addTestBitcoin, 
    incrementSettingsClickedCount,
    fetchWalletData,
    currentUser
  } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [headerClickCount, setHeaderClickCount] = useState(0);

  useEffect(() => {
    if (currentUser?.id) {
      fetchWalletData();
    }
  }, [currentUser, fetchWalletData]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Disalin!",
      description: "Alamat wallet telah disalin ke clipboard.",
      className: "bg-neutral-800 text-foreground border-neutral-700"
    });
  };

  const handleHeaderAreaClick = () => {
    const newCount = headerClickCount + 1;
    setHeaderClickCount(newCount);

    if (newCount >= 5) {
      addTestBitcoin();
      toast({
        title: "Mode Rahasia (Header) Aktif!",
        description: "0.01 - 0.1 BTC telah ditambahkan ke saldo Anda.",
        className: "bg-green-600 text-white border-green-700"
      });
      setHeaderClickCount(0); 
    } else if (newCount >= 2 && newCount < 5) {
       toast({
        title: "Hmm...",
        description: `Anda mengklik header ${newCount} kali. ${5-newCount} klik lagi untuk sesuatu yang menarik!`,
        className: "bg-yellow-500 text-black"
      });
    }
  };
  
  const handleSettingsClick = () => {
    incrementSettingsClickedCount();
    navigate('/settings');
  };


  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground pb-16">
      <DashboardHeader
        walletName={walletName}
        displayAddress={displayAddress}
        onHeaderAreaClick={handleHeaderAreaClick}
        onCopyAddress={() => copyToClipboard(displayAddress)}
        onScanClick={() => navigate('/dapps')}
        onNotificationsClick={() => navigate('/notifications')}
        onSettingsClick={handleSettingsClick}
      />
      
      <div className="flex-grow overflow-y-auto px-3">
        <AssetTabs />
      </div>
      
      <Navigation />
    </div>
  );
};

export default Dashboard;
