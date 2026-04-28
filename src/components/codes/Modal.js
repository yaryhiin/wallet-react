import { useState } from 'react'
import styles from '../styles/Modal.module.scss'
import cn from 'classnames';

const Modal = ({ onClose, onAddCategory }) => {
    const [newCategory, setNewCategory] = useState("");
    const handleSubmit = () => {
        if (newCategory.trim()) {
            onAddCategory(newCategory); // pass value to parent
        }
    }

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2 className={styles.heading}>Add New Category</h2>
                <input className={styles.input}
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Category name"
                />
                <div className={styles.buttons}>
                    <button className={cn(styles.addBtn, "button")} onClick={handleSubmit}>
                        Add
                    </button>
                    <button className={cn(styles.backBtn, "button")} onClick={onClose}>
                        Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Modal