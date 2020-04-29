// https://github.com/thlorenz/anchor-markdown-header/blob/87e4cca4618271e363f4af9697df0f73f23b3d3f/anchor-markdown-header.js#L20
const generateId = element => element.children[0].text.replace(/ /g, '-')
  // escape codes
  .replace(/%([abcdef]|\d){2,2}/ig, '')
  // single chars that are removed
  .replace(/[\/?!:\[\]`.,()*"';{}+=<>~\$|#@&–—]/g, '')
  // CJK punctuations that are removed
  .replace(/[。？！，、；：“”【】（）〔〕［］﹃﹄“ ”‘’﹁﹂—…－～《》〈〉「」]/g, '');

export default generateId;
