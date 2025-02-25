import chroma from 'chroma-js';
import * as React from 'react';
import { MultiGridProps } from 'react-virtualized';
import { Dispatch } from 'redux';

import { ActionType, AppActions } from '../redux/actions/AppActions';
import { AppState, FilteredRanges, RangeHighlightConfig } from '../redux/state/AppState';

/** Outlier range bounds and color scales */
export interface OutlierRange {
  lower: number;
  upper: number;
  lowerScale?: chroma.Scale;
  upperScale?: chroma.Scale;
}

/** Information for columns of your dataframe */
export interface ColumnDef extends Bounds {
  name: string;
  dtype: string;
  hasMissing?: boolean;
  hasOutliers?: boolean;
  outlierRange?: OutlierRange;
  lowVariance?: boolean;
  locked?: boolean;
  unique_ct?: number;
  visible?: boolean;
  coord?: 'lat' | 'lon';
  label?: string;
  index: number;
  resized?: boolean;
  width?: number;
  headerWidth?: number;
  dataWidth?: number;
}

/** Type definition for each cell displayed in the DataViewer */
export interface DataRecord {
  view: string;
  raw?: string | number | null;
  style?: React.CSSProperties;
}

/** Update specification for DataViewer */
export interface DataViewerUpdate extends Record<string, any> {
  type: string;
}

/** Data storage in DataViewer */
export interface DataViewerData {
  [key: number]: Record<string, DataRecord>;
}

/** Properties for selecting ranges of rows, columns, etc... */
interface RangeSelection {
  start: number;
  end: number;
}

/** min/max bounds */
export interface Bounds {
  min?: number;
  max?: number;
}

/** Actions available to column filters */
export type ColumnFilterAction = 'equals' | 'startswith' | 'endswith' | 'contains' | 'length';

/** Operands available to column filters */
export type ColumnFilterOperand = '=' | 'ne' | '<' | '>' | '<=' | '>=' | '[]' | '()';

/** Column filter properties */
export interface ColumnFilter extends Bounds {
  type: string;
  query?: string;
  missing?: boolean;
  action?: ColumnFilterAction;
  value?: string | string[] | number | number[];
  raw?: string | number;
  caseSensitive?: boolean;
  operand?: ColumnFilterOperand;
  start?: string;
  end?: string;
}

/** The definition for formatting properties for string columns */
export interface StringColumnFormat {
  link: boolean;
  html: boolean;
  truncate?: number;
}

/** Type definition for a column format configuration object */
export interface ColumnFormat {
  fmt: string | StringColumnFormat;
  style?: {
    redNegs?: boolean;
    currency?: string;
  };
  link?: boolean;
  html?: boolean;
  truncate?: number;
}

/** Properties for outlier filters */
export interface OutlierFilter {
  query: string;
}

/** State properties of DataViewer */
export interface DataViewerState extends MultiGridProps, Bounds {
  columnFormats: Record<string, Record<string, any>>;
  nanDisplay?: string;
  data: DataViewerData;
  loading: boolean;
  ids: number[];
  loadQueue: number[][];
  columns: ColumnDef[];
  selectedCols: string[];
  menuOpen: boolean;
  formattingOpen: boolean;
  triggerResize: boolean;
  backgroundMode?: string;
  rangeHighlight: RangeHighlightConfig;
  rowRange?: RangeSelection;
  columnRange?: RangeSelection;
  rangeSelect?: RangeSelection;
  ctrlRows?: RangeSelection;
  ctrlCols?: RangeSelection;
  selectedRow?: RangeSelection;
  filteredRanges: FilteredRanges;
  error?: string;
  traceback?: string;
  renameUpdate?: (data: DataViewerData) => DataViewerData;
}

/** Component properties of DataViewer */
export interface DataViewerProps {
  settings: Record<string, any>;
  dataId: string;
  iframe: boolean;
  closeColumnMenu: () => void;
  openChart: (
    chartData: Record<string, any>,
  ) => Dispatch<{ type: ActionType.OPEN_CHART; chartData: Record<string, any> }>;
  theme: string;
  updateFilteredRanges: (query: string) => (dispatch: AppActions<Promise<void>>, getState: () => AppState) => void;
  menuPinned: boolean;
  ribbonMenuOpen: boolean;
  dataViewerUpdate?: DataViewerUpdate;
  clearDataViewerUpdate: () => Dispatch<{ type: 'clear-data-viewer-update' }>;
  maxColumnWidth?: number;
  editedTextAreaHeight?: number;
  verticalHeaders: boolean;
}

/** Type definition for propagating state back to DataViewer */
export type DataViewerPropagateState = (state: Partial<DataViewerState>, callback?: () => void) => void;
