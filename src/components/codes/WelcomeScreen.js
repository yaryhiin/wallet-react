import styles from "../styles/WelcomeScreen.module.scss"
import ThemeSwitch from "./ThemeSwitch";
import { useNavigate } from "react-router-dom";

const WelcomeScreen = ({ toggleTheme, theme }) => {
    const navigate = useNavigate();
    function signup() {
        navigate('/signup');
    }
    function login() {
        navigate('/login');
    }
    return (
        <>
            <header className={styles.header}>
                <ThemeSwitch toggleTheme={toggleTheme} theme={theme} />
            </header>
            <div className={styles.content}>
                <h1 className={styles.title}>Welcome to the Wallet App</h1>
                <h3 className={styles.description}>Track expenses, income, transfers, multiple accounts and currencies — all in one simple web app.</h3>
                <div className={styles.sessionBox}>
                    <div>
                        <button onClick={login} className={styles.logIn}>Log In</button>
                    </div>
                    <div>
                        <button onClick={signup} className={styles.signUp}>Sign Up</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WelcomeScreen