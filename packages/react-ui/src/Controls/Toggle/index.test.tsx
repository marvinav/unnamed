import '@testing-library/jest-dom';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';

import { Toggle } from '.';

describe('Toggle', () => {
    afterEach(() => {
        cleanup();
    });

    test('default render', async () => {
        render(<Toggle value={'Is Not Checked'} />);
        const button = await screen.findByRole<HTMLInputElement>('checkbox', { name: 'Is Not Checked' });
        expect(button).toBeInTheDocument();
        expect(button.getAttribute('data-color')).toBe('regular');
        expect(button.checked).toBeFalsy();
    });

    test('input has a label', async () => {
        render(<Toggle value={'Is Not Checked'} />);
        const button = await screen.findByLabelText('Is Not Checked');
        expect(button).toBeInTheDocument();
    });

    test('controlled input', async () => {
        const Wrap = () => {
            const [checked, setChecked] = useState(false);

            return (
                <Toggle
                    value={'Is Not Checked'}
                    onChange={() => {
                        setChecked((c) => !c);
                    }}
                    checked={checked}
                />
            );
        };
        render(<Wrap />);
        const button = await screen.findByLabelText<HTMLInputElement>('Is Not Checked');
        fireEvent.click(button);
        expect(button.checked).toBeTruthy();
    });
});
