import { VFC } from 'react';

export interface DurationProperties {
    children?: number;
}

export const Duration: VFC<DurationProperties> = ({ children }) => {
    return <span>{children}</span>;
};
