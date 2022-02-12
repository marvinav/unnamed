import styles from './style.css';

export const ControlGroup: React.FC<{ direction?: 'row' | 'col' }> = ({ children, direction = 'col' }) => {
    return (
        <div data-direction={direction} className={styles.ControlGroup}>
            {children}
        </div>
    );
};
