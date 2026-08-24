import { supabase } from "../../supabase";
import { useState, useEffect } from "react";
import styles from "../styles/FormLayout.module.scss";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { getAuthErrorMessage } from "../../utils";
import MessageModal from "./MessageModal";
import ThemeSwitch from "./ThemeSwitch";
import { useTranslation } from "react-i18next";

const SignUp = ({ toggleTheme, theme }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  function home() {
    navigate("/");
  }
  function login() {
    navigate("/login");
  }

  useEffect(() => {
    const newErrors = {};
    if (confirmPassword !== password) newErrors.confirmPassword = true;
    setErrors(newErrors);
  }, [confirmPassword, password]);

  async function handleSignUp(e) {
    e.preventDefault();

    const newErrors = {};
    if (password !== confirmPassword || !confirmPassword)
      newErrors.confirmPassword = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = true;
    if (!password) newErrors.password = true;
    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters");
      setErrors({ password: true, confirmPassword: true });
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setAuthError(getAuthErrorMessage(error));
      setErrors({ password: true, email: true, confirmPassword: true });
      return;
    }
    console.log("User signed up successfully:", data);

    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setShowModal(true);
  }

  const onBack = (e) => {
    e.preventDefault();

    setEmail("");
    setPassword("");
    setConfirmPassword("");

    home();
  };

  return (
    <>
      <header className={styles.header}>
        <ThemeSwitch toggleTheme={toggleTheme} theme={theme} />
      </header>
      <div className="container">
        <div className={styles.formContainer}>
          <h1 className={styles.heading}>{t("auth.signup")}</h1>
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
            </div>
            <div className={cn(styles.inputContainer, styles.fullWidth)}>
              <p className={styles.inputText}>{t("auth.confirmPassword")}</p>
              <input
                className={cn(
                  styles.input,
                  errors.confirmPassword && styles.error,
                )}
                type="password"
                placeholder={t("auth.confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {authError && (
                <p className={cn(styles.errorMessage)}>{authError}</p>
              )}
            </div>
            {showModal && (
              <MessageModal
                title={t("modal.created.title")}
                text={t("modal.created.text")}
                onDelete={home}
                onClose={() => {
                  setShowModal(false);
                  login();
                }}
                twoButton={false}
              />
            )}
          </div>
          <div className={styles.buttonContainer}>
            <button className="backBtn button" onClick={onBack}>
              {t("common.back")}
            </button>
            <button
              className={cn(styles.saveBtn, "button")}
              onClick={handleSignUp}
            >
              {t("auth.signup")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
