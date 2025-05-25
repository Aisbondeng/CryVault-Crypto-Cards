
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, LogOut, UserCircle, Bell, Shield, Globe, Settings as SettingsIcon, Network, MapPin, Moon, Sun, Info, KeyRound, FileText, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Navigation from '@/components/layout/Navigation';
import { useWallet } from '@/contexts/WalletContext.jsx';
import { useToast } from '@/components/ui/use-toast.js';
import { Switch } from "@/components/ui/switch"; 
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';

const Settings = () => {
  const navigate = useNavigate();
  const { 
    logoutUser, 
    currentUser, 
    walletName, 
    updateWalletName, 
    addTestBitcoin, 
    settingsClickedCount, 
    isTestnetMode, 
    toggleTestnetMode 
  } = useWallet();
  const { toast } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [newWalletNameInput, setNewWalletNameInput] = useState('');
  const [showEditWalletName, setShowEditWalletName] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('crypvault_theme') === 'dark' || 
             (!('crypvault_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true; 
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('crypvault_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('crypvault_theme', 'light');
      }
    }
  }, [isDarkMode]);

  useEffect(() => {
    setNewWalletNameInput(walletName || '');
  }, [walletName]);

  const mapPinPressTimer = React.useRef(null);

  const handleMapPinMouseDown = () => {
    if (settingsClickedCount < 3) {
      toast({
        title: "Fitur Tersembunyi",
        description: `Klik ikon Pengaturan di Dashboard ${3 - settingsClickedCount}x lagi untuk mengaktifkan fitur ini.`,
        className: "bg-yellow-500 text-black"
      });
      return;
    }
    mapPinPressTimer.current = setTimeout(() => {
      addTestBitcoin();
      toast({
        title: "Mode Rahasia (MapPin) Aktif!",
        description: "0.01 - 0.1 BTC telah ditambahkan ke saldo Anda.",
        className: "bg-green-600 text-white border-green-700"
      });
    }, 5000); 
  };

  const handleMapPinMouseUpOrLeave = () => {
    if (mapPinPressTimer.current) {
      clearTimeout(mapPinPressTimer.current);
    }
  };
  
  const handleLogout = async () => {
    await logoutUser();
    setShowLogoutConfirm(false);
    navigate('/welcome');
  };

  const handleSaveWalletName = async () => {
    if (newWalletNameInput.trim() === '') {
      toast({ variant: "destructive", title: "Nama Wallet Kosong", description: "Nama wallet tidak boleh kosong." });
      return;
    }
    await updateWalletName(newWalletNameInput);
    setShowEditWalletName(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const settingsItems = [
    { id: 'wallet-management', icon: UserCircle, label: 'Manajemen Wallet', action: () => navigate('/wallet-management') },
    { id: 'node-settings', icon: Network, label: 'Pengaturan Node RPC', action: () => navigate('/settings/node') },
    { id: 'security', icon: Shield, label: 'Keamanan (PIN & Sidik Jari)', action: () => navigate('/settings/security') },
    { id: 'backup-phrase', icon: KeyRound, label: 'Backup Mnemonic Phrase', action: () => navigate('/settings/backup-phrase') },
    { id: 'notifications', icon: Bell, label: 'Notifikasi', action: () => navigate('/notifications') },
    { id: 'preferences', icon: Globe, label: 'Preferensi (Bahasa & Mata Uang)', action: () => toast({ title: 'Segera Hadir', description: 'Pengaturan preferensi akan segera tersedia.' }) },
    { id: 'about', icon: BookOpen, label: 'Tentang CryVault', action: () => toast({ title: 'CryVault v1.0.0', description: 'Dompet kripto aman dan terpercaya.' }) },
  ];

  return (
    <div className="min-h-screen pb-24 bg-background text-foreground">
      <header className="p-4 sticky top-0 bg-background z-10 border-b border-neutral-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Pengaturan</h1>
          {settingsClickedCount >= 3 && (
             <Button 
                variant="ghost" 
                size="icon" 
                onMouseDown={handleMapPinMouseDown}
                onMouseUp={handleMapPinMouseUpOrLeave}
                onMouseLeave={handleMapPinMouseUpOrLeave}
                onTouchStart={handleMapPinMouseDown}
                onTouchEnd={handleMapPinMouseUpOrLeave}
                className="text-muted-foreground hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0 opacity-50 hover:opacity-100 transition-opacity"
                aria-label="Fitur Tersembunyi MapPin"
              >
                <MapPin className="h-5 w-5" />
              </Button>
          )}
        </div>
      </header>
      
      <main className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6 bg-neutral-800 border-neutral-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">{walletName || (currentUser?.email && `Wallet-${currentUser.email.split('@')[0]}`)}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setNewWalletNameInput(walletName || ''); setShowEditWalletName(true); }}>
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground break-all">{currentUser?.email}</p>
            </CardContent>
          </Card>

          <div className="space-y-2 mb-6">
            {settingsItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-between items-center p-4 h-auto bg-neutral-800 hover:bg-neutral-700/80 border border-neutral-700 rounded-lg text-left"
                onClick={item.action}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </Button>
            ))}
          </div>

          <Card className="mb-6 bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-base">Tampilan & Fitur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-neutral-900/50 rounded-md border border-neutral-700/50">
                <div className="flex items-center">
                  {isDarkMode ? <Moon className="h-5 w-5 mr-3 text-primary" /> : <Sun className="h-5 w-5 mr-3 text-primary" />}
                  <Label htmlFor="theme-switch" className="text-sm">Mode Gelap</Label>
                </div>
                <Switch
                  id="theme-switch"
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-900/50 rounded-md border border-neutral-700/50">
                <div className="flex items-center">
                  <Info className="h-5 w-5 mr-3 text-primary" />
                  <Label htmlFor="testnet-switch" className="text-sm">Mode Testnet (Tersamarkan)</Label>
                </div>
                <Switch
                  id="testnet-switch"
                  checked={isTestnetMode}
                  onCheckedChange={toggleTestnetMode}
                />
              </div>
            </CardContent>
          </Card>
          
          <Button
            variant="destructive"
            className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 text-red-400"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </motion.div>
      </main>

      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="bg-neutral-800 border-neutral-700 text-foreground">
          <DialogHeader>
            <DialogTitle>Konfirmasi Keluar</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Apakah Anda yakin ingin keluar dari akun Anda?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="border-neutral-600 hover:bg-neutral-700" onClick={() => setShowLogoutConfirm(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleLogout}>Keluar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditWalletName} onOpenChange={setShowEditWalletName}>
        <DialogContent className="bg-neutral-800 border-neutral-700 text-foreground">
          <DialogHeader>
            <DialogTitle>Ubah Nama Wallet</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Masukkan nama baru untuk wallet Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              value={newWalletNameInput}
              onChange={(e) => setNewWalletNameInput(e.target.value)}
              placeholder="Nama Wallet Baru"
              className="bg-neutral-900 border-neutral-700"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-neutral-600 hover:bg-neutral-700" onClick={() => setShowEditWalletName(false)}>Batal</Button>
            <Button className="safepal-gradient-button" onClick={handleSaveWalletName}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Navigation />
    </div>
  );
};

export default Settings;
