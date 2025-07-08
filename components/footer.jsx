import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-gray-400 py-4 px-4 text-center border-t border-gray-800">
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-300">
          Pocket Mate <span className="text-gray-500">© 2025</span>
        </p>
        <p className="text-xs text-gray-500">
          Built with Next.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
};

export default Footer;
