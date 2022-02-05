import { useMemo } from 'react';
import { BaseProperties } from '../types';

export const useClassname = (base: string, properties?: BaseProperties | undefined) => {
    const result = useMemo(() => {
        if (properties?.isUnstyled === true) {
            return properties.prefix;
        }
        return [properties?.prefix, base, properties?.suffix].filter((x) => x && x.length > 0).join(' ');
    }, [properties?.prefix, base, properties?.suffix, properties?.isUnstyled]);

    return result;
};
