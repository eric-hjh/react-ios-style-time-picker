import { StoryFn } from '@storybook/react';
import TimePicker, { TimePickerProps } from '../components/TimePicker';

export default {
  title: 'TimePicker',
  component: TimePicker,
};

const Template: StoryFn<TimePickerProps> = (args: TimePickerProps) => (
  <TimePicker {...args} />
);

export const Default = Template.bind({});
export const DefaultInfinite = Template.bind({});
DefaultInfinite.args = {
  infinite: true,
};
export const TwentyFourHourFormat = Template.bind({});
TwentyFourHourFormat.args = {
  hourFormat: '24',
};
export const TwentyFourHourFormatInfinite = Template.bind({});
TwentyFourHourFormatInfinite.args = {
  infinite: true,
  hourFormat: '24',
};
