import styles from '../styles/Buttons.module.scss'
import { useNavigate } from 'react-router-dom'
import cn from 'classnames'
import MessageModal from './MessageModal'
import { useState } from 'react';

const Button = ({ title, classN, onClick, link, accounts }) => {
    const [showModal, setShowModal] = useState(false);
    const titleModal = "Attention!";
    const text = `To add ${link}, you need to have at least two accounts. \n You want to add an account now?`;
    const navigate = useNavigate();
    function handleAddAccount() {
        setShowModal(false);
        navigate('/addAccount');
    }
    function goToLink() {
        if ((accounts.length > 0 && link !== 'transfer') || (accounts.length > 1)) {
            navigate(`/${link}`);
        } else {
            setShowModal(true);
        }
    }
    return (
        <>
            <div className={cn(styles.button, "button", classN)} onClick={() => goToLink()}>
                <div onClick={onClick}>
                    <p>{title}</p>
                </div>
            </div>
            {showModal && <MessageModal title={titleModal} text={text} onDelete={handleAddAccount} onClose={() => setShowModal(false)} />}
        </ >
    )
}

export default Button