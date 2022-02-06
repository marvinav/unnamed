import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';

import { Button } from '.';

describe('Button', () => {
    afterEach(() => {
        cleanup();
    });

    test('default render', async () => {
        render(<Button />);
        const button = await screen.findByRole('button');
        expect(button).toBeInTheDocument();
        expect(button.getAttribute('data-color')).toBe('regular');
        expect(button.getAttribute('data-variant')).toBe('solid');
        expect(button.getAttribute('data-size')).toBe('md');
        expect(button.hasAttribute('data-rounded')).toBe(false);
    });

    test('render not rounded', async () => {
        render(<Button rounded />);
        const button = await screen.findByRole('button');
        expect(button).toBeInTheDocument();
        expect(button.getAttribute('data-rounded')).toBe('');
    });

    test('render danger color and outlined variant', async () => {
        render(<Button color="destructive" variant="outlined" />);
        const button = await screen.findByRole('button');
        expect(button).toBeInTheDocument();
        expect(button.getAttribute('data-color')).toBe('destructive');
        expect(button.getAttribute('data-variant')).toBe('outlined');
        expect(button.hasAttribute('data-rounded')).toBe(false);
    });
});
