import { BaseProperties } from '../types';
import { useClassname } from '../utils';

import styles from './style.css';

export const Flex: React.FC<{ baseProperties?: BaseProperties; direction?: 'row' | 'col' }> = ({
    children,
    baseProperties,
    direction,
}) => {
    const className = useClassname(styles.Flex, baseProperties);
    return (
        <div data-direction={direction} className={className}>
            {children}
        </div>
    );
};
