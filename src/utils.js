export function updateAccountBalance(accounts, id, change) {
    const updatedAccounts = accounts.map((account) =>
        account.id === id ? { ...account, balance: account.balance + change } : account
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