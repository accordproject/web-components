// https://github.com/thlorenz/anchor-markdown-header/blob/87e4cca4618271e363f4af9697df0f73f23b3d3f/anchor-markdown-header.js#L20

const childReducer = (children) => children.reduce((acc, cur) => `${acc}${cur.text}`, '');

const generateId = element => childReducer(element.children).replace(/ /g, '-')
  // escape codes
  .replace(/%([abcdef]|\d){2,2}/ig, '')
  // single chars that are removed
  .replace(/[\/?!:\[\]`.,()*"';{}+=<>~\$|#@&–—]/g, '')
  // CJK punctuations that are removed
  .replace(/[。？！，、；：“”【】（）〔〕［］﹃﹄“ ”‘’﹁﹂—…－～《》〈〉「」]/g, '');

export default generateId;
