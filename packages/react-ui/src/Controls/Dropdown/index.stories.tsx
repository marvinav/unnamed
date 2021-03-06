import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Flex } from '../../Flex';
import { Button } from '../Button';
import { Toggle } from '../Toggle';

import styles from './style.css';
import { Dropdown } from './index';
import { ControlGroup } from '../ControlGroup';

export default {
    title: 'Controls/Dropdown',
    component: Dropdown,
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = () => {
    const [isOpen, setIsOpen] = useState(false);
    const reference = useRef();

    return (
        <>
            <div style={{ height: '1000px' }}></div>
            <Flex>
                {/* <d  iv className={styles.Breathing}></d> */}

                <Toggle defaultChecked={false}>Toggle</Toggle>
                <Toggle defaultChecked>Checked</Toggle>
                <Toggle disabled>Disabled</Toggle>
                <Button ref={reference} onClick={() => setIsOpen((o) => !o)}>
                    Open
                </Button>
                <Dropdown isOpen={isOpen} container={reference.current}>
                    <div style={{ margin: '20px', backgroundColor: 'black' }}>lol</div>
                </Dropdown>
            </Flex>
            <div style={{ height: '1000px' }}></div>
        </>
    );
};

export const Default = Template.bind({});
