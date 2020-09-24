export const CLAUSE = 'clause_definition';
export const VARIABLE = 'variable_definition';
export const CONDITIONAL = 'conditional_definition';
export const OPTIONAL = 'optional_definition';
export const FORMULA = 'formula_definition';

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
