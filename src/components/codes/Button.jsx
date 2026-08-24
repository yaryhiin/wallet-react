import styles from "../styles/Buttons.module.scss";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import MessageModal from "./MessageModal";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Button = ({ title, classN, onClick, link, accounts }) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  function handleAddAccount() {
    setShowModal(false);
    navigate("/addAccount");
  }
  function goToLink() {
    if ((accounts.length > 0 && link !== "transfer") || accounts.length > 1) {
      navigate(`/${link}`);
    } else {
      setShowModal(true);
    }
  }
  return (
    <>
      <div
        className={cn(styles.button, "button", classN)}
        onClick={() => goToLink()}
      >
        <div onClick={onClick}>
          <p>{title}</p>
        </div>
      </div>
      {showModal && (
        <MessageModal
          title={t("modal.transfer.title")}
          text={t("modal.transfer.text")}
          onDelete={handleAddAccount}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Button;
