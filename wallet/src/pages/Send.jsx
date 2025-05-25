
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send as SendIcon, QrCode as QrCodeScan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import Navigation from '@/components/layout/Navigation';
import { useWallet } from '@/contexts/WalletContext';
import { useNavigate } from 'react-router-dom';

const Send = () => {
  const navigate = useNavigate();
  const { balance, sendBitcoin, loading } = useWallet();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipient || !amount || parseFloat(amount) <= 0) { 
        // Removed parseFloat(amount) > balance check for now, as Supabase transfer handles it.
        // Client-side check can be added back if preferred for immediate UI feedback.
        return;
    }
    setShowConfirm(true);
  };
  
  const handleConfirmSend = async () => {
    await sendBitcoin(recipient, parseFloat(amount), memo);
    setShowConfirm(false);
    
    setTimeout(() => {
      navigate('/');
    }, 1800);
  };
  
  return (
    <div className="min-h-screen pb-24 bg-background text-foreground">
      <header className="p-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Kirim BTC</h1>
        </div>
      </header>
      
      <main className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-neutral-800 border-neutral-700 rounded-lg shadow-md">
            <CardContent className="p-4">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="recipient" className="text-xs text-muted-foreground">Alamat Penerima</Label>
                    <div className="relative">
                      <Input
                        id="recipient"
                        className="bg-neutral-900 border-neutral-700 pr-10"
                        placeholder="Masukkan alamat Bitcoin"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        required
                      />
                      <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8">
                        <QrCodeScan className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="amount" className="text-xs text-muted-foreground">Jumlah (BTC)</Label>
                      <span className="text-xs text-muted-foreground">
                        Saldo: {balance.toFixed(5)} BTC
                      </span>
                    </div>
                    <Input
                      id="amount"
                      type="number"
                      className="bg-neutral-900 border-neutral-700"
                      step="0.00000001"
                      min="0.00000001"
                      placeholder="0.00000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="memo" className="text-xs text-muted-foreground">Memo (Opsional)</Label>
                    <Input
                      id="memo"
                      className="bg-neutral-900 border-neutral-700"
                      placeholder="Tambahkan catatan transaksi"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full safepal-gradient-button text-primary-foreground font-semibold"
                    disabled={!recipient || !amount || parseFloat(amount) <= 0 || loading}
                  >
                    {loading ? 'Memproses...' : 'Lanjutkan'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="mt-4">
            <Card className="bg-neutral-800 border-neutral-700 rounded-lg shadow-md">
              <CardContent className="p-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Biaya Jaringan (Simulasi)</span>
                  <span className="text-primary">0.00001 BTC ≈ $0.65</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
      
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="bg-neutral-800 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-lg">Konfirmasi Transaksi</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Anda akan mengirim {amount} BTC ke alamat berikut:
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-3">
            <div className="bg-neutral-900 p-2 rounded-md text-xs font-mono break-all text-muted-foreground">
              {recipient}
            </div>
            
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah:</span>
                <span className="font-medium">{amount} BTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya Jaringan (Simulasi):</span>
                <span>0.00001 BTC</span>
              </div>
              <div className="flex justify-between border-t border-neutral-700 pt-1 mt-1">
                <span className="text-muted-foreground">Total (Simulasi):</span>
                <span className="font-medium text-primary">{(parseFloat(amount || 0) + 0.00001).toFixed(8)} BTC</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" className="border-neutral-600 hover:bg-neutral-700" onClick={() => setShowConfirm(false)}>
              Batal
            </Button>
            <Button 
              className="safepal-gradient-button text-primary-foreground font-semibold"
              onClick={handleConfirmSend}
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Konfirmasi & Kirim'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Navigation />
    </div>
  );
};

export default Send;
