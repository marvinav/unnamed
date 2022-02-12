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
        <Button color="regular" size="sm">
            Regular
        </Button>
        <Button color="regular" size="lg">
            Regular
        </Button>

        <Button color="regular" variant="outlined">
            Regular outlined
        </Button>

        <Button color="destructive" variant="outlined">
            Destructive outlined
        </Button>
        <Button color="suggested" variant="outlined">
            Suggested outlined
        </Button>
    </>
);

export const Default = Template.bind({});
