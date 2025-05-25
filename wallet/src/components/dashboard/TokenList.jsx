
import React from 'react';
import { motion } from 'framer-motion';
import TokenIcon from '@/components/dashboard/TokenIcon';
import { Card, CardContent } from '@/components/ui/card';
import { useWallet } from '@/contexts/WalletContext';

const TokenList = () => {
  const { balance } = useWallet();
  const btcPrice = 65432.10;

  const dummyTokens = [
    { name: "Bitcoin", network: "Bitcoin", price: btcPrice, amount: balance, symbol: "BTC" },
    { name: "BNB", network: "BEP20", price: 645.85, amount: 0, symbol: "BNB" },
    { name: "Ethereum", network: "ERC20", price: 3500.50, amount: 0, symbol: "ETH" },
    { name: "TES Token", network: "BEP20", price: 0, amount: 0, symbol: "TES" },
    { name: "Tesla Stock Token", network: "BEP20", price: 0, amount: 0, symbol: "tesla" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.05 }}
      className="space-y-1.5"
    >
      {dummyTokens.map((token, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="bg-transparent border-none shadow-none rounded-md">
            <CardContent className="p-2.5 flex items-center justify-between hover:bg-neutral-800/50 rounded-md cursor-pointer">
              <div className="flex items-center">
                <TokenIcon symbol={token.symbol} className="mr-2.5 h-8 w-8" />
                <div>
                  <h3 className="text-sm font-medium">{token.name} <span className="text-xs text-muted-foreground">({token.network})</span></h3>
                  {token.price > 0 && <p className="text-xs text-muted-foreground">${token.price.toLocaleString()}</p>}
                  {token.price === 0 && <p className="text-xs text-muted-foreground">~</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{token.amount.toFixed(token.symbol === "BTC" ? 8 : 2)}</p>
                {token.price > 0 && <p className="text-xs text-muted-foreground">${(token.amount * token.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
                {token.price === 0 && <p className="text-xs text-muted-foreground">$0</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TokenList;
