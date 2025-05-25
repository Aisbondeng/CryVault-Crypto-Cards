
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient.js';
import { getProfileByUserId, createProfile } from '@/services/supabaseService.js';
import { useToast } from '@/components/ui/use-toast.js';

const generateWalletAddress = () => {
  const prefix = 'tb1q'; 
  const characters = '023456789acdefghjklmnpqrstuvwxyz'; 
  let result = '';
  for (let i = 0; i < 38; i++) { 
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return prefix + result;
};


export const useAuth = () => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [profile, setProfileState] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [authLoading, setAuthLoading] = useState(false); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);


  const fetchUserAndProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setProfileState(null);
      setIsAuthenticated(false);
      return null;
    }
    
    const { data, error } = await getProfileByUserId(currentUser.id);
    if (error && error.code !== 'PGRST116') { 
      toast({ variant: "destructive", title: "Error Memuat Profil", description: `Gagal memuat profil: ${error.message}` });
      setProfileState(null);
      setIsAuthenticated(false);
      return null;
    }
    if (data) {
        setProfileState(data);
        setIsAuthenticated(true);
        return data;
    }
    
    setIsAuthenticated(false); 
    return null;
  }, [toast]);

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      if (!isMounted) return;
      setLoading(true);
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (isMounted) {
            if (currentSession?.user) {
                setUser(currentSession.user);
                await fetchUserAndProfile(currentSession.user);
            } else {
                setUser(null);
                setProfileState(null);
                setIsAuthenticated(false);
            }
        }
      } catch (e) {
        if (isMounted) {
            console.error("Error initializing auth:", e);
            setUser(null);
            setProfileState(null);
            setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
            setLoading(false);
            setIsAuthInitialized(true);
        }
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      setLoading(true);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserAndProfile(session.user);
      } else {
        setProfileState(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
      if (!isAuthInitialized && isMounted) setIsAuthInitialized(true);
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [fetchUserAndProfile, isAuthInitialized]);

  const login = async (email, password) => {
    setAuthLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ variant: "destructive", title: "Login Gagal", description: error.message });
      setAuthLoading(false);
      return { success: false, error };
    }
    if (data.user) {
      setUser(data.user);
      await fetchUserAndProfile(data.user);
      toast({ title: "Login Berhasil", description: "Selamat datang kembali!", className: "bg-green-600 text-white" });
      setAuthLoading(false);
      return { success: true, user: data.user };
    }
    setAuthLoading(false);
    return { success: false, error: { message: "Login gagal, pengguna tidak ditemukan."} };
  };

  const register = async (email, password, walletName = null) => {
    setAuthLoading(true);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      toast({ variant: "destructive", title: "Registrasi Gagal", description: signUpError.message });
      setAuthLoading(false);
      return { success: false, error: signUpError };
    }

    if (signUpData.user) {
      const newWalletAddress = generateWalletAddress();
      const defaultWalletName = walletName || `Wallet-${email.split('@')[0]}`;
      
      const { data: newProfile, error: profileError } = await createProfile({
        id: signUpData.user.id,
        email: signUpData.user.email,
        wallet_name: defaultWalletName,
        btc_balance: 0,
        wallet_address: newWalletAddress,
      });

      if (profileError) {
        toast({ variant: "destructive", title: "Pembuatan Profil Gagal", description: profileError.message });
        setAuthLoading(false);
        return { success: false, error: profileError };
      }
      
      setUser(signUpData.user);
      setProfileState(newProfile); 
      setIsAuthenticated(true);
      toast({ title: "Registrasi Berhasil", description: "Akun Anda telah dibuat. Silakan cek email untuk konfirmasi.", className: "bg-green-600 text-white" });
      setAuthLoading(false);
      return { success: true, user: signUpData.user, profile: newProfile };
    }
    setAuthLoading(false);
    return { success: false, error: {message: "Registrasi gagal, pengguna tidak terbuat."} };
  };

  const logout = async () => {
    setAuthLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ variant: "destructive", title: "Logout Gagal", description: error.message });
    } else {
      setUser(null);
      setProfileState(null);
      setIsAuthenticated(false);
      toast({ title: "Logout Berhasil", description: "Anda telah keluar.", className: "bg-neutral-800 text-foreground border-neutral-700" });
    }
    setAuthLoading(false);
  };
  
  const setProfile = (newProfile) => {
    setProfileState(newProfile);
  };

  return { user, profile, login, register, logout, loading, authLoading, isAuthenticated, fetchUserAndProfile, isAuthInitialized, setProfile };
};
