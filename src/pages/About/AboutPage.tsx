import AboutCard from '@src/components/AboutCard/AboutCard';
import React from 'react';

export default function AboutPage(): JSX.Element {
  const info = [
    {
      image: '1',
      name: 'Arthur',
      role: 'Team Lead',
      github: 'howl404',
      bio: "I'm a JavaScript sorcerer, a TypeScript tamer, and a React wrangler. An algorithm wizard and a master of procrastination. If I had an algorithm to combat procrastination, I'd probably start using it... later, maybe",
      contributions: ['Catalog', 'Jira', 'About Us'],
    },
  ];
  return (
    <div className="about-container">
      {info.map((member) => (
        <AboutCard member={member} key={member.name} />
      ))}
    </div>
  );
}
