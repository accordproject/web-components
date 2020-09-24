import initStoryshots from '@storybook/addon-storyshots';

window.getSelection = () => {
  return {
    removeAllRanges: () => {}
  };
}

initStoryshots({
  storyKindRegex: /Template Editor/,
  suite: 'Template Editor Storyshots'
});
