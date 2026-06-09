export function rehypeProseLinks() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== 'element' || node.tagName !== 'a') {
        return;
      }

      node.properties ??= {};
      node.properties.target = '_blank';
      node.properties.rel = 'noopener noreferrer';
    });
  };
}

function visit(node, callback) {
  callback(node);

  if (!Array.isArray(node.children)) {
    return;
  }

  for (const child of node.children) {
    visit(child, callback);
  }
}
