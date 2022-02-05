import styles from './style.css';

export const Button: React.FC = ({ children }) => {
    return <button className={styles.Button}>{children}</button>;
};
