import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button } from './Button';
import { Flex } from '../Flex';

export default {
    title: 'Controls',
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = () => (
    <Flex>
        <Button> Regular </Button>
        <Button> Destructive </Button>
        <Button> Suggested </Button>
    </Flex>
);

export const Default = Template.bind({});
