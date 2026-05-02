import { supabase } from "../../supabase";
import { useState } from "react";
import styles from '../styles/FormLayout.module.scss'
import cn from 'classnames';
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    function home() {
        navigate('/');
    }

    async function handleSignUp(e) {
        e.preventDefault();

        const newErrors = {};
        if (password !== confirmPassword) newErrors.confirmPassword = true;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.log("Error signing up:", error.message);
            return;
        }
        console.log("User signed up successfully:", data);

        setEmail('');
        setPassword('');
        setConfirmPassword('');

        home();
    }

    const onBack = (e) => {
        e.preventDefault();

        setEmail('');
        setPassword('');
        setConfirmPassword('');

        home();
    }

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.heading}>Sign Up</h1>
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
                <div className={styles.inputContainer}>
                    <p className={styles.inputText}>Confirm Password</p>
                    <input
                        className={cn(styles.input, errors.confirmPassword && styles.error)}
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button className="backBtn button" onClick={onBack}>Back</button>
                <button className={cn(styles.saveBtn, "button")} onClick={handleSignUp}>Sign Up</button>
            </div>
        </div>
    )
}

export default SignUp