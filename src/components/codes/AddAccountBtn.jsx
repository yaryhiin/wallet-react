import { Link } from "react-router-dom";
import styles from "../styles/Accounts.module.scss";
import cn from "classnames";
import { useTranslation } from "react-i18next";

const AddAccountBtn = () => {
  const { t } = useTranslation();
  return (
    <Link to="addAccount">
      <div className={cn(styles.accountStyle, styles.addAccBtn, "button")}>
        <img
          src={`${process.env.PUBLIC_URL}/images/buttons/add_btn.png`}
          alt="Add Account"
        />
        <p>{t("account.addAcc")}</p>
      </div>
    </Link>
  );
};

export default AddAccountBtn;
