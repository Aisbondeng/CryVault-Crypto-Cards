import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter, Store, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/layout/Navigation';
import { useNavigate } from 'react-router-dom';

const nftCollections = [
  { name: "CryptoPunks", floorPrice: "65 ETH", image: "Abstract pixelated character art", id:1 },
  { name: "Bored Ape Yacht Club", floorPrice: "70 ETH", image: "Cartoon ape with bored expression", id:2 },
  { name: "Azuki", floorPrice: "10 ETH", image: "Anime-style character with skateboard", id:3 },
  { name: "Doodles", floorPrice: "8 ETH", image: "Colorful pastel cartoon characters", id:4 },
];

const NftMarketplace = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 bg-background text-foreground">
      <header className="p-4 sticky top-0 bg-background z-10 border-b border-neutral-700">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Pasar NFT</h1>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-1"><Search className="h-5 w-5 text-muted-foreground" /></Button>
            <Button variant="ghost" size="icon"><Filter className="h-5 w-5 text-muted-foreground" /></Button>
          </div>
        </div>
      </header>
      
      <main className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <Card className="bg-neutral-800 border-neutral-700 rounded-lg">
            <CardContent className="p-3">
              <img  alt="NFT Marketplace Banner" className="w-full h-32 object-cover rounded-md" src="https://images.unsplash.com/photo-1644143379190-08a5f055de1d" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {nftCollections.map(collection => (
              <Card key={collection.id} className="bg-neutral-800 border-neutral-700 rounded-lg overflow-hidden">
                <img  alt={collection.name} className="w-full h-32 object-cover" src="https://images.unsplash.com/photo-1553767149-9d196eec5c66" />
                <CardContent className="p-2">
                  <h3 className="text-sm font-semibold truncate">{collection.name}</h3>
                  <p className="text-xs text-muted-foreground">Floor: {collection.floorPrice}</p>
                </CardContent>
              </Card>
            ))}
          </div>
           <Button className="w-full safepal-gradient-button text-primary-foreground mt-4">Jelajahi Semua Koleksi</Button>
        </motion.div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default NftMarketplace;