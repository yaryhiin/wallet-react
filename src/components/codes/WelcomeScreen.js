import styles from "../styles/WelcomeScreen.module.scss"
import cn from 'classnames';
import ThemeSwitch from "./ThemeSwitch";

const WelcomeScreen = ({ toggleTheme, theme }) => {
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
                        <a href="/login" className={cn("button", styles.logIn)}>Log In</a>
                    </div>
                    <div>
                        <a href="/signup" className={cn("button", styles.signUp)}>Sign Up</a>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WelcomeScreen