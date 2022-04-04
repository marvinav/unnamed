import { Button, useSvg } from '@marvinav/react-ui';
import { VFC } from 'react';
import nextIcon from '../static/pause-solid.svg?raw';

export interface PauseButtonProperties {
    pause: () => void;
    disabled?: boolean;
}

export const PauseButton: VFC<PauseButtonProperties> = ({ pause, disabled }) => {
    const nextSvg = useSvg({ src: nextIcon });

    return (
        <Button disabled={disabled} onClick={() => pause()} dangerouslySetInnerHTML={{ __html: nextSvg.outerHTML }} />
    );
};
