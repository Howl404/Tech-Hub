import React from 'react';

function FormErrors({ formErrors }: { formErrors: { [email: string]: string; password: string } }): JSX.Element {
  return (
    <div className="formErrors">
      {Object.keys(formErrors).map((fieldName, i) => {
        if (formErrors[fieldName].length > 0) {
          return (
            <p key={i}>
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
