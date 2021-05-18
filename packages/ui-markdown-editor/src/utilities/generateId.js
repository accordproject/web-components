// https://github.com/thlorenz/anchor-markdown-header/blob/87e4cca4618271e363f4af9697df0f73f23b3d3f/anchor-markdown-header.js#L20

/**
 * Reduces the array to give a string
 * 
 * @param {Array} children Objects to be reduced
 * @returns {string} Reduced array 
 */
const childReducer = (children) => children.reduce((acc, cur) => `${acc}${cur.text}`, '');


/**
 * Generates an ID from the given object
 * 
 * @param {Object} element Element for which ID needs to be generated
 * @returns {string} Generated ID
 */
const generateId = element => childReducer(element.children).replace(/ /g, '-')
  // escape codes
  .replace(/%([abcdef]|\d){2,2}/ig, '')
  // single chars that are removed
  .replace(/[\/?!:\[\]`.,()*"';{}+=<>~\$|#@&–—]/g, '')
  // CJK punctuations that are removed
  .replace(/[。？！，、；：“”【】（）〔〕［］﹃﹄“ ”‘’﹁﹂—…－～《》〈〉「」]/g, '');

export default generateId;
