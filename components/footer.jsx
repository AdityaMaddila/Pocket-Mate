import React from "react";

const Footer = () => {
  return (
    <footer className="w-full relative z-10 mt-16 border-t border-zinc-800/50 bg-gradient-to-r from-zinc-900/50 via-zinc-800/30 to-zinc-900/50 backdrop-blur-md shadow-inner">
      <div className="max-w-screen-xl mx-auto px-4 py-6 text-center space-y-1">
        <p className="text-sm sm:text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-100 transition-colors duration-300 hover:text-blue-400">
          Pocket Mate <span className="text-zinc-500">© 2025</span>
        </p>
        <p className="text-xs sm:text-sm text-zinc-500">
          Built with <span className="text-white">Next.js</span> &{" "}
          <span className="text-cyan-400">Tailwind CSS</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
