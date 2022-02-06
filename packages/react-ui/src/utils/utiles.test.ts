import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { createBooleanAttribute, parseBooleanAttribute } from './boolean-attribute';

import { useClassname } from './use-classname';

describe('use-classname', () => {
    it('Unstyled component return only prefix', () => {
        const { result } = renderHook(() =>
            useClassname('base', { suffix: 'suffix', prefix: 'prefix', isUnstyled: true }),
        );
        expect(result.current).toBe('prefix');
    });
    it('Unstyled component return base if properties undefined', () => {
        const { result } = renderHook(() => useClassname('base'));
        expect(result.current).toBe('base');
    });

    it('Unstyled component return undefined when prefix undefined', () => {
        const { result } = renderHook(() => useClassname('base', { suffix: 'suffix', isUnstyled: true }));
        expect(result.current).toBeUndefined();
    });

    it('Styled component return prefix merged with base', () => {
        const { result } = renderHook(() => useClassname('base', { prefix: 'prefix' }));
        expect(result.current).toBe('prefix base');
    });

    it('Styled component return base merged with suffix', () => {
        const { result } = renderHook(() => useClassname('base', { suffix: 'suffix' }));
        expect(result.current).toBe('base suffix');
    });

    it('Styled component return base merged with suffix and prefix', () => {
        const { result } = renderHook(() => useClassname('base', { suffix: 'suffix', prefix: 'prefix' }));
        expect(result.current).toBe('prefix base suffix');
    });
});

describe('boolean-attribute', () => {
    it('parsed falsy value return false', () => {
        expect(parseBooleanAttribute()).toBe(false);
    });

    it('parsed not empty value return true', () => {
        expect(parseBooleanAttribute('')).toBe(true);
    });

    it('created true return empty string', () => {
        expect(createBooleanAttribute(true)).toBe('');
    });

    it('created false return undefined', () => {
        expect(createBooleanAttribute(false)).toBeUndefined();
    });
});
