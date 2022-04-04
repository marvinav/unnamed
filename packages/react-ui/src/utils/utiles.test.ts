import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react-hooks';
import { createBooleanAttribute, parseBooleanAttribute } from './boolean-attribute';

import { useClassname } from './use-classname';

import { useSvg } from './use-svg';

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

describe('use-svg', () => {
    it('parse svg from source', () => {
        const source =
            '<svg id="Layer_1" height="512" viewBox="0 0 36 36" width="512" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="m23.42 8.25v19.5a3.23 3.23 0 0 1 -1 2.31 3.39 3.39 0 0 1 -2.42.94 3.24 3.24 0 0 1 -2.3-.94l-4-4v-8.06h-2.2v6.5h-2.16a3.24 3.24 0 0 1 -3.25-3.25v-6.5a3.28 3.28 0 0 1 1-2.3 3.25 3.25 0 0 1 2.3-1h2.79l5.51-5.45a3.25 3.25 0 0 1 2.31-1 3.4 3.4 0 0 1 2.48 1 3.28 3.28 0 0 1 .94 2.25z"/><path d="m25.58 22.34v-2.17a2.15 2.15 0 0 0 1.53-.63 2.17 2.17 0 0 0 -1.53-3.7v-2.17a4.33 4.33 0 1 1 0 8.67z"/></svg>';
        const { result } = renderHook(() => useSvg({ src: source }));
        const svgParent = result.current;
        expect(svgParent).toBeInstanceOf(SVGSVGElement);
        expect(svgParent.getAttribute('preserveAspectRatio')).toBe('none');
        expect(svgParent.getAttribute('width')).toBe('100%');
        expect(svgParent.getAttribute('height')).toBe('100%');
        expect(svgParent.getAttribute('id')).toBeNull();
        // eslint-disable-next-line testing-library/no-node-access
        for (const child of result.current.children) {
            expect(child.nodeName).toBe('path');
            expect(child.getAttribute('fill')).toBe('currentColor');
        }
    });
});
