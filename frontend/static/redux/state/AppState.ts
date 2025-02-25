import { RGBColor } from 'react-color';

import {
  Bounds,
  ColumnDef,
  ColumnFilter,
  ColumnFormat,
  DataViewerPropagateState,
  OutlierFilter,
} from '../../dtale/DataViewerState';

/** Base properties for react-select dropdown options */
export interface BaseOption<T> {
  value: T;
  label?: string;
}

/** Object which can be turned on/off */
export interface HasActivation {
  active: boolean;
}

/** Object which has a visiblity flag */
export interface HasVisibility {
  visible: boolean;
}

export const initialVisibility: HasVisibility = { visible: false };

/** Properties of a main menu tooltip */
export interface MenuTooltipProps extends HasVisibility {
  element?: HTMLLIElement;
  content?: string;
}

/** Properties of a ribbon menu dropdown */
export interface RibbonDropdownProps extends HasVisibility {
  element?: HTMLDivElement;
  name?: string;
}

/** Properties of the current side panel */
export interface SidePanelProps extends HasVisibility {
  view?: string;
  column?: string;
  offset?: number;
}

/** Different types of data viewer updates */
export enum DataViewerUpdateType {
  TOGGLE_COLUMNS = 'toggle-columns',
  UPDATE_MAX_WIDTH = 'update-max-width',
  UPDATE_MAX_HEIGHT = 'update-max-height',
  DROP_COLUMNS = 'drop-columns',
}

/** Properties of a data viewer update */
export interface DataViewerUpdateProps {
  type: DataViewerUpdateType;
  width?: number;
  height?: number;
  columns?: string[];
}

/** Popup type names */
export enum PopupType {
  HIDDEN = 'hidden',
  FILTER = 'filter',
  COLUMN_ANALYSIS = 'column-analysis',
  CORRELATIONS = 'correlations',
  PPS = 'pps',
  BUILD = 'build',
  TYPE_CONVERSION = 'type-conversion',
  CLEANERS = 'cleaners',
  RESHAPE = 'reshape',
  ABOUT = 'about',
  CONFIRM = 'confirm',
  COPY_RANGE = 'copy-range',
  COPY_COLUMN_RANGE = 'copy-column-range',
  COPY_ROW_RANGE = 'copy-row-range',
  RANGE = 'range',
  XARRAY_DIMENSIONS = 'xarray-dimensions',
  XARRAY_INDEXES = 'xarray-indexes',
  RENAME = 'rename',
  REPLACEMENT = 'replacement',
  ERROR = 'error',
  INSTANCES = 'instances',
  CODE = 'code',
  VARIANCE = 'variance',
  UPLOAD = 'upload',
  DUPLICATES = 'duplicates',
  CHARTS = 'charts',
  DESCRIBE = 'describe',
}

/** Configuration for any data for a popup */
export interface PopupData<T extends PopupType> extends HasVisibility {
  type: T;
  title?: string;
  size?: 'sm' | 'lg' | 'xl';
  backdrop?: true | false | 'static';
}

/** Popup configuration for About popup */
export type HiddenPopupData = PopupData<typeof PopupType.HIDDEN>;

export const initialPopup: HiddenPopupData = { ...initialVisibility, type: PopupType.HIDDEN };

/** Popup configuration for About popup */
export type AboutPopupData = PopupData<typeof PopupType.ABOUT>;

/** Popup configuration for Confirmation popup */
export interface ConfirmationPopupData extends PopupData<typeof PopupType.CONFIRM> {
  msg: string;
  yesAction?: () => void;
}

/** Popup configuration for CopyRangeToClipbard popup */
export interface CopyRangeToClipboardPopupData extends PopupData<typeof PopupType.COPY_RANGE> {
  text: string;
  headers: string[];
}

/** Popup configuration for Error popup */
export interface ErrorPopupData extends PopupData<typeof PopupType.ERROR> {
  error: string;
  traceback: string;
}

/** Popup configuration for Error popup */
export interface RenamePopupData extends PopupData<typeof PopupType.RENAME> {
  selectedCol: string;
  columns: ColumnDef[];
}

/** Popup configuration for RangeHighlight popup */
export interface RangeHighlightPopupData extends PopupData<typeof PopupType.RANGE> {
  rangeHighlight?: RangeHighlightConfig;
  backgroundMode?: string;
  columns: ColumnDef[];
}

/** Popup configuration for XArrayDimensions popup */
export type XArrayDimensionsPopupData = PopupData<typeof PopupType.XARRAY_DIMENSIONS>;

/** Popup configuration for XArrayIndexes popup */
export interface XArrayIndexesPopupData extends PopupData<typeof PopupType.XARRAY_INDEXES> {
  columns: ColumnDef[];
}

/** Popup configuration for ColumnAnalysis popup */
export interface ColumnAnalysisPopupData extends PopupData<typeof PopupType.COLUMN_ANALYSIS> {
  selectedCol: string;
  query?: string;
}

/** Base properties for Correlation popups */
export interface BaseCorrelationsPopupData {
  col1?: string;
  col2?: string;
}

/** Popup configuration for Correlations popup */
export interface CorrelationsPopupData extends PopupData<typeof PopupType.CORRELATIONS>, BaseCorrelationsPopupData {
  query?: string;
}

/** Popup configuration for Predictive Power Score popup */
export type PPSPopupData = PopupData<typeof PopupType.PPS> & BaseCorrelationsPopupData;

/** Popup configuration for Create Column popup */
export interface CreateColumnPopupData extends PopupData<typeof PopupType.BUILD> {
  propagateState: DataViewerPropagateState;
  selectedCol?: string;
}

