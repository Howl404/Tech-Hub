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
}): JSX.Element {
  const { label, errorMessage, onChange, id, type, pattern, title, max } = props;

  return (
    <div className="form-input">
      <label htmlFor={id}>
        {label}
        <input id={id} onChange={onChange} type={type} pattern={pattern} title={title} max={max} />
        <span>{errorMessage}</span>
      </label>
    </div>
  );
}

FormInput.defaultProps = {
  max: '',
};

export default FormInput;
