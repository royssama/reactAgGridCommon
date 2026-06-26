import { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { RowGroupingModule } from 'ag-grid-enterprise';
import { companyData } from '../data/companyData';
import GroupColumnHeader from './GroupColumnHeader';
import './CompanyGrid.css';

ModuleRegistry.registerModules([AllCommunityModule, RowGroupingModule]);

const textFilterParams = {
  filterOptions: ['contains', 'equals', 'startsWith', 'endsWith'],
  defaultOption: 'contains',
  suppressAndOrCondition: true,
};

const numberFilterParams = {
  filterOptions: ['equals', 'greaterThan', 'lessThan', 'inRange'],
  defaultOption: 'equals',
  suppressAndOrCondition: true,
};

const createGroupColumn = (field, headerName, minWidth) => ({
  field,
  rowGroup: true,
  hide: true,
  headerName,
  filter: 'agTextColumnFilter',
  filterParams: textFilterParams,
  minWidth,
});

export default function CompanyGrid() {
  const gridRef = useRef(null);
  const [quickFilter, setQuickFilter] = useState('');

  const columnDefs = useMemo(
    () => [
      createGroupColumn('region', '지역', 120),
      createGroupColumn('businessType', '업종', 120),
      createGroupColumn('partner', '협력사', 150),
      createGroupColumn('manager', '담당자', 130),
      { field: 'companyName', headerName: '회사이름', filter: 'agTextColumnFilter', filterParams: textFilterParams, minWidth: 110 },
      { field: 'aGroup', headerName: 'aGroup', type: 'numericColumn', filter: 'agNumberColumnFilter', filterParams: numberFilterParams, minWidth: 100 },
      { field: 'bGroup', headerName: 'bGroup', type: 'numericColumn', filter: 'agNumberColumnFilter', filterParams: numberFilterParams, minWidth: 100 },
      { field: 'cGroup', headerName: 'cGroup', type: 'numericColumn', filter: 'agNumberColumnFilter', filterParams: numberFilterParams, minWidth: 100 },
      { field: 'dGroup', headerName: 'dGroup', type: 'numericColumn', filter: 'agNumberColumnFilter', filterParams: numberFilterParams, minWidth: 100 },
      { field: 'eGroup', headerName: 'eGroup', type: 'numericColumn', filter: 'agNumberColumnFilter', filterParams: numberFilterParams, minWidth: 100 },
    ],
    [],
  );

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
    };
  }, []);

  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 200,
      headerComponent: GroupColumnHeader,
    };
  }, []);

  const handleQuickFilterChange = useCallback((value) => {
    setQuickFilter(value);
    gridRef.current?.api.setGridOption('quickFilterText', value);
  }, []);

  const handleResetFilters = useCallback(() => {
    setQuickFilter('');
    gridRef.current?.api.setGridOption('quickFilterText', '');
    gridRef.current?.api.setFilterModel(null);
  }, []);

  return (
    <div className="company-grid-page">
      <header className="company-grid-header">
        <h1>회사 데이터 조회</h1>
        <div className="company-grid-toolbar">
          <input
            type="search"
            className="quick-filter-input"
            placeholder="전체 검색 (지역, 업종, 협력사, 담당자, 회사이름 등)"
            value={quickFilter}
            onChange={(e) => handleQuickFilterChange(e.target.value)}
          />
          <button type="button" className="reset-button" onClick={handleResetFilters}>
            필터 초기화
          </button>
        </div>
      </header>

      <div className="company-grid-container ag-theme-alpine company-grid-theme">
        <AgGridReact
          ref={gridRef}
          rowData={companyData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoGroupColumnDef={autoGroupColumnDef}
          groupHideOpenParents={true}
          groupDisplayType="multipleColumns"
          groupDefaultExpanded={0}
          /*   값	      동작
              0         전부 접힘 (기본값)
              1         1단계만 펼침
              2         2단계까지 펼침
              -1        모든 단계 전부 펼침
          */
        />
      </div>
    </div>
  );
}
