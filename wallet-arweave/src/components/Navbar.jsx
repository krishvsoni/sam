import React, { useState } from 'react';
import Wallet from './Wallet';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-base-100 shadow-lg font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="relative">
              <button
                className="btn btn-square btn-ghost"
                onClick={toggleDropdown}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="inline-block h-5 w-5 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
              {isOpen && (
                <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5 font-sans">
                  <div className="py-1">
                    <button className="block px-4 py-2 text-sm text-white hover:bg-white hover:text-black w-full text-left">
                      Dropdown Item 1
                    </button>
                    <button className="block px-4 py-2 text-sm text-white hover:bg-white hover:text-black w-full text-left">
                      Dropdown Item 2
                    </button>
                    <button className="block px-4 py-2 text-sm text-white hover:bg-white hover:text-black w-full text-left">
                      Dropdown Item 3
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 text-center">
            <a className="btn btn-ghost text-xl">SAM</a>
          </div>
          <div className="flex items-center ml-auto space-x-4">
            <div className="hidden sm:block">
              <Wallet />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
