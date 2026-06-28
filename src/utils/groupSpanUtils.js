const GROUP_FIELDS = ['region', 'businessType', 'partner', 'manager'];

export function getGroupPathValue(node, field) {
  if (!node) return null;

  let current = node;
  while (current) {
    if (current.group && current.field === field) {
      return current;
    }
    current = current.parent;
  }

  return node.data?.[field] ?? null;
}

export function getGroupFieldValue(node, field) {
  const value = getGroupPathValue(node, field);
  if (value == null) return null;
  return value?.key ?? value;
}

/** 해당 필드 그룹 노드의 부모 = 같은 레벨 형제 묶음 기준 */
function getGroupCellParent(node, field) {
  const groupNode = getGroupPathValue(node, field);
  if (groupNode?.group) {
    return groupNode.parent;
  }
  return null;
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

/** 같은 컬럼·같은 값·같은 부모 그룹 안인지 (타 업종 CNC 등 제외) */
export function isSameGroupCellBlock(nodeA, nodeB, field) {
  if (!nodeA || !nodeB) return false;

  const valA = getGroupFieldValue(nodeA, field);
  const valB = getGroupFieldValue(nodeB, field);
  if (valA == null || valA !== valB) return false;

  return getGroupCellParent(nodeA, field) === getGroupCellParent(nodeB, field);
}

/** 바로 위 표시 행과 이어지는 셀이면 true → rowspan 이어짐 스타일 */
export function shouldContinueGroupCell(params) {
  const field = params.column.getColDef().showRowGroup;
  if (!field || field === true) return false;
  if (params.node.group && params.node.field === field) return false;

  const previous = getPreviousDisplayedRow(params.api, params.node);
  if (!previous) return false;

  return isSameGroupCellBlock(params.node, previous, field);
}

/** 지역 그룹(level 0)까지 올라가며 모든 조상이 첫 번째 자식인지 (지역별 독립) */
export function isRegionColumnFirstRow(node) {
  if (!node || node.level <= 0 || node.childIndex !== 0) return false;

  let p = node.parent;
  while (p) {
    if (p.group && p.level === 0) return true;
    if (p.childIndex !== 0) return false;
    p = p.parent;
  }
  return false;
}

export { GROUP_FIELDS };
