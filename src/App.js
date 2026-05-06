import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { supabase } from './supabase'

import { updateAccountBalance, limitToDecimals, getData, createData, createCategories, updateData, deleteData, deleteTransactionsByAccount } from './utils'

import Accounts from './components/codes/Accounts'
import Transactions from './components/codes/Transactions'
import RecentTransactions from './components/codes/RecentTransactions'
import Buttons from './components/codes/Buttons'
import AddTransaction from './components/codes/AddTransaction'
import Transfer from './components/codes/Transfer'
import AddAccount from './components/codes/AddAccount'
import ChangeAccount from './components/codes/ChangeAccount'
import ChangeTransaction from './components/codes/ChangeTransaction'
import SignUp from './components/codes/SignUp'
import Login from "./components/codes/Login";
import Layout from './Layout';
import WelcomeScreen from './components/codes/WelcomeScreen';
const defaultExpenseCategories = ["Food", "Rent", "Utilities", "Entertainment", "Transportation", "Healthcare", "Shopping", "Subscriptions", "Education", "Travel"];
const defaultIncomeCategories = ["Salary", "Crypto", "Interests", "Business", "Gifts", "Rewards", "Side Hustle"];

function App() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      setAuthLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log('Error fetching session:', error);
      }
      setSession(data.session);
      setAuthLoading(false);
      console.log('Session loaded:', data.session);
    }

    loadSession();

    const { data: { subscription }, } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
      console.log('Auth state changed:', session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function loadData() {
      setDataLoading(true);
      try {
        const [accountsData, transactionsData, categoriesData] = await Promise.all([getData('accounts'), getData('transactions'), getData('categories')]);
        if (categoriesData.length === 0) {
          const newExpenseCategories = (defaultExpenseCategories.map((c) => ({ user_id: session.user.id, type: "expense", name: c })))
          const newIncomeCategories = (defaultIncomeCategories.map((c) => ({ user_id: session.user.id, type: "income", name: c })))
          const newCategories = [...newExpenseCategories, ...newIncomeCategories];
          const updatedCategories = await createCategories(newCategories);
          if (!updatedCategories) return;
          setCategories(updatedCategories);
        } else {
          setCategories(categoriesData);
        }
        setAccounts(accountsData);
        setTransactions(transactionsData);
      } finally {
        setDataLoading(false);
      }
    }

    if (session) {
      loadData();
    } else {
      setDataLoading(false);
    }
  }, [session])

  useEffect(() => {
    document.documentElement.setAttribute('theme', theme);
    localStorage.setItem('theme', theme)
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  async function addTransaction(transaction, targetAccount) {
    const newTransaction = await createData('transactions', { user_id: session.user.id, ...transaction });
    if (!newTransaction) return;
    setTransactions((prev) => ([...prev, newTransaction]));
    let transactionAmount = transaction.amount;
    if (transaction.type === 'expense') {
      transactionAmount = -transaction.amount;
    }
    const changedAccount = updateAccountBalance(accounts, targetAccount.id, transactionAmount);
    const updatedAccount = await updateData('accounts', changedAccount)
    if (!updatedAccount) return;
    setAccounts((prev) => (prev.map((a) =>
      a.id === updatedAccount.id ? updatedAccount : a
    )));
  }

  async function changeTransaction(changed) {
    const prev = transactions.find(t => t.id === changed.id);
    if (!prev) return;

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
    const updatedAccountOld = await updateData('accounts', accountOld);
    const updatedAccountNew = await updateData('accounts', accountNew);
    setAccounts((prev) => (prev.map(a =>
      a.id === updatedAccountOld.id ? { ...updatedAccountOld } : a.id === updatedAccountNew.id ? { ...updatedAccountNew } : a
    )));
    const updatedTransaction = await updateData('transactions', changed)
    if (!updatedTransaction) return;
    setTransactions((prev) => (prev.map(t =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    )));
  }

  async function deleteTransaction(id) {
    const deletedTransaction = transactions.find((t) => t.id === id);

    const changedAccount = accounts.find(a => a.id === deletedTransaction.method)

    const updatedBalance =
      deletedTransaction.type === 'income'
        ? changedAccount.balance - deletedTransaction.amount
        : changedAccount.balance + deletedTransaction.amount;

    const updatedAccountData = {
      ...changedAccount,
      balance: updatedBalance,
    };
    const updatedAccount = await updateData('accounts', updatedAccountData)

    if (!updatedAccount) return;

    setAccounts((prev) => (prev.map((a) =>
      a.id === updatedAccount.id ? updatedAccount : a
    )));

    const transactionDeleted = await deleteData('transactions', id, session.user.id);

    if (!transactionDeleted) return;

    setTransactions((prev) => (prev.filter((t) => t.id !== id)));
  }

  async function transfer(from, to, amount, date, exchangeRate) {
    const fromAccount = accounts.find((a) => a.id === from)
    const toAccount = accounts.find((a) => a.id === to)
    const amountExchanged = limitToDecimals(amount * exchangeRate, 2);
    const changedAccount1 = updateAccountBalance(accounts, fromAccount.id, -amount)
    const changedAccount2 = updateAccountBalance(accounts, toAccount.id, amountExchanged)

    const updatedAccount1 = await updateData('accounts', changedAccount1);
    if (!updatedAccount1) return;

    const updatedAccount2 = await updateData('accounts', changedAccount2);
    if (!updatedAccount2) return;

    setAccounts((prev) =>
      prev.map((a) =>
        a.id === updatedAccount1.id
          ? updatedAccount1
          : a.id === updatedAccount2.id
            ? updatedAccount2
            : a
      )
    );

    const newTransaction1 = await createData('transactions', { user_id: session.user.id, category: "Transfer", amount: -amount, currency: fromAccount.currency, type: 'expense', method: fromAccount.id, date: date },)
    const newTransaction2 = await createData('transactions', { user_id: session.user.id, category: "Transfer", amount: amountExchanged, currency: toAccount.currency, type: 'income', method: toAccount.id, date: date })

    if (!newTransaction1 || !newTransaction2) return;

    setTransactions((prev) => ([...prev, newTransaction1, newTransaction2]))
  }

  async function addAccount(account) {
    const newAccount = await createData('accounts', { user_id: session.user.id, ...account });

    if (!newAccount) return;

    setAccounts((prev) => [...prev, newAccount])
  }

  async function changeAccount(changedAccount) {
    const updatedAccount = await updateData('accounts', changedAccount)

    if (!updatedAccount) return;

    setAccounts((prev) => (prev.map((a) =>
      a.id === updatedAccount.id ? updatedAccount : a
    )));
  }

  async function deleteAccount(id) {
    const transactionsDeleted = await deleteTransactionsByAccount(id);

    if (!transactionsDeleted) return;

    const accountDeleted = await deleteData('accounts', id, session.user.id);

    if (!accountDeleted) return;

    setTransactions((prev) => (prev.filter((t) => t.method !== id)));
    setAccounts((prev) => (prev.filter((a) => a.id !== id)));
  }

  async function addCategory(category) {
    const newCategory = await createData('categories', { user_id: session.user.id, ...category });
    if (!newCategory) return;
    setCategories((prev) => [...prev, category]);
    return newCategory;
  }

  async function deleteCategory(id) {
    const deletedCategory = await deleteData('categories', id, session.user.id)
    setCategories((prev) => prev.filter((p) => p.id !== id));
    return deletedCategory;
  }

  if (authLoading) return <div>Loading...</div>
  if (session && dataLoading) return <div>Loading...</div>
  return (
    <Router>
      <div className="App">
        <Routes>
          {!session ? (
            <>
              <Route path='/' element={
                <WelcomeScreen toggleTheme={toggleTheme} theme={theme} />
              } />
              <Route path='signup' element={
                <SignUp toggleTheme={toggleTheme} theme={theme} />
              } />
              <Route path='login' element={
                <Login toggleTheme={toggleTheme} theme={theme} />
              } />
            </>
          ) : (
            <>
              <Route
                path="/"
                element={
                  accounts.length === 0 ? (
                    <Layout toggleTheme={toggleTheme} theme={theme}>
                      <AddAccount addAccount={addAccount} back={false} />
                    </Layout>
                  ) : (
                    <Layout toggleTheme={toggleTheme} theme={theme}>
                      <Accounts accounts={accounts} />
                      <RecentTransactions transactions={transactions} accounts={accounts} />
                      <Buttons accounts={accounts} />
                    </Layout>
                  )
                }
              />

              <Route path="/signup" element={<Navigate to="/" replace />} />
              <Route path="/login" element={<Navigate to="/" replace />} />

              <Route element={
                <Layout toggleTheme={toggleTheme} theme={theme} />
              }>
                <Route path='income' element={
                  <AddTransaction addTransaction={addTransaction} addCategory={addCategory} type={"income"} accounts={accounts} categories={categories} deleteCategory={deleteCategory} />
                } />
                <Route path='expense' element={
                  <AddTransaction addTransaction={addTransaction} addCategory={addCategory} type={"expense"} accounts={accounts} categories={categories} deleteCategory={deleteCategory} />
                } />
                <Route path='transfer' element={
                  <Transfer transfer={transfer} accounts={accounts} />
                } />
                <Route path='addAccount' element={
                  <AddAccount addAccount={addAccount} back={true} />
                } />
                <Route path='changeAccount/:id' element={
                  <ChangeAccount accounts={accounts} changeAccount={changeAccount} deleteAccount={deleteAccount} />
                } />
                <Route path='changeTransaction/:id' element={
                  <ChangeTransaction accounts={accounts} transactions={transactions} changeTransaction={changeTransaction} deleteTransaction={deleteTransaction} addCategory={addCategory} deleteCategory={deleteCategory} categories={categories} />
                } />
                <Route path='transactions' element={
                  <Transactions transactions={transactions} accounts={accounts} />
                } />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;