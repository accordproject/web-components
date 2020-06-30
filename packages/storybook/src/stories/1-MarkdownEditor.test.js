import initStoryshots from '@storybook/addon-storyshots';

window.getSelection = () => {
  return {
    removeAllRanges: () => {}
  };
}

initStoryshots({
  storyKindRegex: /Markdown Editor/,
  suite: 'Markdown Editor Storyshots'
});
