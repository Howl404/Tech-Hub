import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutCard from '../AboutCard';

const testMember = {
  image:
    'https://gas-kvas.com/uploads/posts/2023-02/1675485097_gas-kvas-com-p-fonovii-risunok-na-rabochii-stol-vodopad-6.jpg',
  name: 'John',
  role: 'Software Engineer',
  github: 'johndoe',
  bio: 'I love coding and building awesome stuff.',
  contributions: ['feature1', 'feature2', 'bugfix1'],
  inverted: false,
};

describe('AboutCard Component', () => {
  test('renders the member information correctly', () => {
    render(
      <BrowserRouter>
        <AboutCard member={testMember} />;
      </BrowserRouter>,
    );

    expect(screen.getByAltText('')).toHaveAttribute('src', testMember.image);
    expect(screen.getByText(testMember.name)).toBeInTheDocument();
    expect(screen.getByText(testMember.role)).toBeInTheDocument();
    expect(screen.getByText(`@${testMember.github}`)).toHaveAttribute(
      'href',
      `https://github.com/${testMember.github}`,
    );
    expect(screen.getByText(testMember.bio)).toBeInTheDocument();
  });

  test('renders github and role elements in correct order based on inverted prop', () => {
    render(
      <BrowserRouter>
        <AboutCard member={{ ...testMember, inverted: false }} />;
      </BrowserRouter>,
    );
    const roleGithubElementsFalse = screen.getAllByTestId('role-github-element');
    expect(roleGithubElementsFalse[0]).toHaveTextContent(testMember.role);
    expect(roleGithubElementsFalse[1]).toHaveTextContent(`@${testMember.github}`);
  });
});
