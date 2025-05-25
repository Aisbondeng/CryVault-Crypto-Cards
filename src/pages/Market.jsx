import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, ArrowDownUp, ChevronDown, Star, TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Navigation from '@/components/layout/Navigation';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';

const initialMarketFilters = ["Watchlist", "All", "Hot", "New", "Gainers", "Losers", "Meme", "PoW", "CeFi", "Layer 1", "Layer 2", "Metaverse"];

const initialCryptoData = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", price: 65432.10, change24h: 2.4, volume24h: 35000000000, marketCap: 1200000000000, icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-6 w-6 text-orange-500 fill-current"><path d="M29.333 16c0-2.385-.794-4.632-2.207-6.455l-2.406-3.145-1.538.087c-2.06-.46-4.24-.704-6.515-.704s-4.455.244-6.515.704l-1.538-.087L6.207 9.545C4.794 11.368 4 13.615 4 16s.794 4.632 2.207 6.455l2.406 3.145 1.538-.087c2.06.46 4.24.704 6.515.704s4.455-.244 6.515-.704l1.538.087 2.406-3.145C28.539 20.632 29.333 18.385 29.333 16zM14.61 21.154v2.32c0 .238-.192.43-.43.43h-1.59c-.238 0-.43-.192-.43-.43v-2.32H10.4v-1.473h1.76v-1.486h-1.76v-1.473h1.76V15.2H10.4v-1.473h1.76v-2.32c0-.238.192-.43.43-.43h1.59c.238 0 .43.192.43.43v2.32h1.76v1.473h-1.76v1.486h1.76v1.473h-1.76v1.535h1.76v1.473h-1.76zm7.056-1.473H19.9v2.32c0 .238-.192.43-.43.43h-1.59c-.238 0-.43-.192-.43-.43v-2.32H15.7v-1.473h1.76v-4.64c0-.238.192-.43.43-.43h1.59c.238 0 .43.192.43.43v4.64h1.756v1.473z"></path></svg>, isFavorite: true, category: "PoW" },
  { id: "eth", name: "Ethereum", symbol: "ETH", price: 3456.78, change24h: -1.2, volume24h: 22000000000, marketCap: 415000000000, icon: <img  alt="ETH icon" class="h-6 w-6" src="https://images.unsplash.com/photo-1641179680040-1647297c6bbd" />, isFavorite: true, category: "PoW" },
  { id: "sfp", name: "SafePal", symbol: "SFP", price: 0.75, change24h: 5.1, volume24h: 15000000, marketCap: 350000000, icon: <img  alt="SFP icon" class="h-6 w-6" src="https://images.unsplash.com/photo-1644376770280-111ccd322f31" />, isFavorite: true, category: "CeFi" },
  { id: "sol", name: "Solana", symbol: "SOL", price: 150.20, change24h: 3.5, volume24h: 3000000000, marketCap: 68000000000, icon: <img  alt="SOL icon" class="h-6 w-6" src="https://images.unsplash.com/photo-1644376770280-111ccd322f31" />, isFavorite: false, category: "Layer 1" },
  { id: "doge", name: "Dogecoin", symbol: "DOGE", price: 0.15, change24h: 10.2, volume24h: 1200000000, marketCap: 21000000000, icon: <img  alt="DOGE icon" class="h-6 w-6" src="https://images.unsplash.com/photo-1622618792944-660963592d6a" />, isFavorite: false, category: "Meme" },
];

