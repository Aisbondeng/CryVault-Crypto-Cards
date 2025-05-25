
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Globe, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/layout/Navigation';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Dapps = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [iframeSrc, setIframeSrc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentDisplayUrl, setCurrentDisplayUrl] = useState('');

  const popularDapps = [
    { name: "PancakeSwap", url: "https://pancakeswap.finance", logo: "🥞" },
    { name: "Uniswap", url: "https://app.uniswap.org", logo: "🦄" },
    { name: "OpenSea", url: "https://opensea.io", logo: "🌊" },
    { name: "Aave", url: "https://app.aave.com", logo: "👻" },
  ];

  const handleLoadUrl = (targetUrl) => {
    if (!targetUrl.startsWith('https://')) {
      toast({
        variant: "destructive",
        title: "URL Tidak Valid",
        description: "Harap masukkan URL yang dimulai dengan https://",
      });
      return;
    }
    setIsLoading(true);
    setCurrentDisplayUrl(targetUrl);
    setIframeSrc(targetUrl); 
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };
  
  const handleIframeError = () => {
    setIsLoading(false);
    toast({
      variant: "destructive",
      title: "Gagal Memuat DApp",
      description: "Tidak dapat memuat URL. Pastikan URL benar dan DApp mendukung tampilan dalam iframe.",
      duration: 7000,
    });
    setIframeSrc(''); 
    setCurrentDisplayUrl('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) {
      handleLoadUrl(url);
    }
  };

  const closeBrowser = () => {
    setIframeSrc('');
    setCurrentDisplayUrl('');
    setUrl('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground pb-16">
      <header className="p-3 sticky top-0 bg-background z-20 flex items-center border-b border-neutral-700">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => iframeSrc ? closeBrowser() : navigate(-1)}
        >
          {iframeSrc ? <X className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
        </Button>
        {iframeSrc ? (
          <div className="flex-grow text-sm text-muted-foreground truncate">{currentDisplayUrl}</div>
        ) : (
          <h1 className="text-lg font-semibold">Browser DApp</h1>
        )}
        {iframeSrc && (
          <Button variant="ghost" size="icon" className="ml-2" onClick={() => handleLoadUrl(iframeSrc)}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </header>

      {!iframeSrc && (
        <main className="flex-grow px-4 py-4 overflow-y-auto">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 mb-6"
          >
            <div className="relative flex-grow">
              <Input
                type="url"
                placeholder="Ketik URL DApp (mis: https://pancakeswap.finance)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-neutral-800 border-neutral-700 pl-9 h-10 text-sm"
              />
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button type="submit" className="safepal-gradient-button h-10 px-4">
              <Globe className="h-4 w-4 mr-2" /> Buka
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">DApps Populer</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {popularDapps.map((dapp) => (
                <motion.div
                  key={dapp.name}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Card 
                    className="bg-neutral-800 border-neutral-700 hover:border-primary transition-colors cursor-pointer"
                    onClick={() => { setUrl(dapp.url); handleLoadUrl(dapp.url);}}
                  >
                    <CardContent className="p-3 flex flex-col items-center text-center">
                      <span className="text-3xl mb-1.5">{dapp.logo}</span>
                      <p className="text-xs font-medium truncate w-full">{dapp.name}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
             <p className="text-xs text-muted-foreground mt-6 text-center">
              Harap dicatat: Browser DApp ini adalah fitur eksperimental. Tidak semua DApp mungkin berfungsi dengan baik. Selalu berhati-hati saat berinteraksi dengan DApps.
            </p>
          </motion.div>
        </main>
      )}

      {iframeSrc && (
        <div className="flex-grow relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
          <iframe
            src={iframeSrc}
            title="DApp Browser"
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
          ></iframe>
        </div>
      )}
      
      <Navigation />
    </div>
  );
};

export default Dapps;
