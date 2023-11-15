import styles from '../styles/DeleteAllBtn.module.css'

const DeleteAllBtn = ({deleteAll}) => {
  return (
    <div className={styles.buttonContainer}>
        <button className={styles.deleteAllBtn} onClick={deleteAll}>Delete All</button>
    </div>
  )
}

export default DeleteAllBtn