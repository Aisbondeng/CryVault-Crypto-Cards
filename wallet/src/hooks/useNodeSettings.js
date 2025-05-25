
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast.js';

const DEFAULT_NODES_DATA = [
  { name: "BNB Smart Chain", url: "https://bsc-dataseed4.ninicoin.io", chainId: 56, symbol: "BNB" },
  { name: "Ethereum", url: "https://eth-mainnet.public.blastapi.io", chainId: 1, symbol: "ETH" },
  { name: "Polygon", url: "https://rpc-mainnet.matic.quiknode.pro", chainId: 137, symbol: "MATIC" },
  { name: "Fantom", url: "https://rpc.ftm.tools/", chainId: 250, symbol: "FTM" },
  { name: "Heco", url: "https://http-mainnet.hecochain.com", chainId: 128, symbol: "HT" },
  { name: "Optimism", url: "https://mainnet.optimism.io", chainId: 10, symbol: "ETH" },
  { name: "Arbitrum", url: "https://arb1.arbitrum.io/rpc", chainId: 42161, symbol: "ETH" },
  { name: "AVAX C-Chain", url: "https://api.avax.network/ext/bc/C/rpc", chainId: 43114, symbol: "AVAX" },
];

const LOCAL_STORAGE_NODE_KEY = 'crypvault_selectedNodeName'; // Store name instead of object
const LOCAL_STORAGE_CUSTOM_NODES_KEY = 'crypvault_customNodes';

export const useNodeSettings = () => {
  const { toast } = useToast();
  const [defaultNodes] = useState(DEFAULT_NODES_DATA); // defaultNodes is static
  const [customNodes, setCustomNodes] = useState([]);
  
  const [selectedNodeName, setSelectedNodeNameState] = useState(() => {
    const savedNodeName = localStorage.getItem(LOCAL_STORAGE_NODE_KEY);
    return savedNodeName ? JSON.parse(savedNodeName) : DEFAULT_NODES_DATA[1].name;
  });

  const [customNodeUrl, setCustomNodeUrl] = useState('');
  const [customNodeNameInput, setCustomNodeNameInput] = useState(''); // Renamed to avoid conflict
  const [customNodeChainId, setCustomNodeChainId] = useState('');
  const [customNodeSymbol, setCustomNodeSymbol] = useState('');
  
  const [nodeStatus, setNodeStatus] = useState({ connected: false, latency: null, error: null });
  const [isLoadingNode, setIsLoadingNode] = useState(false);

  useEffect(() => {
    const storedCustomNodes = localStorage.getItem(LOCAL_STORAGE_CUSTOM_NODES_KEY);
    if (storedCustomNodes) {
      setCustomNodes(JSON.parse(storedCustomNodes));
    }
  }, []);

  const allNodes = [...defaultNodes, ...customNodes];
  const selectedNode = allNodes.find(n => n.name === selectedNodeName) || 
                       (selectedNodeName === "Custom" 
                         ? { name: "Custom", url: customNodeUrl.trim(), chainId: parseInt(customNodeChainId,10), symbol: customNodeSymbol.trim(), isCustom: true } 
                         : null) ||
                       defaultNodes[1];


  const currentRpcUrl = selectedNode?.url;

  const testNodeConnection = useCallback(async (urlToTest) => {
    if (!urlToTest) {
      setNodeStatus({ connected: false, latency: null, error: "URL RPC tidak valid." });
      return false;
    }
    setIsLoadingNode(true);
    setNodeStatus({ connected: false, latency: null, error: null });
    const startTime = Date.now();
    try {
      const response = await fetch(urlToTest, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await response.json();
      const endTime = Date.now();
      const latency = endTime - startTime;
      setNodeStatus({ connected: true, latency: latency, error: null });
      toast({ title: "Koneksi Berhasil", description: `Terhubung ke node dengan latensi ${latency}ms.`, className: "bg-green-600 text-white" });
      return true;
    } catch (e) {
      setNodeStatus({ connected: false, latency: null, error: e.message });
      toast({ title: "Koneksi Gagal", description: e.message, variant: "destructive" });
      return false;
    } finally {
      setIsLoadingNode(false);
    }
  }, [toast]);

  const handleSelectNodeName = (name) => {
    setSelectedNodeNameState(name);
    localStorage.setItem(LOCAL_STORAGE_NODE_KEY, JSON.stringify(name));
    if (name !== "Custom") {
      const nodeToTest = allNodes.find(n => n.name === name);
      if (nodeToTest) testNodeConnection(nodeToTest.url);
    } else {
       setNodeStatus({ connected: false, latency: null, error: null }); 
       setCustomNodeNameInput('');
       setCustomNodeUrl('');
       setCustomNodeChainId('');
       setCustomNodeSymbol('');
    }
  };
  
  useEffect(() => {
    const nodeToTestInitially = allNodes.find(n => n.name === selectedNodeName);
    if (nodeToTestInitially && nodeToTestInitially.name !== "Custom" && nodeToTestInitially.url) {
      testNodeConnection(nodeToTestInitially.url);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeName]); 

  const saveCustomNode = async () => {
    const trimmedUrl = customNodeUrl.trim();
    const trimmedName = customNodeNameInput.trim();
    const trimmedChainId = customNodeChainId.trim();
    const trimmedSymbol = customNodeSymbol.trim();

    if (!trimmedUrl || !trimmedName || !trimmedChainId || !trimmedSymbol) {
      toast({ title: "Input Tidak Lengkap", description: "Harap isi semua field untuk node kustom.", variant: "destructive" });
      return;
    }
    const isConnected = await testNodeConnection(trimmedUrl);
    if (isConnected) {
      const newCustomNode = {
        name: trimmedName,
        url: trimmedUrl,
        chainId: parseInt(trimmedChainId, 10),
        symbol: trimmedSymbol,
        isCustom: true
      };
      const updatedCustomNodes = [...customNodes.filter(n => n.name !== newCustomNode.name), newCustomNode];
      setCustomNodes(updatedCustomNodes);
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_NODES_KEY, JSON.stringify(updatedCustomNodes));
      handleSelectNodeName(newCustomNode.name); 
      toast({ title: "Node Kustom Disimpan", description: `Node ${newCustomNode.name} telah disimpan dan dipilih.`, className: "bg-blue-600 text-white" });
    } else {
      toast({ title: "Node Kustom Tidak Disimpan", description: "Koneksi ke node kustom gagal. Harap periksa URL dan coba lagi.", variant: "destructive" });
    }
  };
  
  return {
    selectedNode, // Ini adalah objek node yang aktif (bisa default, bisa custom yang sudah ada, bisa juga representasi dari form "Custom" jika itu yang dipilih)
    selectedNodeName, // Ini adalah string nama node yang dipilih di dropdown (misal "Ethereum", "My Custom Node", atau "Custom")
    setSelectedNodeName: handleSelectNodeName, // Fungsi untuk mengubah selectedNodeName
    customNodeUrl,
    setCustomNodeUrl,
    customNodeName: customNodeNameInput, // State untuk input nama node kustom
    setCustomNodeName: setCustomNodeNameInput, // Setter untuk input nama node kustom
    customNodeChainId,
    setCustomNodeChainId,
    customNodeSymbol,
    setCustomNodeSymbol,
    nodeStatus,
    isLoadingNode,
    testNodeConnection,
    saveCustomNode,
    currentRpcUrl, // URL dari selectedNode
    defaultNodes: allNodes.filter(n => !n.isCustom), 
    customNodes, // Daftar node kustom yang sudah disimpan
    allNodesForSelect: allNodes 
  };
};
