
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MoreHorizontal, Filter, FileText } from 'lucide-react';
import BalanceDisplay from '@/components/dashboard/BalanceDisplay';
import ActionButtons from '@/components/dashboard/ActionButtons';
import TokenList from '@/components/dashboard/TokenList';

const AssetTabs = () => {
  return (
    <Tabs defaultValue="coin" className="sticky top-[56px] z-30 bg-background pt-1">
      <TabsList className="flex justify-around bg-transparent px-0 mb-0 border-b border-neutral-700">
        {["Coin", "Bank", "DeFi", "NFT"].map(tab => (
          <TabsTrigger
            key={tab}
            value={tab.toLowerCase()}
            className="flex-1 text-sm font-medium py-2.5 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>

      <main className="pt-5">
        <TabsContent value="coin" className="mt-0">
          <BalanceDisplay />
          <ActionButtons />
          <div className="flex items-center mb-4 element-spacing-sm space-x-2">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Cari"
                className="bg-neutral-800 border-neutral-700 pl-9 h-10 text-sm"
              />
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button variant="outline" className="h-10 px-3 bg-neutral-800 border-neutral-700 hover:bg-neutral-700">
              <span className="text-sm">Terima</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-neutral-800 border-neutral-700 hover:bg-neutral-700">
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          <TokenList />
        </TabsContent>

        <TabsContent value="bank" className="mt-0">
          <Card className="bg-neutral-800/30 border-neutral-700 rounded-lg">
            <CardContent className="p-6 text-center">
              <img alt="SafePal Debit Card" className="w-48 mx-auto mb-4 rounded-md" src="https://images.unsplash.com/photo-1621522696164-03ffb090920f" />
              <h3 className="text-lg font-semibold mb-2">Miliki Rekening Bank Crypto Anda!</h3>
              <ul className="text-xs text-muted-foreground space-y-1.5 mb-4 text-left list-disc list-inside pl-4">
                <li>Buka rekening bank Swiss secara gratis tanpa biaya pengelolaan</li>
                <li>Dapatkan kartu Master virtual gratis yang mendukung Google Pay, Apple Pay, dan Samsung Pay</li>
                <li>Gunakan cryptocurrency untuk pengeluaran sehari-hari</li>
                <li>Beli USDC tanpa biaya</li>
                <li>Lakukan transfer tanpa hambatan</li>
              </ul>
              <Button className="w-full safepal-gradient-button">Memulai</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {["defi", "nft"].map(tabValue => (
          <TabsContent key={tabValue} value={tabValue} className="mt-0">
            <BalanceDisplay /> {/* Reusing BalanceDisplay for DeFi/NFT tabs */}
            <div className="flex items-center mb-4 element-spacing-sm space-x-2">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Cari"
                  className="bg-neutral-800 border-neutral-700 pl-9 h-10 text-sm"
                />
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="outline" className="h-10 px-3 bg-neutral-800 border-neutral-700 hover:bg-neutral-700">
                <Filter className="h-4 w-4 mr-1.5 text-muted-foreground" />
                <span className="text-sm">Filter</span>
              </Button>
            </div>
            <Card className="bg-transparent border-none shadow-none rounded-lg">
              <CardContent className="p-10 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground text-sm">Belum ada data.</p>
                <p className="text-muted-foreground text-xs mt-1">Aset {tabValue} Anda akan muncul di sini.</p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </main>
    </Tabs>
  );
};

export default AssetTabs;
