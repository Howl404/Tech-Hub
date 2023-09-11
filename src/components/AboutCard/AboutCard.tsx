import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutCard({
  member,
}: {
  member: { image: string; name: string; role: string; github: string; bio: string; contributions: string[] };
}): JSX.Element {
  return (
    <div className="about-card">
      <img src={member.image} alt="" />
      <h3>{member.name}</h3>
      <div className="about-card__role-github">
        <p className="role-github__role">{member.role}</p>
        <Link className="role-github__github" to={`https://github.com/${member.github}`}>
          @{member.github}
        </Link>
      </div>
      <div className="about-card__vertical-line" />
      <p className="about-card__bio">{member.bio}</p>
      {member.contributions.map((contribution) => (
        <div key={contribution} className="about-card__contribution">
          {contribution}
        </div>
      ))}
    </div>
  );
}
