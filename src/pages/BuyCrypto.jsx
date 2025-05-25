import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/layout/Navigation';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';

const BuyCrypto = () => {
  const navigate = useNavigate();
  const { walletName } = useWallet();

  const paymentMethods = [
    { name: "Kartu Kredit/Debit", icon: CreditCard, provider: "Simplex / MoonPay" },
    { name: "Transfer Bank", icon: Banknote, provider: "Mitra Lokal" },
    { name: "P2P Trading", icon: ShieldCheck, provider: "Platform P2P Terintegrasi" },
  ];

  return (
    <div className="min-h-screen pb-24 bg-background text-foreground">
      <header className="p-4 sticky top-0 bg-background z-10 border-b border-neutral-700">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Beli Kripto</h1>
        </div>
      </header>
      
      <main className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <Card className="bg-neutral-800 border-neutral-700 rounded-lg">
            <CardHeader>
              <CardTitle className="text-base">Pilih Metode Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentMethods.map(method => (
                <Button key={method.name} variant="outline" className="w-full justify-start h-auto py-3 bg-neutral-700/30 hover:bg-neutral-700 border-neutral-600">
                  <method.icon className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{method.name}</p>
                    <p className="text-xs text-muted-foreground">{method.provider}</p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-neutral-800 border-neutral-700 rounded-lg">
            <CardContent className="p-4 text-center">
              <img  alt="Buy crypto illustration" className="w-32 h-32 mx-auto mb-3" src="https://images.unsplash.com/photo-1642751226411-ea5f2442be20" />
              <h3 className="text-md font-semibold mb-1">Beli Bitcoin dengan Mudah</h3>
              <p className="text-xs text-muted-foreground">
                Pilih metode pembayaran yang paling sesuai untuk Anda. Transaksi aman dan cepat.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default BuyCrypto;