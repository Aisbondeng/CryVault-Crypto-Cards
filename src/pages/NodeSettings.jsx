
import React, { useEffect } from "react";
import { ArrowLeft, CheckCircle, XCircle, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '@/contexts/WalletContext.jsx';

const NodeSettings = () => {
  const navigate = useNavigate();
  const { nodeSettings } = useWallet();
  const {
    selectedNode, 
    selectedNodeName, 
    setSelectedNodeName, 
    customNodeUrl,
    setCustomNodeUrl,
    customNodeName, 
    setCustomNodeName, 
    customNodeChainId,
    setCustomNodeChainId,
    customNodeSymbol,
    setCustomNodeSymbol,
    nodeStatus,
    isLoadingNode,
    testNodeConnection,
    saveCustomNode,
    currentRpcUrl,
    allNodesForSelect
  } = nodeSettings;

  useEffect(() => {
    if (selectedNode?.isCustom && selectedNodeName !== "Custom") {
      setCustomNodeName(selectedNode.name);
      setCustomNodeUrl(selectedNode.url);
      setCustomNodeChainId(selectedNode.chainId?.toString() || '');
      setCustomNodeSymbol(selectedNode.symbol || '');
    } else if (selectedNodeName !== "Custom") {
      setCustomNodeName('');
      setCustomNodeUrl('');
      setCustomNodeChainId('');
      setCustomNodeSymbol('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeName, selectedNode]); 


  return (
    <div className="min-h-screen pb-16 bg-background text-foreground">
      <header className="p-4 sticky top-0 bg-background z-10 border-b border-neutral-700">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Pengaturan Node RPC</h1>
        </div>
      </header>

      <main className="px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle>Pilih Jaringan Node</CardTitle>
              <CardDescription>Pilih node RPC dari daftar atau tambahkan node kustom Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="node-select">Node RPC</Label>
                <Select value={selectedNodeName || ''} onValueChange={setSelectedNodeName}>
                  <SelectTrigger id="node-select" className="select-trigger mt-1">
                    <SelectValue placeholder="Pilih Node" />
                  </SelectTrigger>
                  <SelectContent className="select-content">
                    {allNodesForSelect.map((node) => (
                      <SelectItem key={node.name} value={node.name} className="select-item">
                        {node.name} {node.isCustom && "(Kustom)"}
                      </SelectItem>
                    ))}
                    <SelectItem value="Custom" className="select-item font-semibold">Tambahkan Node Kustom Baru...</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedNodeName === "Custom" && (
                <div className="space-y-3 p-3 border border-neutral-600 rounded-md">
                  <h3 className="text-md font-semibold text-primary">Detail Node Kustom Baru</h3>
                  <div>
                    <Label htmlFor="custom-node-name-input">Nama Node</Label>
                    <Input 
                      id="custom-node-name-input" 
                      placeholder="Contoh: My Custom Node" 
                      value={customNodeName} 
                      onChange={(e) => setCustomNodeName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="custom-node-url">URL RPC</Label>
                    <Input 
                      id="custom-node-url" 
                      placeholder="https://url-rpc-kustom-anda.com" 
                      value={customNodeUrl} 
                      onChange={(e) => setCustomNodeUrl(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                   <div>
                    <Label htmlFor="custom-node-chainid">Chain ID</Label>
                    <Input 
                      id="custom-node-chainid" 
                      type="number"
                      placeholder="Contoh: 1" 
                      value={customNodeChainId} 
                      onChange={(e) => setCustomNodeChainId(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                   <div>
                    <Label htmlFor="custom-node-symbol">Simbol Mata Uang</Label>
                    <Input 
                      id="custom-node-symbol" 
                      placeholder="Contoh: ETH" 
                      value={customNodeSymbol} 
                      onChange={(e) => setCustomNodeSymbol(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={saveCustomNode} className="w-full safepal-gradient-button mt-2" disabled={isLoadingNode}>
                    {isLoadingNode ? 'Menyimpan...' : 'Simpan & Tes Node Kustom'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle>Status Koneksi Node</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingNode ? (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Wifi className="h-5 w-5 animate-pulse text-primary" />
                  <span>Mengecek koneksi...</span>
                </div>
              ) : nodeStatus.connected ? (
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span>Terhubung! Latensi: {nodeStatus.latency}ms</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-400">
                  <XCircle className="h-5 w-5" />
                  <span>Tidak terhubung. {nodeStatus.error && `Error: ${nodeStatus.error}`}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2 break-all">URL RPC Saat Ini: {currentRpcUrl || "Tidak ada"}</p>
              {selectedNode && selectedNode.name !== "Custom" && (
                <Button onClick={() => testNodeConnection(currentRpcUrl)} className="mt-3 w-full" variant="outline" disabled={isLoadingNode}>
                  {isLoadingNode ? 'Mengecek...' : 'Tes Ulang Koneksi'}
                </Button>
              )}
            </CardContent>
          </Card>
          
          <div className="text-xs text-muted-foreground text-center px-4">
            Pengaturan node RPC memungkinkan Anda untuk terhubung ke jaringan blockchain yang berbeda atau menggunakan penyedia node pilihan Anda untuk performa atau privasi yang lebih baik.
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default NodeSettings;
