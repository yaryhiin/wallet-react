import styles from "../styles/WelcomeScreen.module.scss"
import cn from 'classnames';

const WelcomeScreen = () => {
    return (
        <div className={styles.content}>
            <h1 className={styles.title}>Welcome to the Wallet App</h1>
            <h3 className={styles.description}>Track expenses, income, transfers, multiple accounts and currencies — all in one simple web app.</h3>
            <p className={styles.note}>Start Now.</p>
            <div className={styles.sessionBox}>
            <div>
              <a href="/login" className={cn("button", styles.logIn)}>Log In</a>
            </div>
            <div>
              <a href="/signup" className={cn("button", styles.signUp)}>Sign Up</a>
            </div>
          </div>
        </div>
    )
}

export default WelcomeScreen