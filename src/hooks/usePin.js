import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast.js';
import { supabase } from '@/lib/supabaseClient';
import bcrypt from 'bcryptjs';

export const usePin = (userId) => {
  const { toast } = useToast();
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [pinError, setPinError] = useState('');
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [pinExists, setPinExists] = useState(false);

  useEffect(() => {
    const checkPin = async () => {
      if (!userId) return;
      const { data, error } = await supabase
        .from('user_pins')
        .select('user_id')
        .eq('user_id', userId)
        .single();
      setPinExists(!!data);
    };
    checkPin();
  }, [userId]);

  const setPin = async (newPin) => {
    if (!userId) {
      toast({ variant: "destructive", title: "Error", description: "Anda belum login." });
      return false;
    }
    if (newPin.length !== 6 || !/^\d{6}$/.test(newPin)) {
      setPinError("PIN harus 6 digit angka.");
      return false;
    }

    setIsPinLoading(true);
    const hashed = await bcrypt.hash(newPin, 10);

    const { error } = await supabase
      .from('user_pins')
      .upsert({ user_id: userId, pin_hash: hashed });

    if (error) {
      toast({ variant: "destructive", title: "Gagal Menyimpan PIN", description: error.message });
      setIsPinLoading(false);
      return false;
    }

    toast({ title: "PIN Berhasil Disimpan", className: "bg-green-600 text-white" });
    setIsPinVerified(true);
    setPinError('');
    setIsPinLoading(false);
    setPinExists(true);
    return true;
  };

  const verifyPin = async (enteredPin) => {
    if (!userId) return false;

    setIsPinLoading(true);
    const { data, error } = await supabase
      .from('user_pins')
      .select('pin_hash')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      setPinError("PIN belum diatur.");
      setIsPinLoading(false);
      return false;
    }

    const match = await bcrypt.compare(enteredPin, data.pin_hash);
    if (match) {
      setIsPinVerified(true);
      setPinError('');
      setIsPinLoading(false);
      return true;
    } else {
      setPinError("PIN salah. Silakan coba lagi.");
      setIsPinVerified(false);
      setIsPinLoading(false);
      return false;
    }
  };

  const removePin = async () => {
    if (!userId) return;
    const { error } = await supabase
      .from('user_pins')
      .delete()
      .eq('user_id', userId);

    if (!error) {
      toast({ title: "PIN Dihapus", description: "PIN berhasil dihapus.", className: "bg-neutral-800 text-white" });
      setIsPinVerified(false);
      setPinError('');
      setPinExists(false);
    }
  };

  const changePin = async (oldPin, newPin) => {
    const valid = await verifyPin(oldPin);
    if (!valid) {
      toast({ variant: "destructive", title: "PIN Lama Salah", description: "PIN lama tidak sesuai." });
      return false;
    }
    return await setPin(newPin);
  };

  const clearPinError = () => setPinError('');

  return {
    setPin,
    verifyPin,
    removePin,
    changePin,
    isPinVerified,
    setIsPinVerified,
    isPinLoading,
    pinError,
    clearPinError,
    isPinSet: () => pinExists
  };
};
