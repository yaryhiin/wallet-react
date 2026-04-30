export function updateAccountBalance(accounts, id, change) {
    const updatedAccounts = accounts.map((account) =>
        account.id === id ? { ...account, balance: limitToDecimals(account.balance + change, 2) } : account
    );
    return (updatedAccounts);
}

export const loadData = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
};

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
        // if (!data.length || data === undefined) {
        //     return null;
        // }
        console.log(data);
        return data;
    } catch (error) {
        console.error('Failed to fetch currencies:', error);
        return {};
    }
}