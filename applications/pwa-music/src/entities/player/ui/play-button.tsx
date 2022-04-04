import { Button, useSvg } from '@marvinav/react-ui';
import { VFC } from 'react';
import playIcon from '../static/play-solid.svg?raw';
import stopIcon from '../static/stop-solid.svg?raw';

export interface PlayButtonProperties {
    play: () => void;
    stop: () => void;
    disabled?: boolean;
    status: 'playing' | 'stopped' | 'paused';
}

export const PlayButton: VFC<PlayButtonProperties> = ({ play, status, stop, disabled }) => {
    const playSvg = useSvg({ src: playIcon });
    const stopSvg = useSvg({ src: stopIcon });

    return status === 'playing' || status === 'paused' ? (
        <Button disabled={disabled} onClick={() => play()} dangerouslySetInnerHTML={{ __html: playSvg.outerHTML }} />
    ) : (
        <Button disabled={disabled} onClick={() => stop()} dangerouslySetInnerHTML={{ __html: stopSvg.outerHTML }} />
    );
};
