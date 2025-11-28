import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

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
    const id = Math.floor(Math.random() * 10000) + 1
    setTransactions([...transactions, { id, ...transaction }])

    setAccounts(updateAccountBalance(accounts, accountWithMethod.id, transaction.amount));
  }

  function transfer(from, to, amount, date, exchangeRate) {
    const fromAccount = accounts.find((account) => account.id === from)
    const toAccount = accounts.find((account) => account.id === to)
    fromAccount.balance -= amount;
    let updatedAccounts = accounts.map((account) =>
      account.id === fromAccount.id ? fromAccount : account
    );
    const id1 = Math.floor(Math.random() * 10000) + 1
    const id2 = Math.floor(Math.random() * 10000) + 1
    const newTransaction1 = { id: id1, category: "Transfer", amount: amount, currency: fromAccount.currency, type: 'expense', method: fromAccount.id, date: date }
    const newTransaction2 = { id: id2, category: "Transfer", amount: amount * exchangeRate, currency: toAccount.currency, type: 'income', method: toAccount.id, date: date }
    setTransactions([...transactions, newTransaction1, newTransaction2])
    toAccount.balance += amount * exchangeRate;
    updatedAccounts = accounts.map((account) =>
      account.id === toAccount.id ? toAccount : account
    );
    setAccounts(updatedAccounts);
  }

  function addAccount(account) {
    const id = Math.floor(Math.random() * 10000) + 1
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
    const updatedAccounts = accounts.filter((account) => account.id !== id);
    setAccounts(updatedAccounts);
    const updatedTransactions = transactions.filter((transaction) => transaction.method !== id);
    setTransactions(updatedTransactions);
  }

  function changeTransaction(changedTransaction) {
    const previousTransaction = transactions.find((transaction) => transaction.id === changedTransaction.id)
    const accountToChange = accounts.find((account) => account.id === changedTransaction.method);
    if (previousTransaction.type === 'income' && changedTransaction.type === 'expense') {
      accountToChange.balance -= previousTransaction.amount;
      accountToChange.balance -= changedTransaction.amount;
      const updatedAccounts = accounts.map((account) =>
        account.id === accountToChange.id ? accountToChange : account
      );
      setAccounts(updatedAccounts);
    }
    else if (previousTransaction.type === 'expense' && changedTransaction.type === 'income') {
      accountToChange.balance += previousTransaction.amount;
      accountToChange.balance += changedTransaction.amount;
      const updatedAccounts = accounts.map((account) =>
        account.id === accountToChange.id ? accountToChange : account
      );
      setAccounts(updatedAccounts);
    }
    else if (previousTransaction.amount !== changedTransaction.amount) {
      if (previousTransaction.type === 'income') {
        accountToChange.balance -= previousTransaction.amount
        accountToChange.balance += changedTransaction.amount
        const updatedAccounts = accounts.map((account) =>
          account.id === accountToChange.id ? accountToChange : account
        );
        setAccounts(updatedAccounts);
      } else if (previousTransaction.type === 'expense') {
        accountToChange.balance += previousTransaction.amount
        accountToChange.balance -= changedTransaction.amount
        const updatedAccounts = accounts.map((account) =>
          account.id === accountToChange.id ? accountToChange : account
        );
        setAccounts(updatedAccounts);
      }
    }
    const updatedTransactions = transactions.map((transaction) => transaction.id === changedTransaction.id ? changedTransaction : transaction)
    setTransactions(updatedTransactions)
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