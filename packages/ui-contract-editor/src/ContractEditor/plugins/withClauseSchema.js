export const CLAUSE = 'clause';
export const VARIABLE = 'variable';
export const CONDITIONAL = 'conditional';
export const OPTIONAL = 'optional';
export const FORMULA = 'formula';

const INLINES = {
  [VARIABLE]: true,
  [CONDITIONAL]: true,
  [OPTIONAL]: true,
  [FORMULA]: true
};
const VOIDS = {};

/* eslint no-param-reassign: 0 */
const withClauseSchema = (editor) => {
  const { isVoid, isInline } = editor;
  editor.isVoid = element => (VOIDS[element.type] || isVoid(element));
  editor.isInline = element => (INLINES[element.type] || isInline(element));

  return editor;
};

export default withClauseSchema;
