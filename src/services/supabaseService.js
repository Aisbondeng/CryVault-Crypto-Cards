// supabaseService.js
import { supabase } from '@/lib/supabaseClient';

export const signUpUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
  } catch (err) {
    console.error('SignUp Error:', err);
    return { data: null, error: err };
  }
};

export const signInUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  } catch (err) {
    console.error('SignIn Error:', err);
    return { data: null, error: err };
  }
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;

  const { data: user, error: userError } = await supabase.auth.getUser();
  return userError || !user ? null : user.user;
};

// PROFILE

export const getProfile = async (userId) => {
  if (!userId) return { data: null, error: { message: 'User ID is required' } };
  return await supabase.from('profiles').select('*').eq('id', userId).single();
};

export const getProfileByUserId = getProfile;

export const createProfile = async (profileData) => {
  return await supabase.from('profiles').insert([profileData]).select().single();
};

export const updateProfile = async (userId, updates) => {
  return await supabase.from('profiles').update(updates).eq('id', userId).select().single();
};

export const findProfileByAddress = async (walletAddress) => {
  return await supabase.from('profiles').select('*').eq('wallet_address', walletAddress).single();
};

// TRANSACTIONS

export const getTransactions = async (userId) => {
  return await supabase.from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });
};

export const addTransaction = async (transactionData) => {
  return await supabase.from('transactions').insert([transactionData]).select().single();
};

// INTERNAL TRANSFER

export const performInternalTransfer = async (
  senderId, recipientId, amount, senderCurrentBalance, recipientCurrentBalance, memo = ''
) => {
  try {
    const amt = parseFloat(amount);
    const newSenderBalance = parseFloat(senderCurrentBalance) - amt;
    const newRecipientBalance = parseFloat(recipientCurrentBalance) + amt;

    if (newSenderBalance < 0) throw new Error('Saldo pengirim tidak mencukupi.');

    const { error: senderUpdateError } = await supabase
      .from('profiles').update({ btc_balance: newSenderBalance }).eq('id', senderId);
    if (senderUpdateError) throw senderUpdateError;

    const { error: recipientUpdateError } = await supabase
      .from('profiles').update({ btc_balance: newRecipientBalance }).eq('id', recipientId);
    if (recipientUpdateError) {
      await supabase.from('profiles').update({ btc_balance: senderCurrentBalance }).eq('id', senderId);
      throw recipientUpdateError;
    }

    await addTransaction({
      user_id: senderId,
      type: 'internal_transfer_send',
      amount: amt,
      related_user_id: recipientId,
      memo: memo || 'Transfer ke pengguna internal',
      status: 'completed',
    });

    await addTransaction({
      user_id: recipientId,
      type: 'internal_transfer_receive',
      amount: amt,
      related_user_id: senderId,
      memo: memo || 'Terima dari pengguna internal',
      status: 'completed',
    });

    return {
      data: { newSenderBalance, newRecipientBalance },
      error: null,
    };

  } catch (error) {
    console.error('Transfer Error:', error);
    return { data: null, error };
  }
};
