import { BaseProperties } from '../../types';
import { createBooleanAttribute, useClassname } from '../../utils';

import styles from './style.css';

export interface ToggleProperties
    extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'size'> {
    variant?: 'solid' | 'outlined' | 'ghost';
    // Default variant md
    size?: 'sm' | 'md' | 'lg';
    baseProperties?: BaseProperties;
}

export const Toggle: React.FC<ToggleProperties> = ({
    children,
    variant = 'solid',
    size = 'md',
    baseProperties,
    value,
    id,
    ...rest
}) => {
    const className = useClassname(styles.Toggle, baseProperties);

    return (
        <label data-size={size} data-variant={variant} className={className} htmlFor={id} data-control="">
            <input data-color={'regular'} className={className} type={'checkbox'} value={value} id={id} {...rest} />
            <span>{children}</span>
        </label>
    );
};
