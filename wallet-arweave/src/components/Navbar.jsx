import React from 'react';
import { useLocation } from 'react-router-dom';
import Wallet from './Wallet';

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <nav className="bg-base-100 shadow-lg font-mono">
      <div className="max-w-9xl mx-auto px-6 sm:px-10 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {!isHomePage && (
              <label htmlFor="my-drawer" className="btn btn-square btn-ghost drawer-button">
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
              </label>
            )}
          </div>
          <div className="flex-1 text-left">
            <a href="/" className="btn btn-ghost text-2xl font-extrabold">SAM</a>
          </div>
          <div className="flex items-center ml-auto space-x-4">
            <Wallet />
          </div>
        </div>
      </div>
      {!isHomePage && (
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content"></div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 text-base-content text-lg min-h-full w-80 p-4">
              <li><a href="/monitor">Monitor</a></li>
              <li><a href="/">Analyzer</a></li>
              <li className="mt-auto">
                <a
                  href="/prices"
                  className="btn btn-primary bg-blue-500 text-white rounded hover:bg-blue-700 w-full text-lg"
                >
                  View Prices
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
