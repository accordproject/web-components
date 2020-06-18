const titleStart = input => input.lastIndexOf('/');
const titleEnd = input => input.indexOf('@');
const titleReducer = input => input.slice((titleStart(input) + 1), titleEnd(input));
const titleSpacer = input => input.replace(/-/g, ' ');
const titleCaps = input => input.toUpperCase();

export const titleGenerator = (input) => {
  const reducedTitle = titleReducer(input);
  const spacedTitle = titleSpacer(reducedTitle);
  const finalTitle = titleCaps(spacedTitle);
  return finalTitle;
};

export const headerGenerator = (templateTitle, inputTitle) => {
  const title = titleGenerator(templateTitle);
  const header = inputTitle ? (title + inputTitle) : title;
  const truncatedTitle = ((header.length > 54) ? (`${header.slice(0, 54)}...`) : header);
  return truncatedTitle;
};

export const childReducer = (children) => children.reduce((acc, cur) => `${acc}${cur.text}`, '');
