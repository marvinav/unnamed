import { BaseProperties } from '../../types';
import { useClassname, createBooleanAttribute } from '../../utils';
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

    // Apply flex 1 1 auto
    fluid?: true;
}

export const Button: React.FC<ButtonProperties> = ({
    children,
    color = 'regular',
    variant = 'solid',
    fluid,
    size = 'md',
    baseProperties,
    ...rest
}) => {
    const className = useClassname(styles.Button, baseProperties);

    return (
        <button
            data-control=""
            data-color={color}
            data-fluid={createBooleanAttribute(fluid)}
            data-variant={variant}
            data-size={size}
            className={className}
            {...rest}
        >
            {children}
        </button>
    );
};
