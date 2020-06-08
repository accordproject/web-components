import _ from 'lodash';

/**
   * @param {array} items items to search against
   * @param {array} query array of query strings
   * @return {boolean} whether the items match the query
   */
const isQueryMatch = (
  items,
  query
// eslint-disable-next-line no-confusing-arrow
) => query.every(
  fragment => _.find(items, i => (i ? i.toLowerCase().includes(fragment.toLowerCase()) : false))
);

export default isQueryMatch;
