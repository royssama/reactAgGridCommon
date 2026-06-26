const GROUP_FIELDS = ['region', 'businessType', 'partner'];

export function getGroupPathValue(node, field) {
  if (!node) return null;

  let current = node;
  while (current) {
    if (current.group && current.field === field) {
      return current.key;
    }
    current = current.parent;
  }

  return node.data?.[field] ?? null;
}

export function getPreviousDisplayedRow(api, node) {
  const targetIndex = node.rowIndex;
  if (targetIndex == null || targetIndex <= 0) return null;

  let previous = null;
  api.forEachNodeAfterFilterAndSort((n) => {
    if (n.rowIndex != null && n.rowIndex < targetIndex) {
      if (!previous || n.rowIndex > previous.rowIndex) {
        previous = n;
      }
    }
  });

  return previous;
}

export function shouldMergeGroupCells(params) {
  const field = params.column.getColDef().showRowGroup;
  if (!field || field === true) return false;
  if (params.node.group && params.node.field === field) return false;

  const previous = getPreviousDisplayedRow(params.api, params.node);
  if (!previous) return false;

  return getGroupPathValue(params.node, field) === getGroupPathValue(previous, field);
}

export function createGroupSpanRowsCallback() {
  return ({ nodeA, nodeB, column }) => {
    const field = column.getColDef().showRowGroup;
    if (!field || field === true) return false;

    return getGroupPathValue(nodeA, field) === getGroupPathValue(nodeB, field);
  };
}

export { GROUP_FIELDS };
