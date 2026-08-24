import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchCurrencies } from '../../utils'
import styles from '../styles/FormLayout.module.scss'
import cn from 'classnames';

const AddAccount = ({ addAccount, back }) => {
  const location = useLocation()

  const [accountCurrency, setAccountCurrency] = useState([]);

  useEffect(() => {
    async function loadCurrencies() {
      const currencies = await fetchCurrencies();
      setAccountCurrency(currencies);
    }
    loadCurrencies()
  }, []);
  const accountIcon = [
    { value: "card_blue", name: "Card Blue" },
    { value: "card_pink", name: "Card Pink" },
    { value: "cash", name: "Cash" },
    { value: "crypto", name: "Crypto" },
    { value: "bank", name: "Bank" },
    { value: "euro", name: "Euro" },
    { value: "usd", name: "USD" }
  ];

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  function home() {
    navigate('/');
  }
  const [account, setAccount] = useState(getInitialAccount)

  function getInitialAccount() {
    const savedAccount = localStorage.getItem("account");
    if (savedAccount) { return JSON.parse(savedAccount) } else {
      localStorage.removeItem("account");
      return { name: "", balance: "", currency: "", icon: "" }
    }
  }

  useEffect(() => {
    if (account && !location.pathname === "/") { localStorage.setItem("account", JSON.stringify(account)) }
  }, [account, location.pathname])

  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const numericBalance = account.balance === "" ? 0 : Number(account.balance);
    if (!account.name) newErrors.name = true;
    if (!numericBalance || numericBalance < -999999999 || numericBalance > 999999999) newErrors.balance = true;
    if (!account.currency) newErrors.currency = true;
    if (!account.icon) newErrors.icon = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await addAccount({ name: account.name, balance: numericBalance, currency: account.currency, icon: account.icon })

    home();
    localStorage.removeItem("account");
  }

  const onBack = (e) => {
    e.preventDefault();



    home();
    localStorage.removeItem("account");
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.heading}>Add Account</h1>
      <div className={styles.inputBox}>
        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Account name</p>
          <input
            type="text"
            value={!account.name ? '' : account.name}
            placeholder="Enter name"
            className={cn(styles.input, errors.name && styles.error)}
            required
            onChange={(e) => setAccount((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Balance</p>
          <input
            value={account.balance}
            placeholder="Enter balance"
            className={cn(styles.input, errors.balance && styles.error)}
            type="number"
            required
            onChange={(e) => {

              setAccount((prev) => ({ ...prev, balance: e.target.value }));

            }}
          />
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Currency</p>
          <select
            className={cn(styles.input, errors.currency && styles.error)}
            value={account.currency}
            required
            onChange={(e) => setAccount((prev) => ({ ...prev, currency: e.target.value }))}
          >
            <option value="" disabled>Select Currency</option>
            {accountCurrency.map((currency, index) => (
              <option key={index} value={currency.iso_code}>{currency.iso_code} - {currency.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.inputContainer}>
          <p className={styles.inputText}>Icon</p>
          <select
            className={cn(styles.input, errors.icon && styles.error)}
            value={account.icon}
            required
            onChange={(e) => setAccount((prev) => ({ ...prev, icon: e.target.value }))}
          >
            <option value="" disabled>Select Icon</option>
            {accountIcon.map((icon, index) => (
              <option key={index} value={icon.value}>{icon.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        {back && <button className="backBtn button" onClick={onBack}>Back</button>}
        <button className={cn(styles.saveBtn, "button")} onClick={onSubmit}>Save</button>
      </div>
    </div>
  )
}

export default AddAccount
