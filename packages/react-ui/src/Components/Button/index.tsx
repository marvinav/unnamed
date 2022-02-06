import { createBooleanAttribute } from '../../utils/boolean-attribute';
import { BaseProperties } from '../../types';
import { useClassname } from '../../utils/use-classname';
import styles from './style.css';

export interface ButtonProperties
    extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    baseProperties?: BaseProperties;
    // Default color Primary
    color?: 'regular' | 'suggested' | 'destructive';
    // Default variant Solid
    variant?: 'solid' | 'outlined' | 'ghost';
    // Default variant md
    size?: 'sm' | 'md' | 'lg';
    rounded?: boolean;
}

export const Button: React.FC<ButtonProperties> = ({
    children,
    color = 'regular',
    variant = 'solid',
    size = 'md',
    rounded,
    baseProperties,
    ...rest
}) => {
    const className = useClassname(styles.Button, baseProperties);

    return (
        <button
            data-color={color}
            data-variant={variant}
            data-size={size}
            className={className}
            data-rounded={createBooleanAttribute(rounded)}
            {...rest}
        >
            {children}
        </button>
    );
};
