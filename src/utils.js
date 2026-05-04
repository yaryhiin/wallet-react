import { isAuthApiError } from '@supabase/supabase-js';
import { supabase } from './supabase';

export function updateAccountBalance(accounts, id, change) {
    const updatedAccount = accounts.find((account) =>
        account.id === id
    );

    if (!updatedAccount) return null;

    return { ...updatedAccount, balance: limitToDecimals(updatedAccount.balance + change, 2) }
}

export async function getData(key) {
    const { data, error } = await supabase
        .from(key)
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching data:', error);
        return [];
    }

    return data || [];
}

export async function createAccount(account, userId) {
    const { data, error } = await supabase
        .from('accounts')
        .insert({
            user_id: userId,
            name: account.name,
            balance: account.balance,
            currency: account.currency,
            icon: account.icon,
        })
        .select();

    if (error) {
        console.error('Error creating account:', error);
        return null;
    }

    return data?.[0] || null;
}

export async function updateData(key, updatedData) {
    const { id, ...updates } = updatedData;
    const { data, error } = await supabase
        .from(key)
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        console.error(`Error updating ${key}:`, error.message);
        return null;
    }

    return data?.[0] || null;
}

export async function deleteData(key, itemId) {
    const { error } = await supabase
        .from(key)
        .delete()
        .eq('id', itemId);

    if (error) {
        console.error(`Error deleting data from ${key}:`, error.message);
        return false;
    }

    return true;
}

export async function deleteTransactionsByAccount(accountId) {
    const {error} = await supabase
    .from('transactions')
    .delete()
    .eq('method', accountId);

    if(error) {
        console.error(`Error deleting related transactions:`, error.message);
        return false;
    }

    return true;
}

export async function createTransaction(transaction) {
    const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select();

    if (error) {
        console.error('Error creating transaction:', error);
        return null;
    }

    return data?.[0] || null;
}

export function limitToDecimals(value, decimals) {
    if (value === "" || value === null) return "";

    const numberValue = Number(value);

    if (isNaN(numberValue)) return "";

    const factor = 10 ** decimals;
    return Math.trunc(numberValue * factor) / factor;
}

export const getFormattedLocalDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const pad = (num) => num.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-CA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export const fetchRate = async (fromCurrency, toCurrency) => {
    if (!fromCurrency || !toCurrency) return;
    if (fromCurrency === toCurrency) return '1';

    try {
        const res = await fetch(
            `https://api.frankfurter.dev/v2/rates?base=${fromCurrency}&quotes=${toCurrency}`
        );
        const data = await res.json();
        if (!data.length || data[0].rate === undefined) {
            return null;
        }
        return data[0].rate;
    } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        return null;
    }
}

export const fetchCurrencies = async () => {
    try {
        const res = await fetch(`https://api.frankfurter.dev/v2/currencies`);
        const data = await res.json();
        if (!data.length || data === undefined) {
            return null;
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch currencies:', error);
        return {};
    }
}

export const getAuthErrorMessage = (error) => {
    if (!error) return null

    if (isAuthApiError(error)) {
        if (
            error.status === 400 &&
            error.message === 'Invalid login credentials'
        ) {
            return 'Wrong email or password'
        }

        switch (error.code) {
            case 'email_not_confirmed':
                return 'Please confirm your email'
            case 'email_exists':
                return 'Email already registered'
            case 'weak_password':
                return 'Password is too weak'
            case 'email_address_invalid':
                return 'Invalid email'
            case 'over_email_send_rate_limit':
            case 'over_request_rate_limit':
                return 'Too many attempts. Try again later'
            default:
                console.error('Unhandled Supabase auth error:', error)
                return 'Something went wrong'
        }
    }

    console.error('Non-Supabase auth error:', error)
    return 'Unexpected error'
}