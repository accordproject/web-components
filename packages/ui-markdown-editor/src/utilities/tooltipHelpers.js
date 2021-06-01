/* ************ INTERNAL METHODS *************** */

/* Methods for conversion to strings and further manipulation */

/**
 * Converts the input into string and capitalizes the first letter of a word.
 * 
 * @param {string} word Value to be changed
 * @returns {string} Value with capitalized first letter
 */
const capitalizeFirst = word => word.toString().charAt(0).toUpperCase();

/**
 * Converts the input into string and slices the first letter of a value.
 * 
 * @param {string} word Value to be changed
 * @returns {string} Value with first letter removed
 */
const sliceWord = word => word.toString().slice(1);

/**
 * Converts the input into string and extracts the first 2 letters from a value.
 * 
 * @param {string} word Value to be changed
 * @returns {string} First two characters of the value
 */
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
