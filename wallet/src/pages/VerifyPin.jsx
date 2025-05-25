
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContext.jsx';
import { useToast } from '@/components/ui/use-toast.js';

const VerifyPin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyPin, loading, pinError, clearPinError, logoutUser, isAuthenticated, isPinSet } = useWallet();
  const { toast } = useToast();
  const [pin, setPinValue] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !isPinSet()) {
      navigate('/login');
    }
  }, [isAuthenticated, isPinSet, navigate]);

  const handleVerifyPin = async (e) => {
    e.preventDefault();
    clearPinError();
    if (pin.length !== 6) {
       toast({ variant: "destructive", title: "PIN Tidak Valid", description: "PIN harus terdiri dari 6 digit." });
      return;
    }
    const success = await verifyPin(pin);
    if (success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
       toast({ variant: "destructive", title: "PIN Salah", description: "PIN yang Anda masukkan tidak benar. Coba lagi." });
    }
  };
  
  const handlePinChange = (value) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 6) {
      setPinValue(numericValue);
    }
  };

  const handleForgotPin = async () => {
    toast({
      title: "Lupa PIN?",
      description: "Untuk keamanan, Anda akan diarahkan untuk login ulang. Setelah itu Anda dapat mengatur PIN baru.",
      duration: 7000,
    });
    await logoutUser(); 
    navigate('/login');
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
          <Lock className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-2xl font-semibold">Masukkan PIN Anda</h1>
          <p className="text-muted-foreground mt-1">
            Verifikasi identitas Anda untuk melanjutkan.
          </p>
        </div>

        <form onSubmit={handleVerifyPin} className="space-y-4">
          <div>
            <label htmlFor="pin" className="sr-only">PIN</label>
            <Input
              id="pin"
              type="password"
              inputMode="numeric"
              maxLength="6"
              value={pin}
              onChange={(e) => handlePinChange(e.target.value)}
              placeholder="Masukkan 6 digit PIN"
              className="text-center text-lg tracking-[0.5em] bg-neutral-800 border-neutral-700 h-12"
              required
            />
          </div>

          {pinError && <p className="text-sm text-red-500 text-center">{pinError}</p>}

          <Button type="submit" className="w-full safepal-gradient-button" disabled={loading}>
            {loading ? 'Memverifikasi...' : 'Buka Dompet'}
          </Button>
        </form>
        <div className="text-center">
          <Button variant="link" className="text-sm text-primary" onClick={handleForgotPin}>
            Lupa PIN?
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VerifyPin;
