import styles from '../styles/DeleteAllBtn.module.scss'
import cn from 'classnames';

const DeleteAllBtn = ({deleteAll}) => {
  return (
    <div className={styles.buttonContainer}>
        <button className={cn(styles.deleteAllBtn, "button")} onClick={deleteAll}>Delete All</button>
    </div>
  )
}

export default DeleteAllBtn