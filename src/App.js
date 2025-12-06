import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { v4 as uuid } from 'uuid';

import { updateAccountBalance } from './utils'

import Accounts from './components/codes/Accounts'
import Transactions from './components/codes/Transactions'
import RecentTransactions from './components/codes/RecentTransactions'
import Buttons from './components/codes/Buttons'
import AddTransaction from './components/codes/AddTransaction'
import Transfer from './components/codes/Transfer'
import AddAccount from './components/codes/AddAccount'
import ChangeAccount from './components/codes/ChangeAccount'
import ChangeTransaction from './components/codes/ChangeTransaction'
import DeleteAllBtn from './components/codes/DeleteAllBtn'
import Layout from './Layout';
import { loadData } from './utils'

function App() {
  const defaultExpenseCategories = ["Food", "Rent", "Utilities", "Entertainment", "Transportation", "Healthcare", "Shopping", "Subscriptions", "Education", "Travel"];
  const defaultIncomeCategories = ["Salary", "Crypto", "Interests", "Business", "Gifts", "Rewards", "Side Hustle"];
  const loadedCategories = loadData('categories') || {};

  const [accounts, setAccounts] = useState(loadData('accounts'));
  const [transactions, setTransactions] = useState(loadData('transactions'));
  const [categories, setCategories] = useState({ expense: loadedCategories.expense || defaultExpenseCategories, income: loadedCategories.income || defaultIncomeCategories });
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('theme', theme);
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [accounts, transactions, theme, categories]);

  useEffect(() => {
    document.body.setAttribute('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  function addTransaction(transaction, targetAccount) {
    const id = uuid();
    setTransactions([...transactions, { id, ...transaction }])
    setAccounts(updateAccountBalance(accounts, targetAccount.id, transaction.amount));
  }

  function transfer(from, to, amount, date, exchangeRate) {
    const fromAccount = accounts.find((a) => a.id === from)
    const toAccount = accounts.find((a) => a.id === to)
    const amountExchanged = amount * exchangeRate;
    const updatedAccounts = updateAccountBalance(
      updateAccountBalance(accounts, fromAccount.id, -amount),
      toAccount.id,
      amountExchanged
    );

    setAccounts(updatedAccounts);
    const id1 = uuid();
    const id2 = uuid();
    const newTransaction1 = { id: id1, category: "Transfer", amount: amount, currency: fromAccount.currency, type: 'expense', method: fromAccount.id, date: date }
    const newTransaction2 = { id: id2, category: "Transfer", amount: amountExchanged, currency: toAccount.currency, type: 'income', method: toAccount.id, date: date }
    setTransactions([...transactions, newTransaction1, newTransaction2])
  }

  function addAccount(account) {
    const id = uuid();
    const newAccount = { id, ...account }
    setAccounts([...accounts, newAccount])
  }

  function changeAccount(changedAccount) {
    const updatedAccounts = accounts.map((a) =>
      a.id === changedAccount.id ? changedAccount : a
    );
    setAccounts(updatedAccounts);
  }

  function deleteAccount(id) {
    const updatedTransactions = transactions.filter((t) => t.method !== id);
    setTransactions(updatedTransactions);
    const updatedAccounts = accounts.filter((a) => a.id !== id);
    setAccounts(updatedAccounts);
  }

  function changeTransaction(changed) {
    const prev = transactions.find(t => t.id === changed.id);

    const accountOld = accounts.find(a => a.id === changed.method);
    const accountNew = accounts.find(a => a.id === prev.method);
    if (prev.type === "income") {
      accountOld.balance -= prev.amount;
    } else {
      accountOld.balance += prev.amount;
    }
    if (changed.type === "income") {
      accountNew.balance += changed.amount;
    } else {
      accountNew.balance -= changed.amount;
    }
    const updatedAccounts = accounts.map(a =>
      a.id === accountOld.id ? { ...accountOld } : a.id === accountNew.id ? { ...accountNew } : a
    );
    setAccounts(updatedAccounts);
    const updatedTransactions = transactions.map(t =>
      t.id === changed.id ? changed : t
    );
    setTransactions(updatedTransactions);
  }

  function deleteTransaction(id) {
    const deletedTransaction = transactions.find((t) => t.id === id);

    const updatedAccounts = accounts.map((a) => {
      if (a.id !== deletedTransaction.method) return a;

      const newBalance =
        deletedTransaction.type === "income"
          ? a.balance - deletedTransaction.amount
          : a.balance + deletedTransaction.amount;

      return { ...a, balance: newBalance };
    });

    setAccounts(updatedAccounts);

    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
  }


  function deleteAll() {
    if (!window.confirm("Are you sure you want to delete everything?")) {
      return;
    }
    setAccounts([])
    setTransactions([])
    localStorage.clear()
  }

  function exportData() {
    const accounts = loadData("accounts");
    const transactions = loadData("transactions");
    const theme = loadData("theme");
    const categories = loadData("categories");
    const json = JSON.stringify({ accounts, transactions, theme, categories }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'wallet_data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.click();

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const data = JSON.parse(text);
          if (!data.accounts || !data.transactions) {
            alert("Invalid backup file.");
            return;
          }
          setAccounts(data.accounts);
          setTransactions(data.transactions);
          setTheme(data.theme || 'dark');
          setCategories(data.categories || { expense: defaultExpenseCategories, income: defaultIncomeCategories });
          localStorage.setItem('accounts', JSON.stringify(data.accounts));
          localStorage.setItem('transactions', JSON.stringify(data.transactions));
          localStorage.setItem('theme', JSON.stringify(data.theme) || 'dark');
          localStorage.setItem('categories', JSON.stringify(data.categories || { expense: defaultExpenseCategories, income: defaultIncomeCategories }));
          alert("Data imported successfully.");
        } catch (error) {
          alert("Error reading backup file.");
        }
      }
      reader.readAsText(file);
    }
  }

  function addCategory(type, name) {
    setCategories(prev => {
      const updated = { ...prev };
      updated[type] = [...prev[type], name];
      localStorage.setItem('categories', JSON.stringify(updated));
      return updated;
    });
  }

  function deleteCategory(type, name) {
    setCategories(prev => {
      const updated = { ...prev, [type]: prev[type].filter(c => c !== name) };
      localStorage.setItem('categories', JSON.stringify(updated));
      return updated;
    });
  }


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route element={
            <Layout toggleTheme={toggleTheme} theme={theme} exportData={exportData} importData={importData} />
          }>
            <Route path='/' element={
              <>
                <Accounts accounts={accounts} />
                <RecentTransactions transactions={transactions} accounts={accounts} />
                <Buttons accounts={accounts} />
                <DeleteAllBtn deleteAll={deleteAll} />
              </>
            } />
            <Route path='income' element={
              <AddTransaction addTransaction={addTransaction} addCategory={addCategory} type={"income"} accounts={accounts} categories={categories} deleteCategory={deleteCategory}/>
            } />
            <Route path='expense' element={
              <AddTransaction addTransaction={addTransaction} addCategory={addCategory} type={"expense"} accounts={accounts} categories={categories} deleteCategory={deleteCategory}/>
            } />
            <Route path='transfer' element={
              <Transfer transfer={transfer} accounts={accounts} />
            } />
            <Route path='addAccount' element={
              <AddAccount addAccount={addAccount} />
            } />
            <Route path='changeAccount/:id' element={
              <ChangeAccount changeAccount={changeAccount} deleteAccount={deleteAccount} />
            } />
            <Route path='changeTransaction/:id' element={
              <ChangeTransaction changeTransaction={changeTransaction} deleteTransaction={deleteTransaction} addCategory={addCategory} deleteCategory={deleteCategory} categories={categories} />
            } />
            <Route path='transactions' element={
              <Transactions transactions={transactions} accounts={accounts} />
            } />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;