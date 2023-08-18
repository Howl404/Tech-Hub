import React from 'react';

interface FormErrorsInterface {
  formErrors: { [email: string]: string; password: string };
}

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