/** Popup configuration for Create Column popup */
export type ReshapePopupData = PopupData<typeof PopupType.RESHAPE>;

/** Popup configuration for Charts popup */
export interface ChartsPopupData extends PopupData<typeof PopupType.CHARTS> {
  query?: string;
  x?: string;
  y?: string[];
  group?: string[];
  aggregation?: string;
  chartType?: string;
  chartPerGroup?: boolean;
}

/** Popup configuration for Describe popup */
export interface DescribePopupData extends PopupData<typeof PopupType.DESCRIBE> {
  selectedCol?: string;
}

/** Popup configuration for Duplicates popup */
export interface DuplicatesPopupData extends PopupData<typeof PopupType.DUPLICATES> {
  selectedCol?: string;
}

/** Popup configuration for Filter popup */
export type CustomFilterPopupData = PopupData<typeof PopupType.FILTER>;

/** Popup configuration for Upload popup */
export type UploadPopupData = PopupData<typeof PopupType.UPLOAD>;

/** Popup configuration for Replacement popup */
export interface ReplacementPopupData extends PopupData<typeof PopupType.REPLACEMENT> {
  propagateState: DataViewerPropagateState;
  selectedCol: string;
}

/** Popup configurations */
export type Popups =
  | HiddenPopupData
  | AboutPopupData
  | ConfirmationPopupData
  | CopyRangeToClipboardPopupData
  | ErrorPopupData
  | RenamePopupData
  | RangeHighlightPopupData
  | XArrayDimensionsPopupData
  | XArrayIndexesPopupData
  | ColumnAnalysisPopupData
  | ChartsPopupData
  | CorrelationsPopupData
  | PPSPopupData
  | CreateColumnPopupData
  | ReshapePopupData
  | ChartsPopupData
  | DescribePopupData
  | DuplicatesPopupData
  | CustomFilterPopupData
  | UploadPopupData
  | ReplacementPopupData;

/** Sort directions */
export enum SortDir {
  ASC = 'ASC',
  DESC = 'DESC',
}

/** Type definition for column being sorted and it's direction. */
export type SortDef = [string, SortDir];

/** Settings available to each instance (piece of data) of D-Tale */
export interface InstanceSettings {
  locked?: string[];
  allow_cell_edits: boolean;
  precision: number;
  columnFormats?: Record<string, ColumnFormat>;
  backgroundMode?: string;
  rangeHighlight?: RangeHighlightConfig;
  verticalHeaders: boolean;
  predefinedFilters: Record<string, PredefinedFilter>;
  sortInfo?: SortDef[];
  nanDisplay?: string;
  startup_code?: string;
  query?: string;
  outlierFilters?: Record<string, OutlierFilter>;
  filteredRanges?: FilteredRanges;
  columnFilters?: Record<string, ColumnFilter>;
}

export const BASE_INSTANCE_SETTINGS: InstanceSettings = Object.freeze({
  allow_cell_edits: true,
  precision: 2,
  verticalHeaders: false,
  predefinedFilters: {},
});

/** Type definition for semantic versioning of python */
export type Version = [number, number, number];

/** Different themes available for D-Tale */
export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
}

/** Python query engines for executing custom queries */
export enum QueryEngine {
  PYTHON = 'python',
  NUMEXPR = 'numexpr',
}

/** Application-level settings */
export interface AppSettings {
  hideShutdown: boolean;
  openCustomFilterOnStartup: boolean;
  openPredefinedFiltersOnStartup: boolean;
  hideDropRows: boolean;
  allowCellEdits: boolean;
  theme: ThemeType;
  language: string;
  pythonVersion: Version | null;
  isVSCode: boolean;
  maxColumnWidth: number | null;
  maxRowHeight: number | null;
  mainTitle: string | null;
  mainTitleFont: string | null;
  queryEngine: QueryEngine;
  showAllHeatmapColumns: boolean;
}

/** Properties for specifying filtered ranges */
export interface FilteredRanges {
  query?: string;
  dtypes?: ColumnDef[];
  ranges?: Record<string, Bounds>;
  overall?: Bounds;
}

/** Predefined filter properties */
export interface PredefinedFilter extends HasActivation {
  column: string;
  default: string | number;
  description?: string;
  inputType: 'input' | 'select' | 'multiselect';
  name: string;
}

/** Range highlight configuration properties */
export interface RangeHighlightModeCfg extends HasActivation {
  value?: number;
  color: RGBColor;
}

/** Different types of range highlighting */
export interface RangeHighlightModes {
  equals: RangeHighlightModeCfg;
  greaterThan: RangeHighlightModeCfg;
  lessThan: RangeHighlightModeCfg;
}

/** Range highlighting for individual columns or "all" columns */
export interface RangeHighlightConfig {
  [key: string | 'all']: RangeHighlightModes & HasActivation;
}

/** Properties of application state */
export interface AppState extends AppSettings {
  chartData: Popups;
  dataId: string;
  editedCell: string | null;
  editedTextAreaHeight: number;
  iframe: boolean;
  columnMenuOpen: boolean;
  selectedCol: string | null;
  selectedColRef: HTMLDivElement | null;
  xarray: boolean;
  xarrayDim: Record<string, any>;
  filteredRanges: FilteredRanges;
  settings: InstanceSettings;
  isPreview: boolean;
  menuPinned: boolean;
  menuTooltip: MenuTooltipProps;
  ribbonMenuOpen: boolean;
  ribbonDropdown: RibbonDropdownProps;
  sidePanel: SidePanelProps;
  dataViewerUpdate: DataViewerUpdateProps | null;
  predefinedFilters: PredefinedFilter[];
  dragResize: number | null;
  auth: boolean;
  username: string | null;
}
