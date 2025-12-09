export function updateAccountBalance(accounts, id, change) {
    const updatedAccounts = accounts.map((account) =>
        account.id === id ? { ...account, balance: limitToTwoDecimals(account.balance + change) } : account
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

export function limitToTwoDecimals(value) {
    if (value === "" || value === null) return "";

    const str = value.toString();
    const cleaned = str.includes('.')
        ? str.replace(/(\.\d{2}).*$/, '$1')
        : str;

    const numberValue = parseFloat(cleaned);

    return isNaN(numberValue) ? "" : numberValue;
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