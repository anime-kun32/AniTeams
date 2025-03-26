// app/components/Footer.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-4 mt-8">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left aligned text */}
        <div>
          <p className="text-lg font-semibold">
            AniTeams
          </p>
          <p className="text-sm text-gray-400">
            This website does not store any files on the server. Anime is provided by third-party providers.
          </p>
        </div>

        {/* GitHub Icon */}
        <div>
          <a
            href="https://github.com/anime-kun32/AniTeams"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400"
          >
            {/* Font Awesome GitHub icon */}
            <FontAwesomeIcon icon={faGithub} className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
