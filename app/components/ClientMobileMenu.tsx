'use client';

import { useState } from 'react';
import Button from './Button';

interface MobileMenuProps {
  menuItems: Array<{
    text: string;
    href: string;
    subItems?: Array<{
      text: string;
      href: string;
    }>;
  }>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ menuItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <Button
          onClick={toggleMenu}
          className="p-2 text-[#00008B]"
        >
          {isMenuOpen ? (
            // Close icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-20">
          <div className="flex flex-col p-4 space-y-4">
            {menuItems.map((item, index) => (
              <div key={index} className="relative">
                <Button
                  text={item.text}
                  asLink={!!item.href}
                  href={item.href}
                  className={`w-full text-left font-medium ${item.href ? 'hover:text-white hover:bg-[#00008B]' : 'cursor-pointer hover:text-white hover:bg-[#00008B]'}`}
                />
                {item.subItems && item.subItems.map((subItem, subIndex) => (
                  <div key={subIndex} className="ml-4 mt-2">
                    <Button
                      text={subItem.text}
                      asLink={true}
                      href={subItem.href}
                      className="block text-left text-lg text-white bg-[#00008B] hover:bg-blue-700 font-medium"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;