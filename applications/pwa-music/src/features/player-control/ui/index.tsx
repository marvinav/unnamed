import { VFC } from 'react';
import { ControlGroup } from '@marvinav/react-ui';
import { useState } from 'react';
import { NextButton, PlayButton, PreviousButton, PauseButton, RepeatToggle } from '../../../entities/player';

export const PlayerControl: VFC = () => {
    const [status, setStatus] = useState<'playing' | 'stopped'>('stopped');

    return (
        <div>
            <ControlGroup direction="row">
                <PreviousButton
                    previous={() => {
                        return;
                    }}
                ></PreviousButton>
                <PauseButton
                    pause={() => {
                        console.log('pause');
                    }}
                    disabled={status === 'stopped'}
                ></PauseButton>
                <PlayButton
                    play={() => {
                        setStatus('stopped');
                    }}
                    stop={() => {
                        setStatus('playing');
                    }}
                    status={status}
                />
                <NextButton
                    next={() => {
                        return;
                    }}
                ></NextButton>
            </ControlGroup>
            <RepeatToggle
                change={() => {
                    return;
                }}
            ></RepeatToggle>
        </div>
    );
};
