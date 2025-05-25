import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, TrendingUp, PieChart, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/layout/Navigation';
import { useNavigate } from 'react-router-dom';

const earnProducts = [
  { name: "BTC Staking", apr: "Up to 5.5%", icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-6 w-6 text-orange-500 fill-current"><path d="M29.333 16c0-2.385-.794-4.632-2.207-6.455l-2.406-3.145-1.538.087c-2.06-.46-4.24-.704-6.515-.704s-4.455.244-6.515.704l-1.538-.087L6.207 9.545C4.794 11.368 4 13.615 4 16s.794 4.632 2.207 6.455l2.406 3.145 1.538-.087c2.06.46 4.24.704 6.515.704s4.455-.244 6.515-.704l1.538.087 2.406-3.145C28.539 20.632 29.333 18.385 29.333 16zM14.61 21.154v2.32c0 .238-.192.43-.43.43h-1.59c-.238 0-.43-.192-.43-.43v-2.32H10.4v-1.473h1.76v-1.486h-1.76v-1.473h1.76V15.2H10.4v-1.473h1.76v-2.32c0-.238.192-.43.43-.43h1.59c.238 0 .43.192.43.43v2.32h1.76v1.473h-1.76v1.486h1.76v1.473h-1.76v1.535h1.76v1.473h-1.76zm7.056-1.473H19.9v2.32c0 .238-.192.43-.43.43h-1.59c-.238 0-.43-.192-.43-.43v-2.32H15.7v-1.473h1.76v-4.64c0-.238.192-.43.43-.43h1.59c.238 0 .43.192.43.43v4.64h1.756v1.473z"></path></svg>, term: "Fleksibel / 30 Hari" },
  { name: "ETH Staking", apr: "Up to 6.0%", icon: <img  alt="ETH icon" class="h-6 w-6" src="https://images.unsplash.com/photo-1641179680040-1647297c6bbd" />, term: "Fleksibel / Tetap" },
  { name: "USDT Savings", apr: "Up to 10%", icon: <img  alt="USDT icon" class="h-6 w-6" src="https://images.unsplash.com/photo-1644376770280-111ccd322f31" />, term: "Fleksibel" },
];

const Earn = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 bg-background text-foreground">
      <header className="p-4 sticky top-0 bg-background z-10 border-b border-neutral-700">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Earn</h1>
        </div>
      </header>
      
      <main className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <Card className="bg-gradient-to-br from-primary/30 to-blue-500/30 border-primary/50 rounded-lg text-primary-foreground">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">Total Aset Earn</p>
                  <p className="text-2xl font-bold">$0.00</p>
                </div>
                <Zap className="h-10 w-10 text-yellow-300" />
              </div>
              <p className="text-xs mt-2">Mulai dapatkan penghasilan pasif dari aset kripto Anda.</p>
            </CardContent>
          </Card>

          <Card className="bg-neutral-800 border-neutral-700 rounded-lg">
            <CardHeader>
              <CardTitle className="text-base">Produk Populer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {earnProducts.map(product => (
                <Card key={product.name} className="bg-neutral-700/50 border-neutral-600 hover:border-primary/50 transition-colors">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center mr-3">
                        {product.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.term}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-400">{product.apr}</p>
                      <p className="text-xs text-muted-foreground">APR</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-3 text-center">
            <Card className="bg-neutral-800 border-neutral-700 p-3 rounded-lg">
              <PieChart className="h-6 w-6 mx-auto text-primary mb-1" />
              <p className="text-xs font-medium">Portofolio Saya</p>
            </Card>
            <Card className="bg-neutral-800 border-neutral-700 p-3 rounded-lg">
              <ShieldCheck className="h-6 w-6 mx-auto text-green-400 mb-1" />
              <p className="text-xs font-medium">Aman & Terjamin</p>
            </Card>
          </div>

        </motion.div>
      </main>
      
      <Navigation />
    </div>
  );
};

export default Earn;