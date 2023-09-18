/* eslint-disable react/no-children-prop */
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalAccountInformation from '../ModalAccountInformation';

describe('ModalAccountInformation', () => {
  const setActiveMock = jest.fn();
  const onSubmitMock = jest.fn();

  const defaultProps = {
    active: true,
    setActive: setActiveMock,
    children: <div data-testid="children">Some Content</div>,
    onSubmit: onSubmitMock,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Renders modal with active class based on the active prop', () => {
    render(
      <ModalAccountInformation
        active={defaultProps.active}
        setActive={defaultProps.setActive}
        children={defaultProps.children}
        onSubmit={defaultProps.onSubmit}
      />,
    );
    expect(screen.getByTestId('children')).toBeInTheDocument();
    expect(screen.getByTestId('modal')).toHaveClass('modal active__modal');
  });

  test('Deactivates the modal when the overlay is clicked', () => {
    render(
      <ModalAccountInformation
        active={defaultProps.active}
        setActive={defaultProps.setActive}
        children={defaultProps.children}
        onSubmit={defaultProps.onSubmit}
      />,
    );
    fireEvent.click(screen.getByTestId('modal'));
    expect(setActiveMock).toHaveBeenCalledTimes(1);
    expect(setActiveMock).toHaveBeenCalledWith(false);
  });

  test('Calls onSubmit when the form is submitted', () => {
    render(
      <ModalAccountInformation
        active={defaultProps.active}
        setActive={defaultProps.setActive}
        children={defaultProps.children}
        onSubmit={defaultProps.onSubmit}
      />,
    );
    fireEvent.submit(screen.getByTestId('modal__form'));
    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });
});
