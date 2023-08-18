import { FormErrorsInterface } from '@src/interfaces/Errors';
import React from 'react';

function FormErrors({ formErrors }: FormErrorsInterface): JSX.Element {
  return (
    <div className="formErrors">
      {Object.keys(formErrors).map((fieldName) => {
        if (formErrors[fieldName].length > 0) {
          return (
            <p key={fieldName}>
              {fieldName} {formErrors[fieldName]}
            </p>
          );
        }
        return '';
      })}
    </div>
  );
}

export default FormErrors;
