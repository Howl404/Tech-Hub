/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import '../Modal/Modal.scss';

function ModalAccountInformationBilling({
  active,
  setActive,
  children,
}: {
  active: boolean;
  setActive: (value: boolean) => void;
  children: JSX.Element;
}): JSX.Element {
  return (
    <div className={active ? 'modal active__modal' : 'modal'} onClick={(): void => setActive(false)}>
      <div
        className={active ? 'modal__content active__modal' : 'modal__content'}
        onClick={(e): void => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default ModalAccountInformationBilling;
