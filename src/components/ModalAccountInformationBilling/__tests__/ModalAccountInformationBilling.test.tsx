import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ModalAccountInformationBilling from '../ModalAccountInformationBilling';

describe('ModalAccountInformationBilling', () => {
  test('renders correctly when active', () => {
    const setActive = jest.fn();
    const active = true;

    const { container, getByText } = render(
      <ModalAccountInformationBilling active={active} setActive={setActive}>
        <div>Test Content</div>
      </ModalAccountInformationBilling>,
    );

    expect(getByText('Test Content'));
    expect(container.querySelector('.active__modal')).not.toBeNull();
  });

  test('renders correctly when inactive', () => {
    const setActive = jest.fn();
    const active = false;

    const { container, getByText } = render(
      <ModalAccountInformationBilling active={active} setActive={setActive}>
        <div>Test Content</div>
      </ModalAccountInformationBilling>,
    );

    expect(getByText('Test Content'));
    expect(container.querySelector('.active__modal')).toBeNull();
  });

  test('calls setActive with false when clicking on the backdrop', () => {
    const setActive = jest.fn();

    const { getByText } = render(
      <ModalAccountInformationBilling active setActive={setActive}>
        <div>Test Content</div>
      </ModalAccountInformationBilling>,
    );

    fireEvent.click(getByText('Test Content').closest('.modal') as HTMLElement);
    expect(setActive).toHaveBeenCalledWith(false);
  });

  test('does not close the modal when clicking on the content', () => {
    const setActive = jest.fn();

    const { getByText } = render(
      <ModalAccountInformationBilling active setActive={setActive}>
        <div>Test Content</div>
      </ModalAccountInformationBilling>,
    );

    fireEvent.click(getByText('Test Content'));
    expect(setActive).not.toHaveBeenCalled();
  });
});
