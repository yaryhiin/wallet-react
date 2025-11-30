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
import ThemeSwitch from './components/codes/ThemeSwitch'
import { loadData } from './utils'

function App() {
  const [accounts, setAccounts] = useState(loadData('accounts'));
  const [transactions, setTransactions] = useState(loadData('transactions'));
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
  }, [accounts, transactions, theme]);

  useEffect(() => {
    document.body.setAttribute('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  function addTransaction(transaction, accountWithMethod) {
    const id = uuid();
    setTransactions([...transactions, { id, ...transaction }])

    setAccounts(updateAccountBalance(accounts, accountWithMethod.id, transaction.amount));
  }

  function transfer(from, to, amount, date, exchangeRate) {
    const fromAccount = accounts.find((account) => account.id === from)
    const toAccount = accounts.find((account) => account.id === to)
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
    const newTransaction2 = { id: id2, category: "Transfer", amount: amount * exchangeRate, currency: toAccount.currency, type: 'income', method: toAccount.id, date: date }
    setTransactions([...transactions, newTransaction1, newTransaction2])
  }

  function addAccount(account) {
    const id = uuid();
    const newAccount = { id, ...account }
    setAccounts([...accounts, newAccount])
  }

  function changeAccount(changedAccount) {
    const updatedAccounts = accounts.map((account) =>
      account.id === changedAccount.id ? changedAccount : account
    );
    setAccounts(updatedAccounts);
  }

  function deleteAccount(id) {
    const updatedTransactions = transactions.filter((transaction) => transaction.method !== id);
    setTransactions(updatedTransactions);
    const updatedAccounts = accounts.filter((account) => account.id !== id);
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
    const deletedTransaction = transactions.find((transaction) => transaction.id === id);
    let accountToChange = accounts.find((account) => account.id === deletedTransaction.method);
    if (deletedTransaction.type === 'income') {
      accountToChange.balance -= deletedTransaction.amount;
      const updatedAccounts = accounts.map((account) =>
        account.id === accountToChange.id ? accountToChange : account
      );
      setAccounts(updatedAccounts);
    } else if (deletedTransaction.type === 'expense') {
      accountToChange.balance += deletedTransaction.amount;
      const updatedAccounts = accounts.map((account) =>
        account.id === accountToChange.id ? accountToChange : account
      );
      setAccounts(updatedAccounts);
    }
    const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
    setTransactions(updatedTransactions);
  }

  function deleteAll() {
    let result = window.confirm("Are you sure you want to delete everything?")
    if (result) {
      setAccounts([])
      setTransactions([])
      localStorage.clear()
    }
  }

  return (
    <Router>
      <div className="body">
        <Routes>
          <Route path='/' element={
            <>
              <ThemeSwitch toggleTheme={toggleTheme} theme={theme} />
              <Accounts accounts={accounts} />
              <RecentTransactions transactions={transactions} accounts={accounts} />
              <Buttons accounts={accounts} />
              <DeleteAllBtn deleteAll={deleteAll} />
            </>
          } />
          <Route path='income' element={
            <AddTransaction addTransaction={addTransaction} type={"income"} accounts={accounts} />
          } />
          <Route path='expense' element={
            <AddTransaction addTransaction={addTransaction} type={"expense"} accounts={accounts} />
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
            <ChangeTransaction changeTransaction={changeTransaction} deleteTransaction={deleteTransaction} />
          } />
          <Route path='transactions' element={
            <Transactions transactions={transactions} accounts={accounts} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;