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
}): JSX.Element {
  const { label, errorMessage, onChange, id, type, pattern, title, max, value, disabled } = props;

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
        <span>{errorMessage}</span>
      </label>
    </div>
  );
}

FormInput.defaultProps = {
  max: '',
  value: '',
  disabled: false,
};

export default FormInput;
