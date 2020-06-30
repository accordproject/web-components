import initStoryshots from '@storybook/addon-storyshots';

window.getSelection = () => {
  return {
    removeAllRanges: () => {}
  };
}

initStoryshots({
  storyKindRegex: /Contract Editor/,
  suite: 'Contract Editor Storyshots'
});
