
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRightLeft, ChevronDown, Settings2, Clock, ExternalLink, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Navigation from '@/components/layout/Navigation';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/components/ui/use-toast';
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


const TokenIcon = ({ symbol, className }) => {
  const baseClasses = "h-6 w-6 rounded-full flex items-center justify-center text-white font-bold text-xs";
  let specificClass = "generic-token-bg";
  let text = symbol.substring(0,1).toUpperCase();

  if (symbol === "BTC") {
    return <div className={`${baseClasses} bitcoin-gradient ${className || ''}`}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-4 w-4 text-white fill-current"><path d="M29.333 16c0-2.385-.794-4.632-2.207-6.455l-2.406-3.145-1.538.087c-2.06-.46-4.24-.704-6.515-.704s-4.455.244-6.515-.704l-1.538-.087L6.207 9.545C4.794 11.368 4 13.615 4 16s.794 4.632 2.207 6.455l2.406 3.145 1.538-.087c2.06.46 4.24.704 6.515-.704s4.455-.244 6.515-.704l1.538.087 2.406-3.145C28.539 20.632 29.333 18.385 29.333 16zM14.61 21.154v2.32c0 .238-.192.43-.43.43h-1.59c-.238 0-.43-.192-.43-.43v-2.32H10.4v-1.473h1.76v-1.486h-1.76v-1.473h1.76V15.2H10.4v-1.473h1.76v-2.32c0-.238.192-.43.43-.43h1.59c.238 0 .43.192.43.43v2.32h1.76v1.473h-1.76v1.486h1.76v1.473h-1.76v1.535h1.76v1.473h-1.76zm7.056-1.473H19.9v2.32c0 .238-.192.43-.43.43h-1.59c-.238 0-.43-.192-.43-.43v-2.32H15.7v-1.473h1.76v-4.64c0-.238.192-.43.43-.43h1.59c.238 0 .43.192.43.43v4.64h1.756v1.473z"></path></svg></div>;
  }
  if (symbol === "USDT") { specificClass = "bg-green-500"; text = "USDT"; }
  if (symbol === "ETH") { specificClass = "eth-icon-bg"; text = "ETH"; }
  
  return <div className={`${baseClasses} ${specificClass} ${className || ''}`}>{text}</div>;
};


