import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button } from './Button';
import { Flex } from '../Flex';
import { Toggle } from './Toggle';
import { ControlGroup } from './ControlGroup';
import { ComponentType } from 'react';

export default {
    title: 'Controls',
    args: {
        variant: 'solid',
    },
    argTypes: {
        variant: { options: ['solid', 'outlined', 'ghost'], control: { type: 'select' } },
    },
} as ComponentMeta<ComponentType<{ variant: 'solid' | 'outlined' | 'ghost' }>>;

const DropDownIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ fill: 'currentcolor' }}>
        <path d="M19,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V5A5.006,5.006,0,0,0,19,0ZM12,16a2.993,2.993,0,0,1-1.987-.752c-.327-.291-.637-.574-.84-.777L6.3,11.647a1,1,0,0,1,1.4-1.426L10.58,13.05c.188.187.468.441.759.7a1,1,0,0,0,1.323,0c.29-.258.57-.512.752-.693L16.3,10.221a1,1,0,1,1,1.4,1.426l-2.879,2.829c-.2.2-.507.48-.833.769A2.99,2.99,0,0,1,12,16Z" />
    </svg>
);

const Template: ComponentStory<ComponentType<{ variant: 'solid' | 'outlined' | 'ghost'; children?: string }>> = (
    storyArguments,
) => (
    <Flex direction="col">
        <Flex direction="col">
            <Flex>
                <select>
                    <option>1</option>
                    <option>1</option> <option>1</option> <option>1</option> <option>1</option> <option>1</option>{' '}
                    <option>1</option>
                    <option>1</option> <option>1</option> <option>1</option> <option>1</option> <option>1</option>{' '}
                    <option>1</option>
                    <option>1</option> <option>1</option> <option>1</option> <option>1</option> <option>1</option>{' '}
                    <option>1</option>
                    <option>1</option> <option>1</option> <option>1</option> <option>1</option> <option>1</option>{' '}
                    <option>1</option>
                    <option>1</option> <option>1</option> <option>1</option> <option>1</option> <option>1</option>
                </select>
                <Button {...storyArguments}>Regular</Button>
                <Toggle {...storyArguments}>Regular</Toggle>

                <Button {...storyArguments}>
                    {DropDownIcon}
                    <span>With Icon</span>
                </Button>
                <Toggle {...storyArguments}>
                    {DropDownIcon}
                    <span>With Icon</span>
                </Toggle>
                <ControlGroup direction="row">
                    <Toggle {...storyArguments}>{DropDownIcon}</Toggle>
                    <Button {...storyArguments} fluid>
                        Four
                    </Button>
                </ControlGroup>
                <ControlGroup direction="row">
                    <Button {...storyArguments}>{DropDownIcon}</Button>
                    <Button {...storyArguments} fluid>
                        Four
                    </Button>
                </ControlGroup>
                <ControlGroup direction="row">
                    <Button {...storyArguments}>{DropDownIcon}</Button>
                    <Button {...storyArguments} fluid>
                        Four
                    </Button>
                    <Button {...storyArguments} color="destructive">
                        Linked
                    </Button>
                    <Button {...storyArguments} color="suggested">
                        Buttons
                    </Button>
                    <Button {...storyArguments}>
                        {DropDownIcon}
                        With Icon
                    </Button>
                </ControlGroup>
            </Flex>
        </Flex>

        <Flex>
            <Toggle {...storyArguments} defaultChecked={false}>
                Toggle
            </Toggle>
            <Toggle {...storyArguments} defaultChecked>
                Checked
            </Toggle>
            <Toggle {...storyArguments} disabled>
                Disabled
            </Toggle>
        </Flex>
        <Flex direction="col">
            <ControlGroup direction="row">
                <Toggle {...storyArguments} defaultChecked={false}>
                    Toggle
                </Toggle>
                <Toggle {...storyArguments} defaultChecked>
                    Checked
                </Toggle>
                <Toggle {...storyArguments} disabled>
                    Disabled
                </Toggle>
            </ControlGroup>
            <ControlGroup direction="row">
                <Toggle {...storyArguments} defaultChecked={false}>
                    Toggle
                </Toggle>
                <Button {...storyArguments}>Regular</Button>
                <Toggle {...storyArguments}>{DropDownIcon}</Toggle>
                <Toggle {...storyArguments} disabled>
                    Disabled
                </Toggle>
                <Toggle {...storyArguments} defaultChecked disabled>
                    Checked Disabled
                </Toggle>
                <Toggle {...storyArguments}>{DropDownIcon} With Icon</Toggle>
                <Toggle {...storyArguments} defaultChecked>
                    Checked
                </Toggle>
            </ControlGroup>
            <ControlGroup>
                <Toggle {...storyArguments} defaultChecked={false}>
                    Toggle
                </Toggle>
                <Button {...storyArguments}> Regular </Button>
                <Toggle {...storyArguments}>{DropDownIcon}</Toggle>
                <Toggle {...storyArguments} disabled>
                    Disabled
                </Toggle>
                <Toggle {...storyArguments} defaultChecked disabled>
                    Checked Disabled
                </Toggle>
                <Toggle {...storyArguments} defaultChecked>
                    Checked
                </Toggle>
                <Button {...storyArguments}> Regular </Button>
            </ControlGroup>
        </Flex>
    </Flex>
);

export const Default = Template.bind({});
