import { useEffect, useState } from 'react';

const GROUP_FIELDS = ['region', 'businessType', 'partner', 'manager'];

function isLevelExpanded(api, groupLevel) {
  let anyExpanded = false;

  api.forEachNode((node) => {
    if (node.group && node.level === groupLevel && node.expanded) {
      anyExpanded = true;
    }
  });

  return anyExpanded;
}

export default function GroupColumnHeader(props) {
  const { displayName, api, column } = props;
  const showRowGroup = column.getColDef().showRowGroup;
  const groupLevel = GROUP_FIELDS.indexOf(showRowGroup);
  const [expanded, setExpanded] = useState(() => isLevelExpanded(api, groupLevel));

  useEffect(() => {
    const syncExpanded = () => {
      setExpanded(isLevelExpanded(api, groupLevel));
    };

    api.addEventListener('rowGroupOpened', syncExpanded);
    api.addEventListener('modelUpdated', syncExpanded);

    return () => {
      api.removeEventListener('rowGroupOpened', syncExpanded);
      api.removeEventListener('modelUpdated', syncExpanded);
    };
  }, [api, groupLevel]);

  if (groupLevel < 0) {
    return <span>{displayName}</span>;
  }

  const handleToggle = (event) => {
    event.stopPropagation();

    const nextExpanded = !expanded;

    api.forEachNode((node) => {
      if (node.group && node.level === groupLevel) {
        node.setExpanded(nextExpanded);
      }
    });

    setExpanded(nextExpanded);
  };

  return (
    <div className="group-column-header">
      <span className="group-column-header-title">{displayName}</span>
      <button
        type="button"
        className={`group-column-header-btn${expanded ? ' is-expanded' : ''}`}
        title={expanded ? `${displayName} 전체 접기` : `${displayName} 전체 펼치기`}
        onClick={handleToggle}
      >
        {expanded ? '▼' : '▶'}
      </button>
    </div>
  );
}
