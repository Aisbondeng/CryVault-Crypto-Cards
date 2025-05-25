import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { WalletProvider, useWallet } from '@/contexts/WalletContext.jsx';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Send = lazy(() => import('@/pages/Send'));
const Receive = lazy(() => import('@/pages/Receive'));
const History = lazy(() => import('@/pages/History'));
const Settings = lazy(() => import('@/pages/Settings'));
const NodeSettings = lazy(() => import('@/pages/NodeSettings'));
const Swap = lazy(() => import('@/pages/Swap'));
const Dapps = lazy(() => import('@/pages/Dapps'));
const Market = lazy(() => import('@/pages/Market'));
const BuyCrypto = lazy(() => import('@/pages/BuyCrypto'));
const NftMarketplace = lazy(() => import('@/pages/NftMarketplace'));
const Earn = lazy(() => import('@/pages/Earn'));
const WalletManagement = lazy(() => import('@/pages/WalletManagement'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Welcome = lazy(() => import('@/pages/Welcome'));
const CreatePin = lazy(() => import('@/pages/CreatePin'));
const VerifyPin = lazy(() => import('@/pages/VerifyPin'));


function AppRoutes() {
  const { wallet } = useWallet();
  const location = useLocation();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<Send />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/node-settings" element={<NodeSettings />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/dapps" element={<Dapps />} />
        <Route path="/market" element={<Market />} />
        <Route path="/buy-crypto" element={<BuyCrypto />} />
        <Route path="/nft" element={<NftMarketplace />} />
        <Route path="/earn" element={<Earn />} />
        <Route path="/wallets" element={<WalletManagement />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-pin" element={<CreatePin />} />
        <Route path="/verify-pin" element={<VerifyPin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </Suspense>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <AppRoutes />
    </WalletProvider>
  );
}
