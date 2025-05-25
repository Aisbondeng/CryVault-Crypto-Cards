
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext.jsx';
import { useToast } from '@/components/ui/use-toast.js';

const Register = () => {
  const navigate = useNavigate();
  const { registerUser, loading, setIsPinVerified } = useWallet();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Error", description: "Password tidak cocok!" });
      return;
    }
    const result = await registerUser(email, password);
    if (result && result.success) {
      setIsPinVerified(false); 
      navigate('/create-pin'); 
    }
  };


  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4"
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
           <img 
            src="https://storage.googleapis.com/hostinger-horizons-assets-prod/3e2dde41-40eb-4545-861b-01f9aa439f3c/c43c188b1fbb52d2b4a3ce5ba3e3b572.png" 
            alt="CryVault Logo" 
            className="mx-auto h-16 w-auto mb-6"
          />
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-blue-600">
            Buat Akun CryVault
          </h1>
          <p className="mt-2 text-muted-foreground">
            Mulai perjalanan crypto Anda dengan aman.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <Label htmlFor="email">Alamat Email</Label>
             <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="anda@contoh.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="mt-1 relative rounded-md shadow-sm">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="Minimal 8 karakter"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="confirm-password">Konfirmasi Password</Label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                placeholder="Ulangi password Anda"
              />
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input id="terms" name="terms" type="checkbox" required className="focus:ring-primary h-4 w-4 text-primary border-muted-foreground rounded"/>
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-muted-foreground">
                Saya setuju dengan <a href="#" className="text-primary hover:text-primary/80">Ketentuan Layanan</a>
              </label>
            </div>
          </div>


          <div>
            <Button type="submit" className="w-full safepal-gradient-button" disabled={loading}>
               {loading ? 'Memproses...' : 'Daftar'}
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold leading-6 text-primary hover:text-primary/80">
            Masuk di sini
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
