import React from 'react'
import styles from '../styles/Modal.module.scss'
import cn from 'classnames';
import { useTranslation } from "react-i18next";

const MessageModal = ({ twoButton = true, title, text, onDelete, onClose }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h2 className={styles.heading}>{title}</h2>
                <p style={{ whiteSpace: 'pre-line' }} className={styles.message}>{text}</p>
                <div className={styles.buttons}>
                    {twoButton &&
                        <button className={cn(styles.backBtn, "button")} onClick={onDelete}>
                            {t("common.yes")}
                        </button>
                    }
                    <button className={cn(styles.addBtn, "button")} onClick={onClose}>
                        {t("common.back")}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MessageModal