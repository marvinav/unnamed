import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button } from './index';

export default {
    title: 'Components/Button',
    component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = () => (
    <>
        <Button>Primary</Button>
    </>
);

export const Default = Template.bind({});
