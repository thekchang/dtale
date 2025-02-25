import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { components, GetStyles, GroupBase, LoadingIndicatorProps } from 'react-select';

import { ColumnDef, ColumnFilter as ColumnFilterObj, OutlierFilter } from '../dtale/DataViewerState';
import * as gu from '../dtale/gridUtils';
import menuFuncs from '../dtale/menu/dataViewerMenuUtils';
import { AppState, InstanceSettings } from '../redux/state/AppState';
import * as ColumnFilterRepository from '../repository/ColumnFilterRepository';

import DateFilter from './DateFilter';
import NumericFilter from './NumericFilter';
import StringFilter from './StringFilter';

require('./ColumnFilter.css');

const getStyles: GetStyles<unknown, boolean, GroupBase<unknown>> = () => {
  return {
    label: 'loadingIndicator',
    color: 'hsl(0, 0%, 40%)',
    display: 'flex',
    padding: 8,
    transition: 'color 150ms',
    alignSelf: 'center',
    fontSize: 4,
    lineHeight: 1,
    marginRight: 4,
    textAlign: 'center',
    verticalAlign: 'middle',
  };
};

/** Component properties for ColumnFilter */
export interface ColumnFilterProps {
  columns: ColumnDef[];
  columnFilters?: Record<string, ColumnFilterObj>;
  selectedCol: string;
  updateSettings: (settings: Partial<InstanceSettings>) => void;
  outlierFilters?: Record<string, OutlierFilter>;
}

