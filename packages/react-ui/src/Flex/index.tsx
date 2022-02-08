import { BaseProperties } from '../types';
import { useClassname } from '../utils';

import styles from './style.css';

export const Flex: React.FC<{ baseProperties?: BaseProperties }> = ({ children, baseProperties }) => {
    const className = useClassname(styles.Flex, baseProperties);
    return <div className={className}>{children}</div>;
};
