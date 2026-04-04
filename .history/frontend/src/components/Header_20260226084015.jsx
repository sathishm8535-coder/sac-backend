import React, { useState, useEffect } from "react";

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
      <div className="flex items-center justify-center space-x-3 sm:space-x-4 p-3 sm:p-4">
        <img
          src="/Assest/sadak1.jpg"
          alt="Sadakathullah Appa College Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white shadow-lg"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🎓%3C/text%3E%3C/svg%3E";
          }}
        />
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-wide">
          Sadakathullah Appa College
        </h1>
      </div>
    </header>
  );
};

export default Header;
