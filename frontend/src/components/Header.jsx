import React from 'react';
import Navbar from './Navbar.jsx';

export default function Header(props) {
  return (
    <div className="bg-gradient-to-b from-black/80 to-red-900/10 border-b border-red-900/20 sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-black/70">
      <Navbar {...props} />
    </div>
  );
}
