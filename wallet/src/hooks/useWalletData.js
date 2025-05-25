
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient.js';
import {
  getProfile,
  updateProfile,
  getTransactions,
  addTransaction,
  findProfileByAddress,
  performInternalTransfer
} from '@/services/supabaseService.js';
import { useToast } from '@/components/ui/use-toast.js';

export const useWalletData = (user, initialProfile, onProfileUpdateCallback, isTestnetMode) => {
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactionsList] = useState([]);
  const [address, setAddress] = useState('');
  const [walletName, setWalletNameState] = useState('');
  const [loading, setLoading] = useState(false);
  const [settingsClickedCount, setSettingsClickedCount] = useState(0);


  const syncProfileData = useCallback((profileData) => {
    if (profileData) {
      setBalance(parseFloat(profileData.btc_balance) || 0);
      setAddress(profileData.wallet_address || '');
      setWalletNameState(profileData.wallet_name || `Wallet-${profileData.email?.split('@')[0]}`);
      if (onProfileUpdateCallback) onProfileUpdateCallback(profileData);
    }
  }, [onProfileUpdateCallback]);

  useEffect(() => {
    if (initialProfile) {
        syncProfileData(initialProfile);
    }
  }, [initialProfile, syncProfileData]);


  useEffect(() => {
    const loadInitialSettingsClicks = () => {
      if (typeof window !== 'undefined') {
        const storedCount = localStorage.getItem('settingsClickedCount');
        if (storedCount) {
          setSettingsClickedCount(parseInt(storedCount, 10));
        }
      }
    };
    loadInitialSettingsClicks();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('settingsClickedCount', settingsClickedCount.toString());
    }
  }, [settingsClickedCount]);


  const fetchWalletData = useCallback(async () => {
    if (user?.id) {
      setLoading(true);
      try {
        const { data: profileData, error: profileError } = await getProfile(user.id);
        if (profileError && profileError.code !== 'PGRST116') {
          toast({ variant: "destructive", title: "Error Memuat Profil", description: `Gagal memuat profil: ${profileError.message}` });
        } else if (profileData) {
          syncProfileData(profileData);
        }
  
        const { data: transactionsData, error: transactionsError } = await getTransactions(user.id);
        if (transactionsError) {
          toast({ variant: "destructive", title: "Error Memuat Transaksi", description: `Gagal memuat transaksi: ${transactionsError.message}` });
        } else {
          setTransactionsList(transactionsData || []);
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Error Tidak Diketahui", description: "Terjadi kesalahan saat mengambil data wallet." });
      } finally {
        setLoading(false);
      }
    }
  }, [user, toast, syncProfileData]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);
  
  useEffect(() => {
    if (!user?.id) return;

    const profileSubscription = supabase
      .channel(`profiles:${user.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
        (payload) => {
          toast({ title: "Pembaruan Profil", description: "Saldo atau detail profil Anda telah diperbarui.", className: "bg-blue-600 text-white" });
          syncProfileData(payload.new);
        }
      )
      .subscribe();

    const transactionSubscription = supabase
      .channel(`transactions:${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newTx = payload.new;
          setTransactionsList(prevTxs => [newTx, ...prevTxs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
          if (newTx.type === 'internal_transfer_receive' || newTx.type === 'receive') {
            toast({ title: "Transaksi Baru", description: `Anda menerima ${newTx.amount} BTC.`, className: "bg-green-600 text-white" });
          } else if (newTx.type === 'internal_transfer_send' || newTx.type === 'send') {
             toast({ title: "Transaksi Terkirim", description: `Anda mengirim ${newTx.amount} BTC.`, className: "bg-orange-500 text-white" });
          }
          fetchWalletData(); 
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(profileSubscription);
      supabase.removeChannel(transactionSubscription);
    };
  }, [user, toast, fetchWalletData, syncProfileData]);

  const updateWalletName = async (newName) => {
    if (!user?.id) return;
    if (newName && newName.trim() !== "") {
      setLoading(true);
      const { data, error } = await updateProfile(user.id, { wallet_name: newName.trim() });
      if (error) {
        toast({ variant: "destructive", title: "Error", description: `Gagal update nama wallet: ${error.message}` });
      } else if (data) {
        setWalletNameState(data.wallet_name);
        toast({ title: "Nama Wallet Diperbarui", description: `Nama wallet diubah menjadi ${data.wallet_name}`, className: "bg-neutral-800 text-foreground border-neutral-700" });
      }
      setLoading(false);
    } else {
      toast({ variant: "destructive", title: "Error", description: "Nama wallet tidak boleh kosong." });
    }
  };

  const sendBitcoin = async (recipientAddress, amount, memo = '') => {
    if (!user?.id || !address) return;
    if (amount <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Jumlah harus lebih besar dari 0" });
      return false;
    }
    if (amount > balance) {
      toast({ variant: "destructive", title: "Saldo tidak cukup", description: "Anda tidak memiliki cukup Bitcoin untuk transaksi ini." });
      return false;
    }

    if (isTestnetMode) {
      const mainnetPatterns = /^(bc1|[13])/i;
      if (mainnetPatterns.test(recipientAddress)) {
        toast({
          variant: "destructive",
          title: "Alamat Tidak Valid (Mode Testnet)",
          description: "Anda mencoba mengirim ke alamat yang terlihat seperti mainnet. Dalam mode testnet tersamarkan, ini tidak diizinkan.",
          duration: 7000,
        });
        return false;
      }
    }


    setLoading(true);
    const { data: recipientProfile, error: findError } = await findProfileByAddress(recipientAddress);

    let success = false;
    if (recipientProfile && recipientProfile.id !== user.id) { 
      const { error: transferError } = await performInternalTransfer(user.id, recipientProfile.id, amount, balance, recipientProfile.btc_balance, memo);
      if (transferError) {
        toast({ variant: "destructive", title: "Transfer Internal Gagal", description: transferError.message });
      } else {
        toast({ title: "Transfer Internal Berhasil", description: `${amount} BTC dikirim ke ${recipientProfile.wallet_name || recipientAddress.substring(0,8)}...`, className: "bg-neutral-800 text-foreground border-neutral-700" });
        success = true;
      }
    } else if (findError && findError.code === 'PGRST116') { 
       const { error: txError } = await addTransaction({
        user_id: user.id,
        type: 'send',
        amount,
        recipient_address: recipientAddress,
        memo,
        status: 'pending' 
      });
      if (txError) {
        toast({ variant: "destructive", title: "Error Transaksi", description: `Gagal mencatat transaksi: ${txError.message}` });
      } else {
        toast({ title: "Transaksi Eksternal Dicatat (Pending)", description: `${amount} BTC akan dikirim ke ${recipientAddress.substring(0,8)}...`, className: "bg-neutral-800 text-foreground border-neutral-700" });
        success = true;
      }
    } else if (findError) {
        toast({ variant: "destructive", title: "Error Pencarian Penerima", description: findError.message });
    } else if (recipientProfile && recipientProfile.id === user.id) {
        toast({ variant: "destructive", title: "Error", description: "Tidak bisa mengirim ke alamat sendiri." });
    }
    setLoading(false);
    return success;
  };

  const receiveBitcoin = async (amount, senderAddress, memo = '') => {
    if (!user?.id) return;
    setLoading(true);
    const newBalance = parseFloat(balance) + parseFloat(amount);
    const { data: profileUpdateData, error: profileUpdateError } = await updateProfile(user.id, { btc_balance: newBalance });

    if (profileUpdateError) {
      toast({ variant: "destructive", title: "Error Update Saldo", description: `Gagal update saldo: ${profileUpdateError.message}` });
    } else if (profileUpdateData) {
      const { error: txError } = await addTransaction({
        user_id: user.id,
        type: 'receive',
        amount,
        sender_address: senderAddress,
        memo,
        status: 'completed'
      });
      if (txError) {
        toast({ variant: "destructive", title: "Error Transaksi", description: `Gagal mencatat transaksi: ${txError.message}` });
      } else {
        toast({ title: "Bitcoin Diterima", description: `${amount} BTC diterima dari ${senderAddress.substring(0, 8)}...`, className: "bg-neutral-800 text-foreground border-neutral-700" });
      }
    }
    setLoading(false);
  };

  const addTestBitcoin = () => {
    const amount = Math.random() * 0.1 + 0.01;
    receiveBitcoin(parseFloat(amount.toFixed(8)), 'TestFaucet', 'Dana uji coba');
  };

  const incrementSettingsClickedCount = () => {
    setSettingsClickedCount(prev => prev + 1);
  };


  return {
    balance,
    transactions,
    address,
    walletName,
    loading,
    settingsClickedCount,
    sendBitcoin,
    receiveBitcoin,
    addTestBitcoin,
    updateWalletName,
    fetchWalletData,
    incrementSettingsClickedCount
  };
};
