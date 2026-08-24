import { supabase } from "../../supabase";
import { useState } from "react";
import styles from "../styles/FormLayout.module.scss";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { getAuthErrorMessage } from "../../utils";
import ThemeSwitch from "./ThemeSwitch";
import { useTranslation } from "react-i18next";

const Login = ({ toggleTheme, theme }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");

  const navigate = useNavigate();
  function home() {
    navigate("/");
  }

  async function handleLogin(e) {
    e.preventDefault();
    setAuthError("");
    const newErrors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = true;
    if (!password) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(getAuthErrorMessage(error));
      setErrors({ password: true, email: true });
      return;
    }
    console.log("User logged in successfully:", data);

    setEmail("");
    setPassword("");
    home();
  }

  const onBack = (e) => {
    e.preventDefault();

    setEmail("");
    setPassword("");

    home();
  };

  return (
    <>
      <header className={styles.header}>
        <ThemeSwitch toggleTheme={toggleTheme} theme={theme} />
      </header>
      <div className="container">
        <div className={styles.formContainer}>
          <h1 className={styles.heading}>{t("auth.login")}</h1>
          <div className={styles.inputBox}>
            <div className={styles.inputContainer}>
              <p className={styles.inputText}>{t("auth.email")}</p>
              <input
                className={cn(styles.input, errors.email && styles.error)}
                type="email"
                placeholder={t("auth.email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {authError && (
                <p className={cn(styles.errorMessage, styles.fullWidth)}>
                  {authError}
                </p>
              )}
            </div>
            <div className={styles.inputContainer}>
              <p className={styles.inputText}>{t("auth.password")}</p>
              <input
                className={cn(styles.input, errors.password && styles.error)}
                type="password"
                placeholder={t("auth.password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {authError && (
                <p className={cn(styles.errorMessage, styles.fullWidth)}>
                  {authError}
                </p>
              )}
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button className="backBtn button" onClick={onBack}>
              {t("common.back")}
            </button>
            <button
              className={cn(styles.saveBtn, "button")}
              onClick={handleLogin}
            >
              {t("auth.login")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
