import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/3e2dde41-40eb-4545-861b-01f9aa439f3c/c43c188b1fbb52d2b4a3ce5ba3e3b572.png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-background to-neutral-900 text-foreground flex flex-col items-center justify-center p-4 page-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center max-w-lg w-full"
      >
        <motion.div 
          className="mb-8 element-spacing" 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <img src={logoUrl} alt="CryVault App Logo" className="h-24 w-auto mx-auto" />
        </motion.div>
        
        <motion.h1 
          className="mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-pink-500 element-spacing-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Selamat Datang di CryVault
        </motion.h1>
        
        <motion.p 
          className="text-body-lg text-muted-foreground mb-8 element-spacing"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Kelola aset digital Anda dengan percaya diri dan mudah.
        </motion.p>

        <div className="grid grid-cols-1 gap-4 mb-10 section-spacing">
          <motion.div 
            className="p-4 bg-neutral-800/70 rounded-xl border border-neutral-700 shadow-lg element-spacing-sm"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Shield className="h-8 w-8 text-primary mb-2" />
            <h2 className="mb-1">Keamanan Terdepan</h2>
            <p className="text-caption text-muted-foreground">Aset Anda dilindungi dengan teknologi enkripsi canggih.</p>
          </motion.div>
          <motion.div 
            className="p-4 bg-neutral-800/70 rounded-xl border border-neutral-700 shadow-lg"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Zap className="h-8 w-8 text-yellow-400 mb-2" />
            <h2 className="mb-1">Transaksi Cepat</h2>
            <p className="text-caption text-muted-foreground">Kirim dan terima kripto dengan kecepatan kilat.</p>
          </motion.div>
        </div>

        <motion.div 
          className="space-y-3 flex flex-col items-center w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Button 
            size="lg" 
            className="w-full max-w-xs safepal-gradient-button text-primary-foreground font-bold"
            onClick={() => navigate('/register')}
          >
            Buat Akun Baru <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full max-w-xs border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
            onClick={() => navigate('/login')}
          >
            Masuk ke Akun
          </Button>
        </motion.div>
        
        <motion.p 
            className="mt-8 text-small text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
        >
            Dengan melanjutkan, Anda menyetujui <Link to="#" className="underline hover:text-primary">Ketentuan Layanan</Link> dan <Link to="#" className="underline hover:text-primary">Kebijakan Privasi</Link> kami.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Welcome;