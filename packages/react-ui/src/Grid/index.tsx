import { BaseProperties } from '../types';
import { useClassname } from '../utils';

import styles from './style.css';

export const Grid: React.FC<{ baseProperties?: BaseProperties }> = ({ children, baseProperties }) => {
    const className = useClassname(styles.Grid, baseProperties);
    return <div className={className}>{children}</div>;
};
