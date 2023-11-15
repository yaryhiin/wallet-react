import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/ChangeAccount.module.css'

const ChangeAccount = ({ account, changeAccount, deleteAccount }) => {
    const navigate = useNavigate();
    function home() {
        navigate('/');
    }
    const [name, setName] = useState(account.name);
    const [balance, setBalance] = useState(account.balance);
    const [currency, setCurrency] = useState(account.currency);
    const [icon, setIcon] = useState(account.icon);

    let id = account.id

    const onSubmit = (e) => {
        e.preventDefault();
        if (name !== "") {
            changeAccount({ id, name, balance, currency, icon })
            setName('');
            setBalance();
            setCurrency('');
            setIcon('');

            home();
        } else {
            alert("You forgot to write the name")
        }
    }

    const onBack = (e) => {
        e.preventDefault();

        setName('');
        setBalance();
        setCurrency('');
        setIcon('');

        home();
    }

    const onDelete = (e) => {
        e.preventDefault();

        setName('');
        setBalance();
        setCurrency('');
        setIcon('');

        deleteAccount(id);

        home();
    }

    return (
        <>
            <div className={styles.changeBox}>
                <div className={styles.inputContainer}>
                    <p className={styles.inputText}>Account name</p>
                    <input type="text" value={name} className={`${styles.input} ${styles.changeName}`} required onChange={(e) => setName(e.target.value)} />
                </div>
                <div className={styles.inputContainer}>
                    <p className={styles.inputText}>Balance</p>
                    <input type="number" value={balance} className={`${styles.input} ${styles.changeBal}`} required onChange={(e) => setBalance(parseInt(e.target.value) || 0)} />
                </div>
                <div className={styles.inputContainer}>
                    <p className={styles.inputText}>Currency</p>
                    <select className={styles.changeCur} value={currency} required onChange={(e) => setCurrency(e.target.value)}>
                        <option value="UAH">UAH</option>
                        <option value="PLN">PLN</option>
                        <option value="USD">USD</option>
                        <option value="CAD">CAD</option>
                    </select>
                </div>
                <div className={styles.inputContainer}>
                    <p className={styles.inputText}>Icon</p>
                    <select className={styles.changeIcon} value={icon} required onChange={(e) => setIcon(e.target.value)}>
                        <option value="card_blue">Blue card</option>
                        <option value="card_pink">Pink card</option>
                        <option value="cash">Cash</option>
                        <option value="crypto">Crypto</option>
                        <option value="bank">Bank account</option>
                        <option value="euro">Euro</option>
                        <option value="usd">USD</option>
                    </select>
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.backBtn} onClick={onBack}>Back</button>
                <button className={styles.changeAccBtn} onClick={onSubmit}>Change</button>
                <button className={styles.deleteAccBtn} onClick={onDelete}>Delete</button>
            </div>
        </>
    )
}

export default ChangeAccount