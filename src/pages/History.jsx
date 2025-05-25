
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowDownLeft, ArrowUpRight, Search, Filter, Download, Copy, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/layout/Navigation';
import { useWallet } from '@/contexts/WalletContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TransactionIcon = ({ type }) => {
  switch (type) {
    case 'send':
    case 'internal_transfer_send':
      return <ArrowUpRight className="h-5 w-5 text-red-400" />;
    case 'receive':
    case 'internal_transfer_receive':
      return <ArrowDownLeft className="h-5 w-5 text-green-400" />;
    default:
      return <ArrowRight className="h-5 w-5 text-muted-foreground" />;
  }
};

const TransactionStatusBadge = ({ status }) => {
  let bgColor = 'bg-yellow-500/20 text-yellow-400';
  if (status === 'completed') bgColor = 'bg-green-500/20 text-green-400';
  else if (status === 'failed') bgColor = 'bg-red-500/20 text-red-400';
  
  return (
    <span className={`px-1.5 py-0.5 text-xs rounded-full ${bgColor}`}>
      {status}
    </span>
  );
};


const History = () => {
  const navigate = useNavigate();
  const { transactions, displayAddress, isTestnetMode } = useWallet();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = transactions
    .filter(tx => {
      if (filterType !== 'all' && tx.type !== filterType && !(filterType === 'send_all' && (tx.type === 'send' || tx.type === 'internal_transfer_send')) && !(filterType === 'receive_all' && (tx.type === 'receive' || tx.type === 'internal_transfer_receive'))) {
        return false;
      }
      const searchLower = searchTerm.toLowerCase();
      return (
        tx.id.toLowerCase().includes(searchLower) ||
        (tx.recipient_address && tx.recipient_address.toLowerCase().includes(searchLower)) ||
        (tx.sender_address && tx.sender_address.toLowerCase().includes(searchLower)) ||
        (tx.memo && tx.memo.toLowerCase().includes(searchLower)) ||
        tx.amount.toString().includes(searchLower)
      );
    });

  const formatAddress = (addr) => {
    if (!addr) return 'N/A';
    if (isTestnetMode && addr.startsWith('tb1')) {
      return 'bc1' + addr.substring(3, 7) + '...' + addr.substring(addr.length - 4);
    }
    return addr.substring(0, 7) + '...' + addr.substring(addr.length - 4);
  };
  
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} Disalin`,
      description: `${type} ${text} berhasil disalin.`,
      className: "bg-neutral-800 text-foreground border-neutral-700"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground pb-16">
      <header className="p-3 sticky top-0 bg-background z-10 flex items-center justify-between border-b border-neutral-700">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 h-8 w-8"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Riwayat Transaksi</h1>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({title: "Segera Hadir", description: "Fitur ekspor riwayat akan segera tersedia."})}>
          <Download className="h-4 w-4" />
        </Button>
      </header>

      <main className="flex-grow px-3 py-3 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Cari ID, alamat, memo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-neutral-800 border-neutral-700 pl-9 h-9 text-sm"
              />
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[120px] h-9 bg-neutral-800 border-neutral-700 text-sm">
                <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-neutral-700 text-foreground">
                <SelectItem value="all" className="text-sm">Semua</SelectItem>
                <SelectItem value="send_all" className="text-sm">Kirim</SelectItem>
                <SelectItem value="receive_all" className="text-sm">Terima</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Tidak ada transaksi ditemukan.</p>
              {searchTerm && <p className="text-xs text-muted-foreground mt-1">Coba kata kunci lain atau ubah filter.</p>}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((tx) => (
                <Card key={tx.id} className="bg-neutral-800/70 border-neutral-700/80 rounded-lg overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center">
                        <TransactionIcon type={tx.type} />
                        <div className="ml-2.5">
                          <p className="text-sm font-medium capitalize">
                            {tx.type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${tx.type.includes('send') ? 'text-red-400' : 'text-green-400'}`}>
                          {tx.type.includes('send') ? '-' : '+'} {tx.amount.toFixed(8)} BTC
                        </p>
                        <TransactionStatusBadge status={tx.status} />
                      </div>
                    </div>
                    
                    <div className="text-xs space-y-0.5 text-muted-foreground">
                      {(tx.type.includes('send') && tx.recipient_address) && (
                        <div className="flex items-center justify-between">
                          <span>Ke: {formatAddress(tx.recipient_address)}</span>
                          <Copy className="h-3 w-3 cursor-pointer hover:text-primary" onClick={() => copyToClipboard(tx.recipient_address, 'Alamat Penerima')} />
                        </div>
                      )}
                      {(tx.type.includes('receive') && tx.sender_address) && (
                         <div className="flex items-center justify-between">
                          <span>Dari: {formatAddress(tx.sender_address)}</span>
                          <Copy className="h-3 w-3 cursor-pointer hover:text-primary" onClick={() => copyToClipboard(tx.sender_address, 'Alamat Pengirim')} />
                        </div>
                      )}
                       {(tx.type.includes('internal') && tx.related_user_id) && (
                         <div className="flex items-center justify-between">
                          <span>{tx.type.includes('send') ? 'Ke Pengguna:' : 'Dari Pengguna:'} {tx.related_user_id.substring(0,8)}...</span>
                        </div>
                      )}
                      {tx.memo && <p>Memo: {tx.memo}</p>}
                       <div className="flex items-center justify-between pt-0.5">
                          <span className="truncate max-w-[200px]">ID: {tx.id}</span>
                          <Copy className="h-3 w-3 cursor-pointer hover:text-primary flex-shrink-0" onClick={() => copyToClipboard(tx.id, 'ID Transaksi')} />
                        </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <Navigation />
    </div>
  );
};

export default History;
