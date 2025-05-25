
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, KeyRound, Fingerprint, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useWallet } from '@/contexts/WalletContext.jsx';
import { useToast } from '@/components/ui/use-toast.js';

const SecuritySettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isPinSet, changePin, removePin, pinError, clearPinError, loading: pinLoading } = useWallet();

  const [showChangePinDialog, setShowChangePinDialog] = useState(false);
  const [showDisablePinDialog, setShowDisablePinDialog] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [pinToDisable, setPinToDisable] = useState('');

  const handlePinInputChange = (value, setter) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 6) {
      setter(numericValue);
    }
  };

  const handleChangePin = async () => {
    clearPinError();
    if (newPin.length !== 6 || !/^\d+$/.test(newPin)) {
      toast({ variant: "destructive", title: "PIN Baru Tidak Valid", description: "PIN baru harus 6 digit angka." });
      return;
    }
    if (newPin !== confirmNewPin) {
      toast({ variant: "destructive", title: "PIN Baru Tidak Cocok", description: "PIN baru dan konfirmasi tidak sama." });
      return;
    }
    const success = await changePin(currentPin, newPin);
    if (success) {
      setShowChangePinDialog(false);
      setCurrentPin('');
      setNewPin('');
      setConfirmNewPin('');
    }
  };

  const handleDisablePin = async () => {
    clearPinError();
    const success = await removePin(pinToDisable); 
    if (success) {
      setShowDisablePinDialog(false);
      setPinToDisable('');
      toast({ title: "PIN Dinonaktifkan", description: "Anda akan diminta membuat PIN baru saat login berikutnya.", className: "bg-orange-500 text-white" });
      navigate('/login'); 
    } else {
       toast({ variant: "destructive", title: "Gagal Menonaktifkan PIN", description: pinError || "PIN yang dimasukkan salah." });
    }
  };
  
  const handleEnablePin = () => {
    navigate('/create-pin');
  };


  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      <header className="p-3 sticky top-0 bg-background z-10 flex items-center border-b border-neutral-700">
        <Button variant="ghost" size="icon" className="mr-2 h-8 w-8" onClick={() => navigate('/settings')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Keamanan</h1>
      </header>

      <main className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <KeyRound className="h-5 w-5 mr-2 text-primary" />
                Pengaturan PIN
              </CardTitle>
              <CardDescription className="text-xs">
                {isPinSet() ? "PIN Anda aktif. Anda dapat mengubah atau menonaktifkannya." : "PIN tidak aktif. Aktifkan untuk keamanan tambahan."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isPinSet() ? (
                <>
                  <Button className="w-full" variant="outline" onClick={() => setShowChangePinDialog(true)}>Ubah PIN</Button>
                  <Button className="w-full" variant="destructive" onClick={() => setShowDisablePinDialog(true)}>Nonaktifkan PIN</Button>
                </>
              ) : (
                <Button className="w-full safepal-gradient-button" onClick={handleEnablePin}>Aktifkan PIN</Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Fingerprint className="h-5 w-5 mr-2 text-primary" />
                Autentikasi Biometrik
              </CardTitle>
               <CardDescription className="text-xs">
                Gunakan sidik jari atau pengenalan wajah untuk akses cepat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-neutral-900/50 rounded-md border border-neutral-700/50">
                <Label htmlFor="fingerprint-switch" className="text-sm">Aktifkan Sidik Jari/Wajah</Label>
                <Switch
                  id="fingerprint-switch"
                  disabled 
                  onCheckedChange={() => toast({ title: 'Segera Hadir', description: 'Fitur autentikasi biometrik akan segera tersedia.' })}
                />
              </div>
               <p className="text-xs text-muted-foreground mt-2">Fitur ini bergantung pada ketersediaan sensor di perangkat Anda.</p>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Dialog open={showChangePinDialog} onOpenChange={setShowChangePinDialog}>
        <DialogContent className="bg-neutral-800 border-neutral-700 text-foreground">
          <DialogHeader>
            <DialogTitle>Ubah PIN</DialogTitle>
            <DialogDescription className="text-muted-foreground">Masukkan PIN lama Anda dan PIN baru.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <Input type="password" inputMode="numeric" maxLength="6" placeholder="PIN Lama (6 digit)" value={currentPin} onChange={(e) => handlePinInputChange(e.target.value, setCurrentPin)} className="bg-neutral-900 border-neutral-600"/>
            <Input type="password" inputMode="numeric" maxLength="6" placeholder="PIN Baru (6 digit)" value={newPin} onChange={(e) => handlePinInputChange(e.target.value, setNewPin)} className="bg-neutral-900 border-neutral-600"/>
            <Input type="password" inputMode="numeric" maxLength="6" placeholder="Konfirmasi PIN Baru" value={confirmNewPin} onChange={(e) => handlePinInputChange(e.target.value, setConfirmNewPin)} className="bg-neutral-900 border-neutral-600"/>
            {pinError && <p className="text-xs text-red-500">{pinError}</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => {setShowChangePinDialog(false); clearPinError();}}>Batal</Button>
            <Button className="safepal-gradient-button" onClick={handleChangePin} disabled={pinLoading}>
              {pinLoading ? 'Memproses...' : 'Simpan PIN Baru'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDisablePinDialog} onOpenChange={setShowDisablePinDialog}>
        <DialogContent className="bg-neutral-800 border-neutral-700 text-foreground">
          <DialogHeader>
            <DialogTitle className="flex items-center"><ShieldAlert className="h-5 w-5 mr-2 text-yellow-400"/> Nonaktifkan PIN</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Untuk menonaktifkan PIN, masukkan PIN Anda saat ini. Ini akan mengurangi keamanan akun Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <Input type="password" inputMode="numeric" maxLength="6" placeholder="Masukkan PIN Saat Ini (6 digit)" value={pinToDisable} onChange={(e) => handlePinInputChange(e.target.value, setPinToDisable)} className="bg-neutral-900 border-neutral-600"/>
            {pinError && <p className="text-xs text-red-500">{pinError}</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => {setShowDisablePinDialog(false); clearPinError();}}>Batal</Button>
            <Button variant="destructive" onClick={handleDisablePin} disabled={pinLoading}>
              {pinLoading ? 'Memproses...' : 'Ya, Nonaktifkan PIN'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecuritySettings;
