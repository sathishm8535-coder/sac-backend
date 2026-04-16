import React, { useState, useEffect } from "react";
import InstallButton from './InstallButton';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 bg-indigo-900 transition-shadow duration-300 ${
        scrolled ? 'shadow-lg' : 'shadow-md'
      }`}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
        <img
          src="/Assest/sadak1.jpg"
          alt="App Logo"
          loading="lazy"
          className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
        />
          <h1 className="text-base sm:text-2xl md:text-3xl font-bold text-white tracking-wide">
            Sadakathullah Appa College
          </h1>
        </div>
        <InstallButton />
      </div>
    </header>
  );
};

export default Header;
