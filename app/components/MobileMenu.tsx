import React from 'react';
import Button from './Button';

interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, toggleMenu }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-20">
      <div className="flex flex-col p-4 space-y-4">
        <Button text="Home" asLink={true} href="/" className="text-left hover:text-white hover:bg-[#00008B] transition-colors duration-200" onClick={toggleMenu} />
        
        {/* Banking Dropdown */}
        <div className="relative">
          <Button text="Banking" className="w-full text-left hover:text-white hover:bg-[#00008B] transition-colors duration-200" />
          <div className="ml-4 flex flex-col space-y-2 mt-2">
            <Button text="Deposit" asLink={true} href="#" className="block text-left text-lg text-white bg-[#00008B] hover:bg-blue-700" onClick={toggleMenu} />
            <Button text="Withdraw" asLink={true} href="#" className="block text-left text-lg text-white bg-[#00008B] hover:bg-blue-700" onClick={toggleMenu} />
            <Button text="Loan" asLink={true} href="#" className="block text-left text-lg text-white bg-[#00008B] hover:bg-blue-700" onClick={toggleMenu} />
          </div>
        </div>
        
        {/* Transfers Dropdown */}
        <div className="relative">
          <Button text="Transfers" className="w-full text-left hover:text-white hover:bg-[#00008B] transition-colors duration-200" />
          <div className="ml-4 flex flex-col space-y-2 mt-2">
            <Button text="Transfer" asLink={true} href="#" className="block text-left text-lg text-white bg-[#00008B] hover:bg-blue-700" onClick={toggleMenu} />
            <Button text="Beneficiary" asLink={true} href="#" className="block text-left text-lg text-white bg-[#00008B] hover:bg-blue-700" onClick={toggleMenu} />
          </div>
        </div>
        
        {/* Payments Dropdown */}
        <div className="relative">
          <Button text="Payments" className="w-full text-left hover:text-white hover:bg-[#00008B] transition-colors duration-200" />
          <div className="ml-4 flex flex-col space-y-2 mt-2">
            <Button text="Bill Payment" asLink={true} href="#" className="block text-left text-lg text-white bg-[#00008B] hover:bg-blue-700" onClick={toggleMenu} />
            <Button text="Top-Ups" asLink={true} href="#" className="block text-left text-lg text-white bg-[#00008B] hover:bg-blue-700" onClick={toggleMenu} />
          </div>
        </div>
        
        <Button text="Login" className="text-white bg-[#00008B] hover:bg-blue-700" onClick={toggleMenu} />
      </div>
    </div>
  );
};

export default MobileMenu;