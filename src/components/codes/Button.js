import styles from '../styles/Buttons.module.scss'
import { useNavigate } from 'react-router-dom'
import cn from 'classnames'

const Button = ({ src, classN, onClick, link, accounts }) => {
    const navigate = useNavigate();
    function goToLink() {
        if ((accounts.length > 0 && link !== 'transfer') || (accounts.length > 1)) {
            navigate(`/${link}`);
        } else {
            alert(`First of all, you need to add more accounts to add ${link}`);
        }
    }
    return (
        <div className={cn(styles.button, "button")} onClick={() => goToLink()}>
            <div className={classN}>
                <img src={src} className={classN} alt="button" onClick={onClick} />
            </div>
        </div>
    )
}

export default Button