const Swap = () => {
  const navigate = useNavigate();
  const { balance, walletName } = useWallet(); 
  const { toast } = useToast();

  const [fromToken, setFromToken] = useState({ symbol: "BTC", name: "Bitcoin", amount: balance });
  const [toToken, setToToken] = useState({ symbol: "USDT", name: "TetherUS", amount: 0 });
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleFromAmountChange = (e) => {
    const amount = e.target.value;
    setFromAmount(amount);
    
    if (fromToken.symbol === "BTC" && toToken.symbol === "USDT") {
      setToAmount((parseFloat(amount) * 65000).toFixed(2));
    } else if (fromToken.symbol === "USDT" && toToken.symbol === "BTC") {
      setToAmount((parseFloat(amount) / 65000).toFixed(8));
    } else {
      setToAmount("");
    }
  };
  
  const exchangePartners = [
    { name: "Binance", description: "Spot, futures & saving", logo: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" },
    { name: "MEXC", description: "Spot and futures trading", logo: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/4604.png" },
    { name: "Aster", description: "Futures trading DEX", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" }, 
    { name: "Bitget", description: "Futures trading", logo: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/10423.png" },
  ];


  return (
    <div className="min-h-screen pb-20 bg-background text-foreground">
      <header className="p-4 sticky top-0 bg-background z-20 border-b border-neutral-700">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="mr-2 opacity-0"> <ArrowLeft className="h-5 w-5" /> </Button> 
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">{walletName}</h1>
            <ChevronDown className="h-4 w-4 ml-1 text-muted-foreground" />
          </div>
          <Button variant="ghost" size="icon">
            <Clock className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <Tabs defaultValue="swap" className="sticky top-[69px] z-10 bg-background">
        <TabsList className="flex justify-around bg-transparent px-2 pt-1 pb-2 border-b border-neutral-700">
          {["Swap", "Bridge", "Buy/Sell", "Exchange"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab.toLowerCase().replace('/', '')}
              className="flex-1 text-sm font-medium py-1.5 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <main className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="swap" className="w-full">
            <TabsContent value="swap" className="mt-0">
              <Card className="bg-neutral-800 border-neutral-700 rounded-lg p-4 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor="fromAmount" className="text-xs text-muted-foreground">Bayar</Label>
                    <div className="flex space-x-1">
                      {["MIN", "50%", "MAKS"].map(val => (
                        <Button key={val} variant="outline" size="sm" className="h-6 px-1.5 text-xs bg-neutral-700 border-neutral-600 hover:bg-neutral-600" onClick={() => setFromAmount(val === "MAKS" ? fromToken.amount.toString() : "")}>{val}</Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" className="p-1 h-auto bg-neutral-700 hover:bg-neutral-600 rounded-md">
                      <TokenIcon symbol={fromToken.symbol} />
                      <span className="text-sm font-medium mx-1">{fromToken.symbol}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Input
                      id="fromAmount"
                      type="number"
                      placeholder="0"
                      value={fromAmount}
                      onChange={handleFromAmountChange}
                      className="text-right text-lg font-semibold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Saldo yang tersedia: {fromToken.amount.toFixed(fromToken.symbol === "BTC" ? 8 : 2)} {fromToken.symbol}</p>
                </div>

                <div className="flex justify-center my-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-neutral-700 border-neutral-600 hover:bg-neutral-600" onClick={handleSwapTokens}>
                    <ArrowRightLeft className="h-4 w-4 text-primary" />
                  </Button>
                </div>

                <div>
                  <Label htmlFor="toAmount" className="text-xs text-muted-foreground mb-1 block">Terima</Label>
                  <div className="flex items-center space-x-2">
                     <Button variant="ghost" className="p-1 h-auto bg-neutral-700 hover:bg-neutral-600 rounded-md">
                      <TokenIcon symbol={toToken.symbol} />
                      <span className="text-sm font-medium mx-1">{toToken.symbol}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Input
                      id="toAmount"
                      type="number"
                      placeholder="0"
                      value={toAmount}
                      readOnly
                      className="text-right text-lg font-semibold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                    />
                  </div>
                   <p className="text-xs text-muted-foreground mt-1">Saldo yang tersedia: {toToken.amount.toFixed(toToken.symbol === "BTC" ? 8 : 2)} {toToken.symbol}</p>
                </div>
              </Card>
              
              <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between items-center p-2 hover:bg-neutral-800 rounded-md cursor-pointer">
                    <span>Layanan</span>
                    <div className="flex items-center">
                        <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/8757.png" alt="BingX" className="h-4 w-4 mr-1 rounded-full"/>
                        <span>BingX·XYSwap</span>
                        <ChevronRight className="h-3 w-3 ml-1"/>
                    </div>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-neutral-800 rounded-md cursor-pointer">
                    <span>Rate</span>
                    <span>1 BTC ≈ 65000.00 USDT <Info className="h-3 w-3 inline ml-1"/></span>
                </div>
                <div className="flex justify-between items-center p-2 hover:bg-neutral-800 rounded-md cursor-pointer">
                    <span>Slippage</span>
                    <span>3% <ChevronRight className="h-3 w-3 inline ml-1"/></span>
                </div>
                 <div className="flex justify-between items-center p-2 hover:bg-neutral-800 rounded-md cursor-pointer">
                    <span>Biaya SafePal</span>
                    <span>0.2% <Info className="h-3 w-3 inline ml-1"/></span>
                </div>
              </div>

              <Button className="w-full mt-6 safepal-gradient-button text-base py-3">Tukar</Button>
            </TabsContent>

            <TabsContent value="bridge" className="mt-0">
              <Card className="bg-neutral-800 border-neutral-700 rounded-lg p-4 space-y-4">
                <Button variant="outline" className="w-full justify-between items-center h-12 bg-neutral-700 border-neutral-600 hover:bg-neutral-600">
                    <div className="flex items-center">
                        <TokenIcon symbol="ETH" />
                        <span className="ml-2 text-sm">Pilih Koin</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
                <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Bayar</Label>
                    <Button variant="outline" className="w-full justify-between items-center h-12 bg-neutral-700 border-neutral-600 hover:bg-neutral-600">
                        <span className="text-sm">Pilih Rantai Sumber</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
                <div className="flex justify-center my-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-neutral-700 border-neutral-600 hover:bg-neutral-600">
                    <ArrowRightLeft className="h-4 w-4 text-primary" />
                  </Button>
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Terima</Label>
                    <Button variant="outline" className="w-full justify-between items-center h-12 bg-neutral-700 border-neutral-600 hover:bg-neutral-600">
                        <span className="text-sm">Pilih Rantai Target</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
                <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">Jumlah</Label>
                    <Input type="number" placeholder="0" className="text-lg font-semibold bg-neutral-700 border-neutral-600 focus-visible:ring-primary h-12"/>
                </div>
              </Card>
              <Button className="w-full mt-6 safepal-gradient-button text-base py-3">Bridge</Button>
            </TabsContent>
            
            <TabsContent value="buysell" className="mt-0">
                <Card className="bg-neutral-800 border-neutral-700 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center mb-1">
                        <Label className="text-xs text-muted-foreground">Bayar</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" className="p-1 h-auto bg-neutral-700 hover:bg-neutral-600 rounded-md">
                            <TokenIcon symbol="USDT" />
                            <span className="text-sm font-medium mx-1">USD</span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Input
                            type="number"
                            placeholder="300"
                            className="text-right text-lg font-semibold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                        />
                    </div>
                    <div className="flex justify-center my-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full bg-neutral-700 border-neutral-600 hover:bg-neutral-600">
                            <ArrowRightLeft className="h-4 w-4 text-primary" />
                        </Button>
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">Estimasi Terima</Label>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" className="p-1 h-auto bg-neutral-700 hover:bg-neutral-600 rounded-md">
                                <TokenIcon symbol="BTC" />
                                <span className="text-sm font-medium mx-1">BTC</span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Input
                                type="number"
                                placeholder="0.0025975"
                                readOnly
                                className="text-right text-lg font-semibold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="flex justify-between items-center text-xs text-muted-foreground p-2 hover:bg-neutral-700/50 rounded-md cursor-pointer">
                            <span>Cara Pembayaran</span>
                            <div className="flex items-center">Semua <ChevronRight className="h-3 w-3 ml-1"/></div>
                        </div>
                        <div className="text-xs text-muted-foreground p-2">
                            Terima Alamat (Bitcoin)
                            <p className="text-foreground text-xs break-all">{useWallet().address}</p>
                        </div>
                    </div>
                </Card>
                <Button className="w-full mt-6 safepal-gradient-button text-base py-3">Beli</Button>
                <p className="text-xs text-muted-foreground text-center mt-3">Disediakan oleh: <span className="text-primary font-medium">S. Simplex</span></p>
            </TabsContent>

            <TabsContent value="exchange" className="mt-0 text-center">
                <img  alt="SafePal Exchange Partners" className="w-32 mx-auto my-6" src="https://images.unsplash.com/photo-1628671752627-4092d3035159" />
                <p className="text-sm text-muted-foreground mb-6">SafePal telah bermitra dengan pertukaran pihak ketiga untuk memfasilitasi pengalaman perdagangan Anda.</p>
                <div className="space-y-3">
                    {exchangePartners.map(partner => (
                        <Card key={partner.name} className="bg-neutral-800 border-neutral-700 rounded-lg hover:bg-neutral-700/50 cursor-pointer">
                            <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center">
                                    <img src={partner.logo} alt={partner.name} className="h-8 w-8 mr-3 rounded-full"/>
                                    <div>
                                        <p className="text-base font-medium">{partner.name}</p>
                                        <p className="text-xs text-muted-foreground">{partner.description}</p>
                                    </div>
                                </div>
                                <ExternalLink className="h-4 w-4 text-muted-foreground"/>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </TabsContent>

          </Tabs>
        </motion.div>
      </main>
      <Navigation />
    </div>
  );
};

export default Swap;
