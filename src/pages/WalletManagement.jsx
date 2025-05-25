
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit3, PlusCircle, Trash2, Check, Copy, Smartphone, KeyRound, MoreHorizontal, ChevronRight } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useWallet } from '@/contexts/WalletContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast.js';
import { generateMnemonic } from '@/lib/utils.js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

const WalletItem = React.memo(({ wallet, onEdit, onBackup, onDelete, onCopyAddress, copiedAddress }) => {
  const navigate = useNavigate();
  return (
    <Card className={`bg-neutral-800 border-neutral-700 rounded-lg mb-2 ${wallet.active ? 'border-primary/70 ring-1 ring-primary/70' : ''}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center">
            <Smartphone className="h-6 w-6 mr-2.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{wallet.name}</p>
              <p className="text-xs text-muted-foreground">{wallet.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {wallet.verified && <Check className="h-4 w-4 text-green-500" />}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-neutral-800 border-neutral-700 text-foreground">
                <DialogHeader><DialogTitle>{wallet.name}</DialogTitle></DialogHeader>
                <div className="grid gap-2 py-2">
                  <Button variant="outline" className="justify-start" onClick={onEdit}>
                    <Edit3 className="h-4 w-4 mr-2"/> Ubah Nama
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={onBackup}>
                    <KeyRound className="h-4 w-4 mr-2"/> Backup Mnemonic Phrase
                  </Button>
                  <Button variant="destructive" className="justify-start" onClick={onDelete}>
                    <Trash2 className="h-4 w-4 mr-2"/> Hapus Wallet
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex items-center justify-between bg-neutral-900/70 p-1.5 rounded-md text-xs">
          <span className="text-muted-foreground font-mono truncate mr-2">{wallet.address}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={onCopyAddress}>
            {copiedAddress ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 text-primary" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

const AddWalletDialog = React.memo(({ open, onOpenChange, onCreateNew, onImportMnemonic, onImportPrivateKey, onConnectHardware }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-neutral-800 border-neutral-700 text-foreground">
      <DialogHeader>
        <DialogTitle>Tambah Dompet</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Pilih metode untuk menambah dompet baru.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-3 py-3">
        <Button variant="outline" className="justify-start h-12 text-sm" onClick={onCreateNew}>
          <PlusCircle className="h-4 w-4 mr-2" /> Buat Wallet Baru (Mnemonic)
        </Button>
        <Button variant="outline" className="justify-start h-12 text-sm" onClick={onImportMnemonic}>
          <KeyRound className="h-4 w-4 mr-2" /> Impor via Mnemonic Phrase
        </Button>
        <Button variant="outline" className="justify-start h-12 text-sm" onClick={onImportPrivateKey}>
          <KeyRound className="h-4 w-4 mr-2" /> Impor via Private Key
        </Button>
        <Button variant="outline" className="justify-start h-12 text-sm" onClick={onConnectHardware}>
          <Smartphone className="h-4 w-4 mr-2" /> Hubungkan Hardware Wallet (CryVault S1)
        </Button>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost">Batal</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
));

const CreateWalletMnemonicDialog = React.memo(({ open, onOpenChange, mnemonic, onCopyMnemonic, mnemonicCopied }) => (
 <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="bg-neutral-800 border-neutral-700 text-foreground">
      <DialogHeader>
        <DialogTitle>Buat Wallet Baru (Simulasi)</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Ini adalah Mnemonic Phrase untuk wallet baru Anda. Harap simpan di tempat yang aman. Ini tidak akan ditampilkan lagi.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 space-y-3">
        <div className="p-3 bg-neutral-900 rounded-md border border-neutral-700">
          <p className="text-sm font-mono leading-relaxed text-center text-primary">{mnemonic}</p>
        </div>
        <Button variant="outline" className="w-full" onClick={onCopyMnemonic}>
          {mnemonicCopied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
          {mnemonicCopied ? 'Disalin!' : 'Salin Mnemonic'}
        </Button>
        <p className="text-xs text-yellow-400 text-center">PENTING: Ini adalah simulasi. Jangan gunakan mnemonic ini untuk wallet sungguhan.</p>
      </div>
      <DialogFooter>
        <Button className="w-full safepal-gradient-button" onClick={() => onOpenChange(false)}>Saya Sudah Menyimpan</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
));

const EditWalletNameInput = React.memo(({ value, onChange, onSave }) => (
  <Input 
    value={value} 
    onChange={onChange} 
    className="bg-neutral-900 border-neutral-600 h-7 text-sm p-1"
    autoFocus
    onBlur={onSave}
    onKeyDown={(e) => e.key === 'Enter' && onSave()}
  />
));


const WalletManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { walletName, updateWalletName, address, displayAddress } = useWallet();
  
  const [editingName, setEditingName] = useState(false);
  const [newNameInput, setNewNameInput] = useState(walletName);
  const [copiedAddress, setCopiedAddress] = useState(false);
  
  const [showAddWalletDialog, setShowAddWalletDialog] = useState(false);
  const [showCreateMnemonicDialog, setShowCreateMnemonicDialog] = useState(false);
  const [generatedMnemonic, setGeneratedMnemonic] = useState('');
  const [mnemonicCopied, setMnemonicCopied] = useState(false);

  const handleSaveName = useCallback(() => {
    if (!newNameInput.trim()) {
      toast({ variant: "destructive", title: "Nama tidak valid", description: "Nama wallet tidak boleh kosong." });
      return;
    }
    updateWalletName(newNameInput);
    setEditingName(false);
    toast({
      title: "Nama Wallet Diperbarui",
      description: `Nama wallet telah diubah menjadi ${newNameInput}.`,
      className: "bg-neutral-800 text-foreground border-neutral-700"
    });
  }, [newNameInput, updateWalletName, toast]);

  const copyAddressToClipboard = useCallback(() => {
    navigator.clipboard.writeText(address); 
    setCopiedAddress(true);
    toast({
      title: "Alamat Disalin",
      description: "Alamat wallet berhasil disalin.",
      className: "bg-neutral-800 text-foreground border-neutral-700"
    });
    setTimeout(() => setCopiedAddress(false), 2000);
  }, [address, toast]);

  const copyMnemonicToClipboard = useCallback(() => {
    navigator.clipboard.writeText(generatedMnemonic);
    setMnemonicCopied(true);
    toast({
      title: "Mnemonic Disalin",
      description: "Mnemonic phrase berhasil disalin ke clipboard.",
      className: "bg-green-600 text-white"
    });
    setTimeout(() => setMnemonicCopied(false), 3000);
  }, [generatedMnemonic, toast]);
  
  const softwareWallets = [
    { name: walletName, type: "Mnemonic (Aktif)", balance: "~ $0", verified: true, active: true, address: displayAddress },
  ];

  const handleCreateNewWallet = useCallback(() => {
    const newMnemonic = generateMnemonic();
    setGeneratedMnemonic(newMnemonic);
    setShowAddWalletDialog(false); 
    setShowCreateMnemonicDialog(true);
    toast({
      title: "Wallet Baru (Simulasi)",
      description: "Mnemonic phrase telah dibuat. Harap simpan dengan aman.",
      className: "bg-blue-600 text-white"
    });
  }, [toast]);

  const handleActionPlaceholder = useCallback((title) => {
    toast({
      title: "Segera Hadir",
      description: `Fitur "${title}" akan segera diimplementasikan.`,
      className: "bg-blue-600 text-white"
    });
  }, [toast]);


  return (
    <div className="min-h-screen pb-16 bg-background text-foreground">
      <header className="p-3 sticky top-0 bg-background z-10 flex items-center justify-between border-b border-neutral-700">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 h-8 w-8" onClick={() => navigate('/settings')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Manajemen Wallet</h1>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowAddWalletDialog(true)}>
          <PlusCircle className="h-5 w-5 text-primary" />
        </Button>
      </header>

      <main className="px-3 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-5"
        >
          <div>
            <h2 className="text-xs font-semibold text-muted-foreground mb-1.5 px-1">DOMPET PERANGKAT LUNAK</h2>
            {softwareWallets.map((wallet, index) => (
              editingName && wallet.active ? (
                <EditWalletNameInput 
                  key={`edit-${index}`}
                  value={newNameInput}
                  onChange={(e) => setNewNameInput(e.target.value)}
                  onSave={handleSaveName}
                />
              ) : (
                <WalletItem 
                  key={index}
                  wallet={wallet}
                  onEdit={() => {setEditingName(true); setNewNameInput(wallet.name)}}
                  onBackup={() => navigate('/settings/backup-phrase')}
                  onDelete={() => handleActionPlaceholder("Hapus Wallet")}
                  onCopyAddress={copyAddressToClipboard}
                  copiedAddress={copiedAddress}
                />
              )
            ))}
          </div>

          <div>
            <h2 className="text-xs font-semibold text-muted-foreground mb-1.5 px-1">DOMPET HARDWARE</h2>
             <Card className="bg-neutral-800 border-neutral-700 rounded-lg mb-2 cursor-pointer hover:bg-neutral-700/60" onClick={() => handleActionPlaceholder("Hubungkan CryVault S1")}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Smartphone className="h-6 w-6 mr-2.5 text-blue-400" />
                    <div>
                      <p className="text-sm font-medium">CryVault S1</p>
                      <p className="text-xs text-muted-foreground">Hubungkan dompet hardware Anda</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
          </div>
        </motion.div>
      </main>

      <AddWalletDialog 
        open={showAddWalletDialog}
        onOpenChange={setShowAddWalletDialog}
        onCreateNew={handleCreateNewWallet}
        onImportMnemonic={() => handleActionPlaceholder("Impor via Mnemonic Phrase")}
        onImportPrivateKey={() => handleActionPlaceholder("Impor via Private Key")}
        onConnectHardware={() => handleActionPlaceholder("Hubungkan Hardware Wallet")}
      />
      
      <CreateWalletMnemonicDialog
        open={showCreateMnemonicDialog}
        onOpenChange={setShowCreateMnemonicDialog}
        mnemonic={generatedMnemonic}
        onCopyMnemonic={copyMnemonicToClipboard}
        mnemonicCopied={mnemonicCopied}
      />
    </div>
  );
};

export default WalletManagement;
