import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';

const TransactionItem = ({ transaction }) => {
  const { type, amount, timestamp, status, recipient, sender, memo } = transaction;
  
  const formattedDate = new Date(timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  const formattedTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const isReceive = type === 'receive';
  const address = isReceive ? sender : recipient;
  const truncatedAddress = address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'Alamat Tidak Dikenal';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-neutral-800 border-neutral-700 rounded-lg p-3 mb-2"
    >
      <div className="flex items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isReceive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {isReceive ? (
            <ArrowDownLeft className="h-4 w-4 text-green-400" />
          ) : (
            <ArrowUpRight className="h-4 w-4 text-red-400" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-sm">{isReceive ? 'Diterima dari' : 'Dikirim ke'}</h3>
              <p className="text-xs text-muted-foreground">{truncatedAddress}</p>
            </div>
            <div className="text-right">
              <p className={`font-medium text-sm ${isReceive ? 'text-green-400' : 'text-red-400'}`}>
                {isReceive ? '+' : '-'}{amount.toFixed(5)} BTC
              </p>
              <p className="text-xs text-muted-foreground">{formattedDate}, {formattedTime}</p>
            </div>
          </div>
          
          {memo && (
            <div className="mt-1 text-xs text-muted-foreground">
              <p>Memo: {memo}</p>
            </div>
          )}
          
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionItem;