import { Toggle, useSvg } from '@marvinav/react-ui';
import { useEffect, useMemo, useState, VFC } from 'react';

import repeatOneIcon from '../static/repeat-one.svg?raw';
import repeatAllIcon from '../static/repeat-all.svg?raw';

export interface RepeatToggleProperties {
    state?: 'all' | 'one' | 'none';
    change: (state?: RepeatToggleProperties['state']) => void;
}

const states: RepeatToggleProperties['state'][] = ['none', 'all', 'one'];

export const RepeatToggle: VFC<RepeatToggleProperties> = ({ state = 'none', change }) => {
    const [currentState, setCurrentState] = useState(state);

    useEffect(() => {
        setCurrentState(state);
    }, [state]);

    useEffect(() => {
        change(currentState);
    }, [currentState]);

    const repeatOneSvg = useSvg({ src: repeatOneIcon });
    const repeatAllSvg = useSvg({ src: repeatAllIcon });

    const statesIcon = useMemo(() => {
        return {
            one: repeatOneSvg,
            all: repeatAllSvg,
            none: repeatAllSvg,
        };
    }, [repeatOneSvg, repeatAllSvg, repeatOneSvg]);
    return (
        <Toggle
            onClick={() => {
                const currentIndex = states.indexOf(currentState);
                if (currentIndex === states.length - 1) {
                    setCurrentState('none');
                } else {
                    setCurrentState(states[currentIndex + 1]);
                }
            }}
            checked={currentState != 'none'}
        >
            <div dangerouslySetInnerHTML={{ __html: statesIcon[currentState].outerHTML }}></div>
        </Toggle>
    );
};
