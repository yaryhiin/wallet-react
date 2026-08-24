import { useState } from "react";
import styles from "../styles/Modal.module.scss";
import cn from "classnames";
import { useTranslation } from "react-i18next";

const Modal = ({ onClose, onAddCategory }) => {
  const { t } = useTranslation();
  const [newCategory, setNewCategory] = useState("");
  const handleSubmit = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2 className={styles.heading}>
          {t("transaction.addNewCategory.title")}
        </h2>
        <input
          className={styles.input}
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder={t("transaction.addNewCategory.placeHolder")}
        />
        <div className={styles.buttons}>
          <button
            className={cn(styles.addBtn, "button")}
            onClick={handleSubmit}
          >
            {t("common.add")}
          </button>
          <button className={cn(styles.backBtn, "button")} onClick={onClose}>
            {t("common.back")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
