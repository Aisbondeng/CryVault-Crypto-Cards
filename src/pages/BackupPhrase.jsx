
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Check, ShieldAlert as ShieldWarning, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/contexts/WalletContext.jsx';
import { useToast } from '@/components/ui/use-toast.js';
import { generateMnemonic } from '@/lib/utils.js'; 

const BackupPhrase = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPinSet, verifyPin, pinError, clearPinError, loading: pinLoading } = useWallet();
  
  const [mnemonic, setMnemonic] = useState('');
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [pinToVerify, setPinToVerify] = useState('');
  const [isPinVerifiedForBackup, setIsPinVerifiedForBackup] = useState(false);
  const [mnemonicCopied, setMnemonicCopied] = useState(false);

  useEffect(() => {
    if (isPinVerifiedForBackup) {
      setMnemonic(generateMnemonic()); 
    }
  }, [isPinVerifiedForBackup]);

  const handleVerifyPinForBackup = async () => {
    clearPinError();
    if (!isPinSet()) {
        toast({variant: "destructive", title: "PIN Belum Diatur", description: "Silakan atur PIN keamanan terlebih dahulu."});
        navigate('/settings/security');
        return;
    }
    if (pinToVerify.length !== 6) {
      toast({ variant: "destructive", title: "PIN Tidak Valid", description: "PIN harus 6 digit." });
      return;
    }
    const success = await verifyPin(pinToVerify);
    if (success) {
      setIsPinVerifiedForBackup(true);
      setPinToVerify('');
      toast({ title: "PIN Terverifikasi", description: "Mnemonic phrase Anda siap ditampilkan.", className: "bg-green-600 text-white" });
    } else {
      toast({ variant: "destructive", title: "PIN Salah", description: pinError || "PIN yang dimasukkan salah." });
    }
  };

  const copyMnemonicToClipboard = () => {
    navigator.clipboard.writeText(mnemonic);
    setMnemonicCopied(true);
    toast({
      title: "Mnemonic Disalin",
      description: "Pastikan untuk menyimpannya di tempat yang aman!",
      className: "bg-green-600 text-white"
    });
    setTimeout(() => setMnemonicCopied(false), 3000);
  };
  
  const handlePinInputChange = (value) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 6) {
      setPinToVerify(numericValue);
    }
  };

  if (!isPinVerifiedForBackup) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-6"
        >
          <header className="fixed top-0 left-0 right-0 p-3 bg-background z-10 flex items-center border-b border-neutral-700">
            <Button variant="ghost" size="icon" className="mr-2 h-8 w-8" onClick={() => navigate('/settings')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Verifikasi PIN</h1>
          </header>
          <div className="pt-16 text-center">
             <ShieldWarning className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <h2 className="text-xl font-semibold">Verifikasi PIN untuk Keamanan</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Masukkan PIN Anda untuk melihat Mnemonic Phrase.
            </p>
          </div>
          <div className="space-y-3">
            <Input
              type="password"
              inputMode="numeric"
              maxLength="6"
              placeholder="Masukkan 6 digit PIN"
              value={pinToVerify}
              onChange={(e) => handlePinInputChange(e.target.value)}
              className="text-center text-lg tracking-[0.5em] bg-neutral-800 border-neutral-700 h-12"
            />
            {pinError && <p className="text-xs text-red-500 text-center">{pinError}</p>}
            <Button className="w-full safepal-gradient-button" onClick={handleVerifyPinForBackup} disabled={pinLoading}>
              {pinLoading ? 'Memverifikasi...' : 'Verifikasi & Tampilkan'}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <header className="p-3 sticky top-0 bg-background z-10 flex items-center border-b border-neutral-700">
        <Button variant="ghost" size="icon" className="mr-2 h-8 w-8" onClick={() => navigate('/settings')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Backup Mnemonic Phrase</h1>
      </header>

      <main className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="bg-yellow-600/10 border-yellow-500/50 text-yellow-200">
            <CardHeader className="flex-row items-center space-x-3 pb-2">
              <ShieldWarning className="h-6 w-6 text-yellow-400 flex-shrink-0" />
              <CardTitle className="text-base text-yellow-300">PERINGATAN KEAMANAN PENTING</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1.5">
              <p>Mnemonic Phrase ini adalah KUNCI UTAMA ke dompet Anda. JANGAN pernah bagikan dengan siapapun.</p>
              <p>Simpan di tempat yang aman dan offline. Kehilangan phrase ini berarti kehilangan akses ke aset Anda.</p>
              <p>CryVault tidak akan pernah meminta Mnemonic Phrase Anda.</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-base">Mnemonic Phrase Anda (Simulasi)</CardTitle>
              <CardDescription className="text-xs">
                Tulis atau salin phrase ini dalam urutan yang benar dan simpan di tempat yang aman.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-md border border-neutral-600 bg-neutral-900/50 relative ${!showMnemonic && 'blur-sm select-none'}`}>
                <p className="text-lg font-mono leading-relaxed text-center text-primary tracking-wider">
                  {mnemonic.split(" ").map((word, index) => (
                    <span key={index} className="inline-block mr-2 mb-1">
                      <span className="text-xs text-muted-foreground/70 mr-0.5">{index + 1}.</span>{word}
                    </span>
                  ))}
                </p>
                {!showMnemonic && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/70 rounded-md">
                    <Button variant="outline" onClick={() => setShowMnemonic(true)}>
                      <Eye className="h-4 w-4 mr-2" /> Tampilkan Phrase
                    </Button>
                  </div>
                )}
              </div>
              {showMnemonic && (
                <div className="flex items-center justify-between mt-3">
                   <Button variant="ghost" size="sm" onClick={() => setShowMnemonic(false)}>
                      <EyeOff className="h-4 w-4 mr-2" /> Sembunyikan
                    </Button>
                  <Button variant="outline" size="sm" onClick={copyMnemonicToClipboard}>
                    {mnemonicCopied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                    {mnemonicCopied ? 'Disalin!' : 'Salin Phrase'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Button className="w-full safepal-gradient-button" onClick={() => navigate('/settings')}>
            Selesai & Kembali ke Pengaturan
          </Button>
           <p className="text-xs text-muted-foreground text-center mt-2">
            Ingat: Mnemonic phrase yang ditampilkan di sini adalah untuk tujuan simulasi dan tidak terhubung ke aset nyata.
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default BackupPhrase;
