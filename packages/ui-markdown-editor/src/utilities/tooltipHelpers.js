/* ************ INTERNAL METHODS *************** */

/* Methods for conversion to strings and further manipulation */

const capitalizeFirst = word => word.toString().charAt(0).toUpperCase();

const sliceWord = word => word.toString().slice(1);

const firstTwoLetters = word => word.toString().slice(0, 2);

/* Function to determine OS and MOD command of user */

export const MOD = () => {
  const { platform } = window.navigator;

  const macosPlatforms = {
    Macintosh: true,
    MacIntel: true,
    MacPPC: true,
    Mac68K: true
  };

  if (macosPlatforms[platform]) return '⌘';
  return 'Ctrl';
};

/* ************* EXTERNAL METHODS *************** */

/* Converts an input into a string, capitalizes the first letter, and returns string */

export const capitalizeWord = word => capitalizeFirst(word) + sliceWord(word);

/* Checks the beginning of a block type to determine the string to return */

export const identifyBlock = (block) => {
  const typeBeginning = firstTwoLetters(block);
  if (typeBeginning === 'bl') return `Quote (${MOD()}+Shift+. )`;
  if (typeBeginning === 'ul') return `Bulleted List (${MOD()}+Shift+8)`;
  if (typeBeginning === 'ol') return `Numbered List (${MOD()}+Shift+7)`;
  return null;
};
