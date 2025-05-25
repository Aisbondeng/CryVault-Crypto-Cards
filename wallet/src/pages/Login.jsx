
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, loading, isPinSet, setIsPinVerified } = useWallet();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginUser(email, password);
    if (result && result.success) {
      setIsPinVerified(false); 
      if (isPinSet()) {
        navigate('/verify-pin');
      } else {
        navigate('/create-pin');
      }
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
            Masuk ke CryVault
          </h1>
          <p className="mt-2 text-muted-foreground">
            Akses dompet aman Anda.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">Alamat Email</Label>
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="Password Anda"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="#" className="font-medium text-primary hover:text-primary/80">
                Lupa password?
              </Link>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full safepal-gradient-button" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk'}
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold leading-6 text-primary hover:text-primary/80">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
