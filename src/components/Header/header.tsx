import Link from 'next/link';
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="headerContainer">
      <Link href="/ocr" className="link">OCR</Link>
      <Link href="/Rectangles" className="link">Canvas Rectangles</Link>
      <Link href="/Equations" className="link">Equations</Link>
    </div>
  );
};

export default Header;
