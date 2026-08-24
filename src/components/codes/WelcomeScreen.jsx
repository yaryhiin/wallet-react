import styles from "../styles/WelcomeScreen.module.scss";
import ThemeSwitch from "./ThemeSwitch";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const WelcomeScreen = ({ toggleTheme, theme }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  function signup() {
    navigate("/signup");
  }
  function login() {
    navigate("/login");
  }
  return (
    <>
      <header className={styles.header}>
        <ThemeSwitch toggleTheme={toggleTheme} theme={theme} />
      </header>
      <div className={styles.content}>
        <h1 className={styles.title}>{t("welcome.title")}</h1>
        <h3 className={styles.description}>{t("welcome.text")}</h3>
        <div className={styles.sessionBox}>
          <div>
            <button onClick={login} className={styles.logIn}>
              {t("auth.login")}
            </button>
          </div>
          <div>
            <button onClick={signup} className={styles.signUp}>
              {t("auth.signup")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeScreen;
