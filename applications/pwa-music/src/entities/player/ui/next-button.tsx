import { Button, useSvg } from '@marvinav/react-ui';
import { VFC } from 'react';
import nextIcon from '../static/next-solid.svg?raw';

export interface NextButtonProperties {
    next: () => void;
    disabled?: boolean;
}

export const NextButton: VFC<NextButtonProperties> = ({ next, disabled }) => {
    const nextSvg = useSvg({ src: nextIcon });

    return (
        <Button disabled={disabled} onClick={() => next()} dangerouslySetInnerHTML={{ __html: nextSvg.outerHTML }} />
    );
};
