
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast.js';


const FAKE_SALT = "someRandomSaltForCryVault"; 

const hashPin = async (pin, salt) => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + salt);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
  
  let simpleHash = 0;
  const str = pin + salt;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    simpleHash = ((simpleHash << 5) - simpleHash) + char;
    simpleHash |= 0; 
  }
  return simpleHash.toString(16);
};


export const usePin = (userId) => {
  const { toast } = useToast();
  const [pinState, setPinState] = useState(null); 
  const [isPinVerified, setIsPinVerifiedState] = useState(false);
  const [pinError, setPinError] = useState('');
  const [isPinLoading, setIsPinLoading] = useState(true);

  const getPinKey = useCallback(() => `crypvault_pin_${userId || 'guest'}`, [userId]);

  useEffect(() => {
    setIsPinLoading(true);
    if (userId) {
      const storedPinHash = localStorage.getItem(getPinKey());
      setPinState(storedPinHash);
    } else {
      setPinState(null); 
    }
    setIsPinVerifiedState(false); 
    setIsPinLoading(false);
  }, [userId, getPinKey]);

  const setPin = async (newPin) => {
    if (!userId) {
      toast({ variant: "destructive", title: "Error", description: "User tidak terautentikasi untuk mengatur PIN." });
      return false;
    }
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      setPinError("PIN harus 6 digit angka.");
      toast({ variant: "destructive", title: "PIN Tidak Valid", description: "PIN harus terdiri dari 6 digit angka." });
      return false;
    }
    setIsPinLoading(true);
    const hashedPin = await hashPin(newPin, FAKE_SALT);
    localStorage.setItem(getPinKey(), hashedPin);
    setPinState(hashedPin);
    setIsPinVerifiedState(true); 
    setPinError('');
    toast({ title: "PIN Berhasil Diatur", description: "PIN Anda telah disimpan dengan aman.", className: "bg-green-600 text-white" });
    setIsPinLoading(false);
    return true;
  };

  const verifyPin = async (enteredPin) => {
    if (!userId) return false;
    if (!pinState) {
      setPinError("PIN belum diatur.");
      return false;
    }
    if (enteredPin.length !== 6 || !/^\d+$/.test(enteredPin)) {
      setPinError("PIN harus 6 digit angka.");
      return false;
    }
    setIsPinLoading(true);
    const hashedEnteredPin = await hashPin(enteredPin, FAKE_SALT);
    if (hashedEnteredPin === pinState) {
      setIsPinVerifiedState(true);
      setPinError('');
      setIsPinLoading(false);
      return true;
    } else {
      setPinError("PIN salah. Silakan coba lagi.");
      setIsPinLoading(false);
      return false;
    }
  };

  const removePin = () => {
    if (!userId) return;
    localStorage.removeItem(getPinKey());
    setPinState(null);
    setIsPinVerifiedState(false);
    setPinError('');
    toast({ title: "PIN Dihapus", description: "Login dengan PIN telah dinonaktifkan.", className: "bg-neutral-800 text-foreground border-neutral-700" });
  };

  const changePin = async (oldPin, newPin) => {
    if (!userId) return false;
    const isOldPinValid = await verifyPin(oldPin);
    if (!isOldPinValid) {
      setPinError("PIN lama salah.");
      toast({ variant: "destructive", title: "Gagal Mengubah PIN", description: "PIN lama yang Anda masukkan salah." });
      return false;
    }
    
    const resultSet = await setPin(newPin);
    if (resultSet) {
        toast({ title: "PIN Berhasil Diubah", description: "PIN Anda telah diperbarui.", className: "bg-green-600 text-white" });
    }
    return resultSet;
  };

  const isPinSet = useCallback(() => {
    return !!localStorage.getItem(getPinKey());
  }, [getPinKey]);

  const clearPinError = () => {
    setPinError('');
  };
  
  const setIsPinVerified = (status) => {
    setIsPinVerifiedState(status);
  };


  return { 
    pinState, 
    setPin, 
    verifyPin, 
    removePin, 
    changePin, 
    isPinSet, 
    isPinVerified, 
    setIsPinVerified,
    pinError, 
    clearPinError,
    isPinLoading
  };
};
