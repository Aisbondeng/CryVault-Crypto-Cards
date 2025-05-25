
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';

const BalanceDisplay = () => {
  const { balance } = useWallet();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const btcPrice = 65432.10; 
  const usdValue = balance * btcPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center mb-5 element-spacing"
    >
      <div className="flex justify-center items-center mb-1">
        <span className="text-small text-muted-foreground mr-2">Balance</span>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setBalanceVisible(!balanceVisible)}>
          {balanceVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
        </Button>
      </div>
      {balanceVisible ? (
        <>
          <div className="text-3xl font-bold">${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="text-sm text-muted-foreground mt-0.5">{balance.toFixed(8)} BTC</div>
        </>
      ) : (
        <>
          <div className="text-3xl font-bold">$******</div>
          <div className="text-sm text-muted-foreground mt-0.5">**.******** BTC</div>
        </>
      )}
    </motion.div>
  );
};

export default BalanceDisplay;
