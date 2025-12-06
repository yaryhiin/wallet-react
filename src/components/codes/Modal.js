import { useState } from 'react'

const Modal = ({ onClose, onAddCategory }) => {
    const [newCategory, setNewCategory] = useState("");
    const handleSubmit = () => {
        if (newCategory.trim()) {
            onAddCategory(newCategory); // pass value to parent
        }
    }

    return (
        <div className="modal">
            <div className="modalContent">
                <input className="input"
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Category name"
                />
                <div className="buttons">
                    <button className="button saveBtn" onClick={handleSubmit}>
                        Add
                    </button>
                    <button className="button deleteBtn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Modal