import styles from '../styles/Buttons.module.scss'
import Button from './Button'

const Buttons = ({ accounts }) => {
  return (
    <div className={styles.buttons}>
      <Button className={styles.incomeBtn} title={`+ Income`} classN={styles.incomeBtn} link="income" accounts={accounts} />
      <Button className={styles.expenseBtn} title={`- Expense`} classN={styles.expenseBtn} link="expense" accounts={accounts} />
      <Button className={styles.transferBtn} title={`⇄ Transfer`} classN={styles.transferBtn} link="transfer" accounts={accounts} />
    </div>
  )
}

export default Buttons