export const ColumnFilter: React.FC<ColumnFilterProps & WithTranslation> = ({
  columns,
  columnFilters,
  selectedCol,
  updateSettings,
  outlierFilters,
  t,
  ...props
}) => {
  const dataId = useSelector((state: AppState) => state.dataId);
  const colCfg: ColumnDef | undefined = columns.find((column) => column.name === selectedCol);
  const dtype = colCfg?.dtype ?? '';
  const uniqueCt = colCfg?.unique_ct ?? 0;
  const colType: string = gu.findColType(dtype);
  const hasOutliers = colCfg?.hasOutliers ?? 0 > 0;

  const [lastCol, setLastCol] = React.useState<string>(selectedCol);
  const [queryApplied, setQueryApplied] = React.useState<boolean>(outlierFilters?.[selectedCol] !== undefined);
  const [filterData, setFilterData] = React.useState<ColumnFilterRepository.ColumnFilterData>();
  const [missing, setMissing] = React.useState<boolean>(columnFilters?.[selectedCol]?.missing ?? false);
  const [loadingState, setLoadingState] = React.useState<boolean>(true);
  const [cfg, setCfg] = React.useState<ColumnFilterObj | undefined>(columnFilters?.[selectedCol]);

  const load = (): void => {
    setLoadingState(true);
    setFilterData(undefined);
    ColumnFilterRepository.loadFilterData(dataId, selectedCol).then((response) => {
      if (response?.success) {
        setFilterData(response);
      }
      setLoadingState(false);
      setLastCol(selectedCol);
    });
  };

  React.useEffect(() => {
    setQueryApplied(outlierFilters?.[selectedCol] !== undefined);
    setMissing(columnFilters?.[selectedCol]?.missing ?? false);
    setCfg(columnFilters?.[selectedCol]);
    load();
  }, [selectedCol]);

  const updateState = async (updatedCfg?: ColumnFilterObj): Promise<void> => {
    setCfg(updatedCfg);
    if (updatedCfg?.missing !== undefined) {
      setMissing(updatedCfg.missing);
    }
    const response = await ColumnFilterRepository.save(dataId, selectedCol, updatedCfg);
    updateSettings({ columnFilters: response?.currFilters ?? {} });
  };

  const renderIcon = (showIcon = true): JSX.Element => {
    const buttonHandlers = menuFuncs.buildHotkeyHandlers(props);
    return (
      <span className="toggler-action">
        {showIcon && <i className="fa fa-filter align-bottom pointer" onClick={buttonHandlers.FILTER} />}
      </span>
    );
  };

  const renderMissingToggle = (showIcon: boolean): React.ReactNode => {
    if (filterData?.hasMissing) {
      const toggleMissing = async (): Promise<void> => updateState({ ...cfg, type: colType, missing: !missing });
      return (
        <li>
          {renderIcon(showIcon)}
          <div className="m-auto">
            <div className="column-filter m-2">
              <span className="font-weight-bold pr-3">{t('Show Only Missing')}</span>
              <i className={`ico-check-box${missing ? '' : '-outline-blank'} pointer`} onClick={toggleMissing} />
            </div>
          </div>
        </li>
      );
    }
    return null;
  };

  const renderOutlierToggle = (showIcon: boolean): React.ReactNode => {
    if (hasOutliers) {
      const toggleFilter = async (): Promise<void> => {
        setQueryApplied(!queryApplied);
        const response = await ColumnFilterRepository.toggleOutlierFilter(dataId, selectedCol);
        updateSettings({ outlierFilters: response?.outlierFilters ?? {} });
      };
      return (
        <li>
          {renderIcon(showIcon)}
          <div className="m-auto">
            <div className="column-filter m-2">
              <span className="font-weight-bold pr-3">{t('Filter Outliers')}</span>
              <i className={`ico-check-box${queryApplied ? '' : '-outline-blank'} pointer`} onClick={toggleFilter} />
            </div>
          </div>
        </li>
      );
    }
    return null;
  };

  if (loadingState || lastCol !== selectedCol) {
    const indicatorProps = { getStyles: getStyles, cx: () => '' } as unknown as LoadingIndicatorProps<
      unknown,
      false,
      GroupBase<unknown>
    >;
    return (
      <li className="hoverable">
        {renderIcon()}
        <div className="m-auto">
          <div className="column-filter m-2">
            <components.LoadingIndicator {...indicatorProps} />
          </div>
        </div>
        <div className="hoverable__content col-menu-desc">{t('filter')}</div>
      </li>
    );
  }
  let markup = null;
  switch (colType) {
    case 'string':
    case 'unknown': {
      if (!dtype.startsWith('timedelta')) {
        markup = (
          <StringFilter
            selectedCol={selectedCol}
            columnFilter={cfg}
            updateState={updateState}
            uniques={(filterData?.uniques as string[]) ?? []}
            missing={missing}
            uniqueCt={uniqueCt}
          />
        );
      }
      break;
    }
    case 'date':
      markup = (
        <DateFilter
          selectedCol={selectedCol}
          columnFilter={cfg}
          updateState={updateState}
          missing={missing}
          min={filterData?.min ? `${filterData?.min}` : ''}
          max={filterData?.max ? `${filterData?.max}` : ''}
        />
      );
      break;
    case 'int':
    case 'float':
      markup = (
        <NumericFilter
          selectedCol={selectedCol}
          columnFilter={cfg}
          updateState={updateState}
          uniques={(filterData?.uniques as string[]) ?? []}
          missing={missing}
          uniqueCt={uniqueCt}
          min={filterData?.min as number}
          max={filterData?.max as number}
          colType={colType}
        />
      );
      break;
    default:
      break;
  }
  let missingToggle = null;
  if (markup === null) {
    if (!filterData?.hasMissing) {
      return null;
    }
    missingToggle = renderMissingToggle(true);
  } else {
    markup = (
      <li className="hoverable">
        {renderIcon()}
        <div className="m-auto">
          <div className="column-filter m-2">{markup}</div>
        </div>
        <div className="hoverable__content col-menu-desc">{t('filter')}</div>
      </li>
    );
    missingToggle = renderMissingToggle(false);
  }
  return (
    <React.Fragment>
      {markup}
      {missingToggle}
      {renderOutlierToggle(markup === null && missingToggle === null)}
    </React.Fragment>
  );
};

export default withTranslation('column_filter')(ColumnFilter);
