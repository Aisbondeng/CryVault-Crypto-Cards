
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContext.jsx';
import { useToast } from '@/components/ui/use-toast.js';

const CreatePin = () => {
  const navigate = useNavigate();
  const { setPin, loading, pinError, clearPinError } = useWallet();
  const { toast } = useToast();
  const [pin, setPinValue] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleSetPin = async (e) => {
    e.preventDefault();
    clearPinError();
    if (pin.length !== 6 || !/^\d+$/.test(pin)) {
      toast({ variant: "destructive", title: "PIN Tidak Valid", description: "PIN harus terdiri dari 6 digit angka." });
      return;
    }
    if (pin !== confirmPin) {
      toast({ variant: "destructive", title: "PIN Tidak Cocok", description: "PIN dan konfirmasi PIN tidak sama." });
      return;
    }
    const success = await setPin(pin);
    if (success) {
      navigate('/');
    }
  };

  const handlePinChange = (value, type) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 6) {
      if (type === 'pin') setPinValue(numericValue);
      else if (type === 'confirmPin') setConfirmPin(numericValue);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4"
    >
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <KeyRound className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-2xl font-semibold">Buat PIN Keamanan</h1>
          <p className="text-muted-foreground mt-1">
            PIN ini akan digunakan untuk mengakses aplikasi.
          </p>
        </div>

        <form onSubmit={handleSetPin} className="space-y-4">
          <div>
            <label htmlFor="pin" className="sr-only">PIN</label>
            <Input
              id="pin"
              type="password" 
              inputMode="numeric"
              maxLength="6"
              value={pin}
              onChange={(e) => handlePinChange(e.target.value, 'pin')}
              placeholder="Masukkan 6 digit PIN"
              className="text-center text-lg tracking-[0.5em] bg-neutral-800 border-neutral-700 h-12"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-pin" className="sr-only">Konfirmasi PIN</label>
            <Input
              id="confirm-pin"
              type="password"
              inputMode="numeric"
              maxLength="6"
              value={confirmPin}
              onChange={(e) => handlePinChange(e.target.value, 'confirmPin')}
              placeholder="Konfirmasi PIN Anda"
              className="text-center text-lg tracking-[0.5em] bg-neutral-800 border-neutral-700 h-12"
              required
            />
          </div>

          {pinError && <p className="text-sm text-red-500 text-center">{pinError}</p>}

          <Button type="submit" className="w-full safepal-gradient-button" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
          </Button>
        </form>
         <p className="text-xs text-muted-foreground text-center">
          Pastikan Anda mengingat PIN ini. Jika lupa, Anda mungkin perlu mengatur ulang akun.
        </p>
      </div>
    </motion.div>
  );
};

export default CreatePin;
