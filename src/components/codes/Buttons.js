import styles from '../styles/Buttons.module.scss'
import Button from './Button'

const Buttons = ({ accounts }) => {
  return (
    <div className={styles.buttons}>
      <Button className={styles.incomeBtn} src={`${process.env.PUBLIC_URL}/images/buttons/income.png`} classN={styles.incomeBtn} link="income" accounts={accounts} />
      <Button className={styles.expenseBtn} src={`${process.env.PUBLIC_URL}/images/buttons/expense.png`} classN={styles.expenseBtn} link="expense" accounts={accounts} />
      <Button className={styles.transferBtn} src={`${process.env.PUBLIC_URL}/images/buttons/transfer.png`} classN={styles.transferBtn} link="transfer" accounts={accounts} />
    </div>
  )
}

export default Buttons