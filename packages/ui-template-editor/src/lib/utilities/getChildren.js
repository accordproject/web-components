/**
 * Recursively match nodes in a slate dom using a matching function
 * @param {*} node a slate node
 * @param {*} matcher a matching function
 * @returns {[*]} the array of matched nodes
 */
const getChildren = (node, matcher) => {
  if (matcher(node)) {
    return node;
  }

  if (node.children) {
    let result = [];
    node.children.forEach(n => {
      const r = getChildren(n, matcher);
      if (Array.isArray(r)) {
        result = result.concat(r);
      } else {
        result.push(r);
      }
    });
    return result;
  }

  return [];
};

export default getChildren;
