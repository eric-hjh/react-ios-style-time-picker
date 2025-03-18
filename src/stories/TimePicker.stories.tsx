import { StoryFn } from '@storybook/react';
import TimePicker, { TimePickerProps } from '../components/TimePicker';

export default {
  title: 'Example/TimePicker',
  component: TimePicker,
};

const Template: StoryFn<TimePickerProps> = (args: TimePickerProps) => (
  <TimePicker {...args} />
);

export const Default = Template.bind({});
export const Infinite = Template.bind({});
Infinite.args = {
  infinite: true,
};
