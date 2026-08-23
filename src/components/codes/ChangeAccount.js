import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchCurrencies } from '../../utils';
import styles from '../styles/FormLayout.module.scss'
import cn from 'classnames';
import MessageModal from './MessageModal';

const ChangeAccount = ({ accounts, changeAccount, deleteAccount }) => {
  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  const [errors, setErrors] = useState({});

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

  const { id } = useParams();

  const [account, setAccount] = useState()
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!accounts) return;
    const savedAccount = localStorage.getItem("account");
    if (savedAccount) {
      setAccount(JSON.parse(savedAccount))
    } else {
      localStorage.removeItem("account");
      setAccount(
        accounts.find((a) => String(a.id) === String(id))
        ?? { name: "", balance: "", currency: "", icon: "" }
      )
    }


  }, [accounts, id]);

  useEffect(() => {
    if (account) localStorage.setItem("account", JSON.stringify(account))
  }, [account])

  if (!account) {
    return <p>Loading account...</p>;
  }
  const title = "Confirm Action";
  const text = `This account has ${account.balance} ${account.currency}. \n You sure you want to delete it?`;

  const onSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const numericBalance = account.balance === "" ? 0 : Number(account.balance);
    if (!account.name) newErrors.name = true;
    if (numericBalance === '' || numericBalance < -999999999 || numericBalance > 999999999) newErrors.balance = true;
    if (!account.currency) newErrors.currency = true;
    if (!account.icon) newErrors.icon = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await changeAccount({ id, name: account.name, balance: numericBalance, currency: account.currency, icon: account.icon })


    home();
    localStorage.removeItem("account");
  }

  const onBack = (e) => {
    e.preventDefault();



    home();
    localStorage.removeItem("account");
  }

  function handleDeleteAccount() {
    setShowModal(false);
    localStorage.removeItem("account");

    deleteAccount(id);

    home();
  }

  const onDelete = (e) => {
    e.preventDefault();
    setShowModal(true);
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.heading}>Change Account</h1>
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
            type="text"
            inputMode="decimal"
            required
            onChange={(e) => {
              const value = e.target.value;

              if (/^\d*\.?\d{0,2}$/.test(value)) {
                setAccount((prev) => ({ ...prev, balance: value }))
              }
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
            <option value="" disabled>Select Currecny</option>
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
        {showModal && <MessageModal title={title} text={text} onDelete={handleDeleteAccount} onClose={() => setShowModal(false)} />}
      </div>
      <div className={styles.buttonContainer}>
        <button className="backBtn button" onClick={onBack}>Back</button>
        <button className={cn(styles.saveBtn, "button")} onClick={onSubmit}>Save</button>
        <button className={cn(styles.deleteBtn, "button")} onClick={onDelete}>Delete</button>
      </div>
    </div>
  )
}

export default ChangeAccount