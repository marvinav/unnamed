import { BaseProperties } from '../../types';
import { useClassname } from '../../utils/use-classname';
import styles from './style.css';

export interface ButtonProperties
    extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    baseProperties?: BaseProperties;
}

export const Button: React.FC<ButtonProperties> = ({ children, baseProperties, ...rest }) => {
    const className = useClassname(styles.Button, baseProperties);

    return (
        <button className={className} {...rest}>
            {children}
        </button>
    );
};
