import { supabase } from "../../supabase";
import { useState } from "react";
import styles from '../styles/FormLayout.module.scss'
import cn from 'classnames';
import { useNavigate } from "react-router-dom";
import { getAuthErrorMessage } from "../../utils";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const navigate = useNavigate();
  function home() {
    navigate('/');
  }

  async function handleLogin(e) {
    e.preventDefault();
    setAuthError('');
    const newErrors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = true;
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
      return;
    }
    console.log("User logged in successfully:", data);

    setEmail('');
    setPassword('');
    home();
  }

  const onBack = (e) => {
    e.preventDefault();

    setEmail('');
    setPassword('');

    home();
  }

  return (
    <div className="container">
      <div className={styles.formContainer}>
        <h1 className={styles.heading}>Log In</h1>
        <div className={styles.inputBox}>
          <div className={styles.inputContainer}>
            <p className={styles.inputText}>Email</p>
            <input
              className={cn(styles.input, errors.email && styles.error)}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.inputText}>Password</p>
            <input
              className={cn(styles.input, errors.password && styles.error)}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        {authError && (<h2 className={cn(styles.errorMessage, styles.fullWidth)}>{authError}</h2>)}
        </div>
        <div className={styles.buttonContainer}>
          <button className="backBtn button" onClick={onBack}>Back</button>
          <button className={cn(styles.saveBtn, "button")} onClick={handleLogin}>Log In</button>
        </div>
      </div>
    </div>
  )
}

export default Login