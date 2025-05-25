
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Navigation from '@/components/layout/Navigation';
import QRCode from '@/components/wallet/QRCode';
import { useWallet } from '@/contexts/WalletContext.jsx';
import { useNavigate } from 'react-router-dom';

const Receive = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address, displayAddress, isTestnetMode } = useWallet(); // Use actual address for QR, displayAddress for UI
  const [copied, setCopied] = useState(false);
  
  const addressToDisplay = displayAddress || "Memuat alamat...";
  const addressForQR = address || ""; // QR code should use the real, functional address

  const copyToClipboard = () => {
    if (!addressToDisplay || addressToDisplay === "Memuat alamat...") {
      toast({
        variant: "destructive",
        title: "Alamat tidak tersedia",
        description: "Alamat wallet belum dimuat. Silakan coba lagi.",
      });
      return;
    }
    navigator.clipboard.writeText(addressToDisplay);
    setCopied(true);
    toast({
      title: "Alamat disalin",
      description: `Alamat Bitcoin ${isTestnetMode ? "(disamarkan)" : ""} berhasil disalin.`,
      className: "bg-neutral-800 text-foreground border-neutral-700"
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const shareAddress = () => {
    if (!addressToDisplay || addressToDisplay === "Memuat alamat...") {
      toast({
        variant: "destructive",
        title: "Alamat tidak tersedia",
        description: "Alamat wallet belum dimuat. Silakan coba lagi.",
      });
      return;
    }
    if (navigator.share) {
      navigator.share({
        title: 'Alamat Bitcoin Saya',
        text: `Ini alamat Bitcoin saya: ${addressToDisplay}`,
      })
      .catch((error) => {
         toast({
            variant: "destructive",
            title: "Gagal berbagi",
            description: "Tidak dapat berbagi alamat saat ini.",
            className: "bg-neutral-800 text-foreground border-neutral-700"
          })
      });
    } else {
      copyToClipboard(); 
    }
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
          <h1 className="text-xl font-semibold">Terima BTC</h1>
        </div>
      </header>
      
      <main className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Card className="bg-neutral-800 border-neutral-700 rounded-lg shadow-md w-full max-w-md">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="mb-6 mt-2">
                {addressForQR ? <QRCode address={addressForQR} size={180} /> : <div className="w-[180px] h-[180px] bg-neutral-700 flex items-center justify-center rounded-md"><p className="text-muted-foreground text-xs">Memuat QR Code...</p></div>}
              </div>
              
              <div className="w-full space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="address" className="text-xs text-muted-foreground">Alamat Bitcoin Anda {isTestnetMode && <span className="text-primary/80">(Disamarkan)</span>}</Label>
                  <div className="relative">
                    <Input
                      id="address"
                      value={addressToDisplay}
                      readOnly
                      className="bg-neutral-900 border-neutral-700 pr-10 font-mono text-xs h-12"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10"
                      onClick={copyToClipboard}
                      disabled={!addressToDisplay || addressToDisplay === "Memuat alamat..."}
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-green-400" />
                      ) : (
                        <Copy className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    className="flex-1 safepal-gradient-button text-primary-foreground font-semibold"
                    onClick={copyToClipboard}
                    disabled={!addressToDisplay || addressToDisplay === "Memuat alamat..."}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Salin
                  </Button>
                  <Button 
                    className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-primary-foreground"
                    variant="secondary"
                    onClick={shareAddress}
                    disabled={!addressToDisplay || addressToDisplay === "Memuat alamat..."}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Bagikan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center text-muted-foreground text-xs max-w-xs">
            <p>Pindai kode QR atau salin alamat di atas untuk menerima Bitcoin. Pastikan alamat sudah benar.</p>
            {isTestnetMode && <p className="text-primary/80 mt-1">Anda sedang dalam mode Testnet Tersamarkan. Alamat yang ditampilkan mungkin berbeda dari alamat fungsional QR Code.</p>}
          </div>
        </motion.div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Receive;
