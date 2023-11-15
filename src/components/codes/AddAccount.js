import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styles from '../styles/AddAccount.module.css'

const AddAccount = ({ addAccount }) => {
    const navigate = useNavigate();
    function home() {
        navigate('/');
    }
    const [name, setName] = useState('');
    const [balance, setBalance] = useState(0);
    const [currency, setCurrency] = useState('UAH');
    const [icon, setIcon] = useState('card_blue');

    const onSubmit = (e) => {
        e.preventDefault();
        if (name !== "") {
            addAccount({ name, balance, currency, icon })
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

    return (
        <div>
            <div className={styles.inputsBox}>
                <div className={styles.inputContainer}>
                    <p className={styles.inputText}>Account name</p>
                    <input type="text" value={name} className={`${styles.input} ${styles.accName}`} required onChange={(e) => setName(e.target.value)} />
                </div>
                <div className={styles.inputContainer}>
                    <p className={styles.inputText}>Balance</p>
                    <input type="number" value={balance} className={`${styles.input} ${styles.accBal}`} required onChange={(e) => setBalance(parseInt(e.target.value) || 0)} />
                </div>
                <div className={styles.inputContainer}>
                    <p className={styles.inputText}>Currency</p>
                    <select className={styles.accCur} required onChange={(e) => setCurrency(e.target.value)}>
                        <option value="UAH">UAH</option>
                        <option value="PLN">PLN</option>
                        <option value="USD">USD</option>
                        <option value="CAD">CAD</option>
                    </select>
                </div>
                <div className={styles.inputContainer}>
                    <p className={styles.inputText}>Icon</p>
                    <select className={styles.accIcon} required onChange={(e) => setIcon(e.target.value)}>
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
                <button className={styles.saveAccBtn} onClick={onSubmit}>Save</button>
            </div>

        </div>
    )
}

export default AddAccount