import { Button, useSvg } from '@marvinav/react-ui';
import { VFC } from 'react';
import nextIcon from '../static/next-solid.svg?raw';

export interface PreviousButtonProperties {
    previous: () => void;
    disabled?: boolean;
}

export const PreviousButton: VFC<PreviousButtonProperties> = ({ previous, disabled }) => {
    const nextSvg = useSvg({ src: nextIcon });
    nextSvg.style.setProperty('transform', 'rotate(180deg)');
    return (
        <Button
            disabled={disabled}
            onClick={() => previous()}
            dangerouslySetInnerHTML={{ __html: nextSvg.outerHTML }}
        />
    );
};