const Market = () => {
  const navigate = useNavigate();
  const { walletName } = useWallet();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'marketCap', direction: 'descending' });
  const [cryptoList, setCryptoList] = useState(initialCryptoData);

  const toggleFavorite = (id) => {
    setCryptoList(prevList => 
      prevList.map(coin => coin.id === id ? { ...coin, isFavorite: !coin.isFavorite } : coin)
    );
  };
  
  const filteredAndSortedCrypto = cryptoList
    .filter(coin => {
      const searchMatch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      if (activeFilter === "All") return searchMatch;
      if (activeFilter === "Watchlist") return coin.isFavorite && searchMatch;
      if (activeFilter === "Hot") return (coin.change24h > 5 || coin.volume24h > 10000000000) && searchMatch; // Example: Hot if high change or volume
      if (activeFilter === "New") return coin.marketCap < 500000000 && searchMatch; // Example: New if low market cap
      if (activeFilter === "Gainers") return coin.change24h > 0 && searchMatch;
      if (activeFilter === "Losers") return coin.change24h < 0 && searchMatch;
      return coin.category === activeFilter && searchMatch;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader = ({ label, sortKey }) => (
    <Button variant="ghost" size="sm" className="p-1 h-auto text-xs" onClick={() => requestSort(sortKey)}>
      {label}
      {sortConfig.key === sortKey && (sortConfig.direction === 'ascending' ? <TrendingUp className="h-3 w-3 ml-0.5" /> : <TrendingDown className="h-3 w-3 ml-0.5" />)}
      {sortConfig.key !== sortKey && <ChevronDown className="h-3 w-3 ml-0.5 text-muted-foreground/50" />}
    </Button>
  );


  return (
    <div className="min-h-screen pb-24 bg-background text-foreground">
      <header className="p-4 sticky top-0 bg-background z-20 border-b border-neutral-700">
        <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          <div className="flex-1 mx-2">
            <h1 className="text-xl font-semibold text-center">{walletName}</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => document.getElementById('marketSearchInput')?.focus()}>
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
        <Tabs defaultValue="spot" className="mt-3">
          <TabsList className="grid w-full grid-cols-4 bg-neutral-800">
            <TabsTrigger value="spot" className="data-[state=active]:bg-neutral-700 data-[state=active]:text-primary text-xs">Spot</TabsTrigger>
            <TabsTrigger value="futures" className="data-[state=active]:bg-neutral-700 data-[state=active]:text-primary text-xs">Futures</TabsTrigger>
            <TabsTrigger value="earn" className="data-[state=active]:bg-neutral-700 data-[state=active]:text-primary text-xs" onClick={() => navigate('/earn')}>Earn</TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-neutral-700 data-[state=active]:text-primary text-xs">Berita</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>
      
      <main className="px-1 py-3">
        <div className="px-3 mb-3">
          <Input 
            id="marketSearchInput"
            type="text" 
            placeholder="Cari Koin (mis. BTC)" 
            className="bg-neutral-800 border-neutral-700 pl-8 h-10 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-6 top-[150px] transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide mb-3 px-3">
          {initialMarketFilters.map(filter => (
            <Button 
              key={filter} 
              variant={activeFilter === filter ? "secondary" : "outline"}
              size="sm"
              className={`whitespace-nowrap px-3 text-xs rounded-md h-7 ${activeFilter === filter ? 'bg-neutral-700 text-primary border-neutral-700' : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-muted-foreground'}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === "Hot" && <Flame className="h-3 w-3 mr-1 text-red-500" />}
              {filter}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-[auto,1fr,1fr,1fr] gap-x-1 items-center text-xs text-muted-foreground mb-2 px-3 sticky top-[132px] bg-background z-10 py-1 border-b border-neutral-700">
          <div className="w-6"></div>
          <SortableHeader label="Nama" sortKey="name" />
          <SortableHeader label="Harga" sortKey="price" />
          <SortableHeader label="24h Chg" sortKey="change24h" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="px-3 space-y-1"
        >
          {filteredAndSortedCrypto.map(crypto => (
            <Card key={crypto.id} className="bg-neutral-800 border-none rounded-lg shadow-sm hover:bg-neutral-700/50 transition-colors cursor-pointer">
              <CardContent className="p-2 grid grid-cols-[auto,1fr,1fr,1fr] gap-x-1 items-center">
                <Button variant="ghost" size="icon" className="h-6 w-6 mr-1" onClick={(e) => { e.stopPropagation(); toggleFavorite(crypto.id); }}>
                  <Star className={`h-4 w-4 ${crypto.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                </Button>
                <div className="flex items-center">
                  {crypto.icon}
                  <div className="ml-2">
                    <p className="text-sm font-medium">{crypto.symbol}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[80px]">{crypto.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${crypto.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: crypto.price > 1 ? 2 : 5})}</p>
                  <p className="text-xs text-muted-foreground">MC ${ (crypto.marketCap / 1_000_000_000).toFixed(2) } M</p>
                </div>
                <div className={`text-sm font-medium text-right ${crypto.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredAndSortedCrypto.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Tidak ada koin yang cocok.</p>
          )}
        </motion.div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Market;