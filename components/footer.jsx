import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-6 px-4 shadow-inner z-50">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold tracking-wide">
          Pocket Mate <span className="text-pink-400">@ 2025</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Built with ❤️ using React & Tailwind CSS
        </p>
      </div>
    </footer>
  );
};

export default Footer;
