
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth.js';
import { useWalletData } from '@/hooks/useWalletData.js';
import { useNodeSettings } from '@/hooks/useNodeSettings.js';
import { usePin } from '@/hooks/usePin.js';
import { useToast } from '@/components/ui/use-toast.js';

const WalletContext = createContext(null);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const { toast } = useToast();
  const authHook = useAuth();
  const pinHook = usePin(authHook.user?.id); 
  
  const [isTestnetMode, setIsTestnetMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('crypvault_isTestnetMode');
      return savedMode ? JSON.parse(savedMode) : true; 
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('crypvault_isTestnetMode', JSON.stringify(isTestnetMode));
    }
  }, [isTestnetMode]);

  const toggleTestnetMode = useCallback(() => {
    setIsTestnetMode(prev => {
      const newMode = !prev;
      toast({
        title: `Mode ${newMode ? 'Testnet (Tersamarkan)' : 'Mainnet (Simulasi)'} ${newMode ? 'Aktif' : 'Nonaktif'}`,
        description: newMode ? "Alamat akan disamarkan, transaksi tetap di lingkungan simulasi." : "Menampilkan mode standar.",
        className: "bg-blue-600 text-white"
      });
      return newMode;
    });
  }, [toast]);

  const walletDataHook = useWalletData(authHook.user, authHook.profile, authHook.setProfile, isTestnetMode);
  const nodeSettingsHookValues = useNodeSettings();

  const getDisplayAddress = useCallback((actualAddress) => {
    if (isTestnetMode && actualAddress && actualAddress.startsWith('tb1')) {
      return 'bc1' + actualAddress.substring(3);
    }
    return actualAddress;
  }, [isTestnetMode]);
  
  const isInitialLoading = !authHook.isAuthInitialized || pinHook.isPinLoading;

  const contextValue = {
    currentUser: authHook.user ? { id: authHook.user.id, email: authHook.user.email, ...authHook.profile } : null, 
    isAuthenticated: authHook.isAuthenticated,
    isInitialLoading,
    loading: authHook.authLoading || walletDataHook.loading || nodeSettingsHookValues.isLoadingNode || authHook.loading, 
    
    loginUser: authHook.login,
    registerUser: authHook.register,
    logoutUser: async () => {
      await authHook.logout();
      pinHook.removePin(); 
      pinHook.setIsPinVerified(false);
    },
    
    balance: walletDataHook.balance,
    transactions: walletDataHook.transactions,
    address: walletDataHook.address, 
    displayAddress: getDisplayAddress(walletDataHook.address), 
    walletName: walletDataHook.walletName,
    settingsClickedCount: walletDataHook.settingsClickedCount,
    sendBitcoin: walletDataHook.sendBitcoin,
    receiveBitcoin: walletDataHook.receiveBitcoin,
    addTestBitcoin: walletDataHook.addTestBitcoin,
    updateWalletName: walletDataHook.updateWalletName,
    fetchWalletData: walletDataHook.fetchWalletData,
    incrementSettingsClickedCount: walletDataHook.incrementSettingsClickedCount,

    nodeSettings: nodeSettingsHookValues,

    isTestnetMode,
    toggleTestnetMode,

    pinState: pinHook.pinState,
    setPin: pinHook.setPin,
    verifyPin: pinHook.verifyPin,
    removePin: pinHook.removePin,
    changePin: pinHook.changePin,
    isPinSet: pinHook.isPinSet,
    isPinVerified: pinHook.isPinVerified,
    setIsPinVerified: pinHook.setIsPinVerified,
    pinError: pinHook.pinError,
    clearPinError: pinHook.clearPinError,
    isPinLoading: pinHook.isPinLoading,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};
