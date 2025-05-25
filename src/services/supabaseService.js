
import { supabase } from '@/lib/supabaseClient';

export const signUpUser = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signInUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  if (!session) return null;
  
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return null;
  
  return user.user;
};


export const getProfile = async (userId) => {
  if (!userId) return { data: null, error: { message: "User ID is required" } };
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const getProfileByUserId = async (userId) => {
  if (!userId) return { data: null, error: { message: "User ID is required" } };
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const createProfile = async (profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profileData])
    .select()
    .single();
  return { data, error };
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

export const getTransactions = async (userId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });
  return { data, error };
};

export const addTransaction = async (transactionData) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transactionData])
    .select()
    .single();
  return { data, error };
};

export const findProfileByAddress = async (walletAddress) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();
  return { data, error };
};

export const performInternalTransfer = async (senderId, recipientId, amount, senderCurrentBalance, recipientCurrentBalance, memo = '') => {
  try {
    const newSenderBalance = parseFloat(senderCurrentBalance) - parseFloat(amount);
    const newRecipientBalance = parseFloat(recipientCurrentBalance) + parseFloat(amount);

    if (newSenderBalance < 0) {
      throw new Error("Saldo pengirim tidak mencukupi.");
    }

    const { error: senderUpdateError } = await supabase
      .from('profiles')
      .update({ btc_balance: newSenderBalance })
      .eq('id', senderId);

    if (senderUpdateError) throw senderUpdateError;

    const { error: recipientUpdateError } = await supabase
      .from('profiles')
      .update({ btc_balance: newRecipientBalance })
      .eq('id', recipientId);

    if (recipientUpdateError) {
      await supabase
        .from('profiles')
        .update({ btc_balance: senderCurrentBalance })
        .eq('id', senderId);
      throw recipientUpdateError;
    }

    await addTransaction({
      user_id: senderId,
      type: 'internal_transfer_send',
      amount: parseFloat(amount),
      related_user_id: recipientId,
      memo: memo || `Transfer ke pengguna internal`,
      status: 'completed',
    });

    await addTransaction({
      user_id: recipientId,
      type: 'internal_transfer_receive',
      amount: parseFloat(amount),
      related_user_id: senderId,
      memo: memo || `Terima dari pengguna internal`,
      status: 'completed',
    });

    return { data: { newSenderBalance, newRecipientBalance }, error: null };

  } catch (error) {
    console.error("Error performing internal transfer:", error);
    return { data: null, error };
  }
};
