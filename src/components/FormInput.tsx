import React, { ChangeEventHandler } from 'react';
import './FormInput.scss';

function FormInput(props: {
  label: string;
  errorMessage: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  id: string;
  pattern: string;
  type: string;
}): JSX.Element {
  const { label, errorMessage, onChange, id, type, pattern } = props;

  return (
    <div className="form-input">
      <label htmlFor={id}>
        {label}
        <input id={id} onChange={onChange} type={type} pattern={pattern} />
        <span>{errorMessage}</span>
      </label>
    </div>
  );
}

export default FormInput;
