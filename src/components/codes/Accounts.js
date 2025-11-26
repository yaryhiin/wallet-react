import styles from '../styles/Accounts.module.scss'
import Account from './Account'
import AddAccountBtn from './AddAccountBtn'

const accounts = ({ accounts, openAccount }) => {
  return (
    <div className={styles.accounts}>
      {accounts.map((account) => (<Account key={account.id} account={account} openAccount={openAccount} />))}
      {accounts.length < 4 && <AddAccountBtn />}
    </div>
  )
}

export default accounts