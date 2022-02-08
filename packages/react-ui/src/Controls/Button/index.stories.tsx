import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button } from './index';

export default {
    title: 'Controls/Button',
    component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = () => (
    <>
        <Button color="regular">Regular</Button>
        <Button color="suggested">Suggested</Button>
        <Button color="destructive">Destructive</Button>
    </>
);

export const Default = Template.bind({});
