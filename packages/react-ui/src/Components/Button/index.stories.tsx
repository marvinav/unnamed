import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button } from './index';

export default {
    title: 'Components/Button',
    component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = () => (
    <>
        <Button>Regular</Button>
        <Button rounded>Primary</Button>
        <Button baseProperties={{ isUnstyled: true }}>Unstyled</Button>
    </>
);

export const Default = Template.bind({});
