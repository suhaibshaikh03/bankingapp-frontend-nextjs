"use client";
import { useState, ReactNode } from "react";
import NavBar from "./NavBar";

export default function NavBarWithBlur({ children }: { children: ReactNode }) {
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);

  return (
    <>
      <NavBar setIsDropdownHovered={setIsDropdownHovered} />
      <div className={`${isDropdownHovered ? 'blur-sm transition-all duration-300' : 'transition-all duration-300'}`}>
        {children}
      </div>
    </>
  );
}