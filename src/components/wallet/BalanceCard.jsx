import React from 'react';
import { motion } from 'framer-motion';
import { Bitcoin, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';

const BalanceCard = () => {
  const { balance } = useWallet();
  const [balanceVisible, setBalanceVisible] = React.useState(true);
  
  const btcPrice = 65432.10;
  const usdValue = balance * btcPrice;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-neutral-800 border-neutral-700 rounded-lg shadow-md overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">Total Saldo</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setBalanceVisible(!balanceVisible)}>
              {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          
          {balanceVisible ? (
            <>
              <div className="text-3xl font-bold">${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="text-sm text-muted-foreground">{balance.toFixed(8)} BTC</div>
            </>
          ) : (
             <div className="text-3xl font-bold">********</div>
          )}
          
          <div className="flex items-center text-xs text-green-400 mt-2">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+2.4%</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BalanceCard;