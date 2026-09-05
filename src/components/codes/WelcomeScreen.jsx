import styles from "../styles/WelcomeScreen.module.scss";
import ThemeSwitch from "./ThemeSwitch";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const WelcomeScreen = ({ toggleTheme, theme, language, setLanguage }) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  function signup() {
    navigate("/signup");
  }
  function login() {
    navigate("/login");
  }
  return (
    <>
      <header className={`header ${styles.header}`}>
        <div>
          <ThemeSwitch toggleTheme={toggleTheme} theme={theme} />
          <select
            value={language}
            onChange={(e) => {
              i18n.changeLanguage(e.target.value);
              setLanguage(e.target.value);
            }}
          >
            <option value="en">English</option>
            <option value="pl">Polska</option>
          </select>
        </div>
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
      <footer className={styles.footer}>
        <p>
          Built by{" "}
          <a
            href="https://yaryhin.com"
            target="_blank"
            aria-label="Tim Yaryhin Portfolio"
            rel="noreferrer"
          >
            Tim Yaryhin
          </a>
        </p>
        <p>Wallet App &copy; 2026</p>
      </footer>
    </>
  );
};

export default WelcomeScreen;
