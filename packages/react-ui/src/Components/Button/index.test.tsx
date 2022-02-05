import '@testing-library/jest-dom';
import { cleanup, render, screen } from '@testing-library/react';

import { Button } from '.';

describe('Button', () => {
    afterEach(() => {
        cleanup();
    });

    test('render Button', async () => {
        render(<Button />);
        expect(await screen.findByRole('button')).toBeInTheDocument();
    });
});
