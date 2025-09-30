
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 text-white p-4 shadow-md w-full">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">PDF Page Manager</h1>
        <p className="text-slate-300 text-sm">Upload, reorder, delete, and combine PDF pages with ease.</p>
      </div>
    </header>
  );
};

export default Header;
