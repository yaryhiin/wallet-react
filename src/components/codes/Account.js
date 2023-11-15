import { Link } from 'react-router-dom'
import styles from '../styles/Accounts.module.css'

const account = ({ account, openAccount }) => {
  return (
    <Link to='/changeAccount'>
      <div className={styles.accountStyle} onClick={() => openAccount(account)}>
        <img className={styles.accIcon} src={`${process.env.PUBLIC_URL}/images/accounts/${account.icon}.png`} alt={account.icon} />
        <p className={styles.accName}>
          {account.name}
        </p>
        <p className={styles.accBalance}>
          {account.balance}
        </p>
        <p className={styles.accCurrency}>
          {account.currency}
        </p>
      </div>
    </Link>
  )
}

export default account