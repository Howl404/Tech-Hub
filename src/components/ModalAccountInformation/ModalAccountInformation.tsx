/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import '../Modal/Modal.scss';

function ModalAccountInformation({
  active,
  setActive,
  children,
  onSubmit,
}: {
  active: boolean;
  setActive: (value: boolean) => void;
  children: JSX.Element;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}): JSX.Element {
  return (
    <div className={active ? 'modal active__modal' : 'modal'} onClick={(): void => setActive(false)}>
      <form
        className={active ? 'modal__content active__modal' : 'modal__content'}
        onClick={(e): void => e.stopPropagation()}
        onSubmit={onSubmit}
      >
        {children}
      </form>
    </div>
  );
}

export default ModalAccountInformation;
