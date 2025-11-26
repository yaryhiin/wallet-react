import styles from '../styles/Accounts.module.scss'
import Account from './Account'
import AddAccountBtn from './AddAccountBtn'

const accounts = ({ accounts }) => {
  return (
    <div className={styles.accounts}>
      {accounts.map((account) => (<Account key={account.id} account={account} />))}
      {accounts.length < 4 && <AddAccountBtn />}
    </div>
  )
}

export default accounts