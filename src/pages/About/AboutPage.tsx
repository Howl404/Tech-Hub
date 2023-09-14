import AboutCard from '@src/components/AboutCard/AboutCard';
import React from 'react';
import './AboutPage.scss';

import howlPng from '@assets/howl.png';
import academegPng from '@assets/academeg.png';
import capapaJpg from '@assets/capapa.jpg';
import { Link } from 'react-router-dom';

export default function AboutPage(): JSX.Element {
  const info = [
    {
      image: howlPng,
      name: 'Arthur',
      role: 'Team Lead',
      github: 'howl404',
      bio: "I'm a JavaScript sorcerer, a TypeScript tamer, and a React wrangler. An algorithm wizard and a master of procrastination. If I had an algorithm to combat procrastination, I'd probably start using it... later, maybe",
      contributions: ['Catalog', 'About Us'],
      inverted: false,
    },
    {
      image: capapaJpg,
      name: 'Rashit',
      role: 'Developer',
      github: 'capapa',
      bio: "I love JavaScript, I love new technologies and VSCode. I'm developer. Developers are creators of beauty things!",
      contributions: ['Product', 'Promocodes'],
      inverted: false,
    },
    {
      image: academegPng,
      name: 'Mikhail',
      role: 'designer & developer',
      github: 'academeg1',
      bio: 'I am a junior web developer. I have experience in web development and I want to develop in this area. I am passionate about new technologies and am ready to learn anything that can make my experience more valuable and increase my productivity.',
      contributions: ['Account', 'Cart'],
      inverted: false,
    },
  ];
  return (
    <>
      <h1 className="about__main-heading">Who are we?</h1>
      <div className="about__container">
        {info.map((member) => (
          <AboutCard member={member} key={member.name} />
        ))}
      </div>
      <div className="about__collaboration-wrapper">
        <p className="item">
          We actively conducted code reviews among team members using a combination of tools like Jira and GitHub. This
          ensured that each line of code met our high standards for quality and efficiency. Our teamwork extended beyond
          just coding, we held regular discussions to brainstorm ideas, assist each other with challenges, and refine
          our project&#39;s direction.
        </p>
        <p className="item">
          This collaborative process not only improved the overall codebase but also fostered a culture of knowledge
          sharing and continuous improvement. We maintained a disciplined approach with regular commits and a clear pull
          request system, which contributed to the project&#39;s success and our ability to stay organized and on track.
        </p>
      </div>

      <div className="about__rs-school">
        <Link className="rs-school_link" to="https://rs.school">
          <img className="rs-school_logo" src="https://rs.school/images/rs_school_js.svg" alt="RS School" />
        </Link>
      </div>
    </>
  );
}
