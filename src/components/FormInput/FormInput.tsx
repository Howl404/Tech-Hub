import React, { ChangeEventHandler } from 'react';
import './FormInput.scss';

function FormInput(props: {
  label: string;
  errorMessage: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  id: string;
  pattern: string;
  type: string;
  title: string;
  max?: string;
  value?: string;
  disabled?: boolean;
  button?: React.ReactNode;
}): JSX.Element {
  const { label, errorMessage, onChange, id, type, pattern, title, max, value, disabled, button } = props;
  const spanClass = `${id}-error`;

  return (
    <div className="form-input">
      <label htmlFor={id}>
        {label}
        <input
          id={id}
          onChange={onChange}
          type={type}
          pattern={pattern}
          title={title}
          max={max}
          value={value}
          disabled={disabled}
        />
        {button}
        <span className={spanClass}>{errorMessage}</span>
      </label>
    </div>
  );
}

FormInput.defaultProps = {
  max: '',
  value: '',
  disabled: false,
  button: null,
};

export default FormInput;
