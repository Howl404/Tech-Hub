import React from 'react';
import { Link } from 'react-router-dom';
import './AboutCard.scss';

export default function AboutCard({
  member,
}: {
  member: {
    image: string;
    name: string;
    role: string;
    github: string;
    bio: string;
    contributions: string[];
    inverted: boolean;
  };
}): JSX.Element {
  return (
    <div className={`${member.inverted ? 'about-card-inverted' : 'about-card'}`}>
      <img src={member.image} alt="" className="about-card__image" />
      <div className="about-card__content">
        <h3 className="content__name">{member.name}</h3>
        {member.inverted ? (
          <div className="content__role-github">
            <Link className="role-github__github" to={`https://github.com/${member.github}`}>
              @{member.github}
            </Link>
            <p className="role-github__role">{member.role}</p>
          </div>
        ) : (
          <div className="content__role-github">
            <p className="role-github__role">{member.role}</p>
            <Link className="role-github__github" to={`https://github.com/${member.github}`} target="_blank">
              @{member.github}
            </Link>
          </div>
        )}

        <div className="content__vertical-line" />
        <p className="content__bio">{member.bio}</p>
        <div className="content__contributions-container">
          {member.contributions.map((contribution) => (
            <div key={contribution} className="contributions-container__item">
              {contribution}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
