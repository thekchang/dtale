import * as React from 'react';

/** Component properties for CheckboxProps */
interface CheckboxProps {
  value: boolean;
  setter: (value: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({ value, setter }) => (
  <i className={`ico-check-box${value ? '' : '-outline-blank'} pointer`} onClick={() => setter(!value)} />
);

/** Component properties for LabeledCheckbox */
interface LabeledCheckboxProps extends CheckboxProps {
  label: string;
  rowClass?: string;
  labelWidth?: number;
  inputWidth?: number;
}

export const LabeledCheckbox: React.FC<LabeledCheckboxProps> = ({
  label,
  labelWidth,
  inputWidth,
  value,
  setter,
  rowClass,
}) => (
  <div className={`form-group row ${rowClass ? `${rowClass} ` : ''}`}>
    <label className={`col-md-${labelWidth ?? 3} col-form-label text-right`}>{label}</label>
    <div className={`col-md-${inputWidth ?? 8} mt-auto mb-auto`}>
      <Checkbox value={value} setter={setter} />
    </div>
  </div>
);
