import initStoryshots from '@storybook/addon-storyshots';

initStoryshots({
  storyKindRegex: /Error Logger/,
  suite: 'Error Logger Storyshots'
});
