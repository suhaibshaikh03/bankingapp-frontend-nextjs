import Link from "next/link"
import Image from "next/image"
import React from 'react'
import Button from './Button'
import { Menu, ChevronDown } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet"

function NavBar(){
    const menuItems = [
      { text: "Home", href: "/" },
      {
        text: "Banking",
        href: "/banking",
        subItems: [
          { text: "Deposit", href: "/banking/deposit" },
          { text: "Withdraw", href: "/banking/withdraw" },
          { text: "Loan", href: "/banking/loan" }
        ]
      },
      {
        text: "Transfers",
        href: "/transfers",
        subItems: [
          { text: "Transfer", href: "/transfers/transfer" },
          { text: "Beneficiary", href: "/transfers/beneficiary" }
        ]
      },
      {
        text: "Payments",
        href: "/payments",
        subItems: [
          { text: "Bill Payment", href: "/payments/bill-payment" },
          { text: "Top-Ups", href: "/payments/top-ups" }
        ]
      },
      { text: "Contact Us", href: "/contact-us" },
      { text: "Login", href: "/login" }
    ];

    return(
             <nav className="flex items-center justify-between w-full px-4 py-1 shadow-md relative">
             {/* LOGO */}
              <div>
              <Image src="/logo.png" alt="logo" width={100} height={300}/>
              </div>
            {/* MIDDLE SECTION */}
              <div className="hidden md:flex-grow md:flex items-center justify-center">
                <ul className="flex items-center justify-center space-x-8">
                    <li className="text-lg font-medium"><Button text="Home" asLink={true} href="/" className="hover:text-white hover:bg-[#00008B] transition-colors duration-200" /></li>
                    <li className="text-lg relative group py-1 px-1">
                      <div className="relative">
                        <Button text="Banking" asLink={true} href="/banking" className="cursor-pointer hover:text-white hover:bg-[#00008B] transition-colors duration-200 font-medium" />

                        <ul className="absolute hidden group-hover:block mt-2 w-48 bg-[#00008B] border rounded-lg shadow-lg z-10">
                          <li><Button text="Deposit" asLink={true} href="/banking/deposit" className="block text-lg text-white hover:bg-blue-700 font-medium" /></li>
                          <li><Button text="Withdraw" asLink={true} href="/banking/withdraw" className="block text-lg text-white hover:bg-blue-700 font-medium" /></li>
                          <li><Button text="Loan" asLink={true} href="/banking/loan" className="block text-lg text-white hover:bg-blue-700 font-medium" /></li>
                        </ul>
                      </div>
                    </li>
                    <li className="text-lg relative group py-1 px-1">
                      <div className="relative">
                        <Button text="Transfers" asLink={true} href="/transfers" className="cursor-pointer hover:text-white hover:bg-[#00008B] transition-colors duration-200 font-medium" />

                        <ul className="absolute hidden group-hover:block mt-2 w-48 bg-[#00008B] border rounded-lg shadow-lg z-10">
                          <li><Button text="Transfer" asLink={true} href="/transfers/transfer" className="block text-lg text-white hover:bg-blue-700 font-medium" /></li>
                          <li><Button text="Beneficiary" asLink={true} href="/transfers/beneficiary" className="block text-lg text-white hover:bg-blue-700 font-medium" /></li>
                        </ul>
                      </div>
                    </li>
                    <li className="text-lg relative group py-1 px-1">
                      <div className="relative">
                        <Button text="Payments" asLink={true} href="/payments" className="cursor-pointer hover:text-white hover:bg-[#00008B] transition-colors duration-200 font-medium" />

                        <ul className="absolute hidden group-hover:block mt-2 w-48 bg-[#00008B] border rounded-lg shadow-lg z-10">
                          <li><Button text="Bill Payment" asLink={true} href="/payments/bill-payment" className="block text-lg text-white hover:bg-blue-700 font-medium" /></li>
                          <li><Button text="Top-Ups" asLink={true} href="/payments/top-ups" className="block text-lg text-white hover:bg-blue-700 font-medium" /></li>
                        </ul>
                      </div>
                    </li>
                    <li className="text-lg font-medium"><Button text="Contact Us" asLink={true} href="/contact-us" className="hover:text-white hover:bg-[#00008B] transition-colors duration-200" /></li>
                </ul>
              </div>

              {/* DESKTOP LOGIN BUTTON - Hidden on mobile */}
              <div className="hidden md:block">
                <Button text="Login" asLink={true} href="/login" className="text-white bg-[#00008B] hover:bg-blue-700 font-medium" />
              </div>

              {/* MOBILE MENU */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="p-2 text-[#00008B] hover:text-blue-800 rounded-md hover:bg-blue-100 transition-colors">
                      <Menu className="h-6 w-6" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-3/4 sm:max-w-sm">
                    <SheetHeader>
                      <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col pt-4 space-y-2">
                      <div className="pb-4 border-b border-gray-200">
                        <Button text="Login" asLink={true} href="/login" className="text-white bg-[#00008B] hover:bg-blue-700 font-medium w-full py-2 px-3 rounded-md ml-0.5" />
                      </div>
                      {menuItems.filter(item => item.text !== "Login").map((item, index) => (
                        item.subItems ? (
                          <details key={index} className="pb-1 group">
                            <summary className="flex items-center w-full list-none cursor-pointer">
                              <span className={`flex-1 text-left font-medium py-2 px-3 rounded-md ${item.href ? 'hover:text-white hover:bg-[#00008B]' : 'cursor-pointer hover:text-white hover:bg-[#00008B]'}`}>
                                {item.text}
                              </span>
                              <div className="ml-1 p-1 rounded-md hover:bg-gray-200 transition-colors group-open:rotate-180 transition-transform duration-200">
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                              </div>
                            </summary>
                            <div className="ml-4 mt-1 flex flex-col space-y-1">
                              {item.subItems.map((subItem, subIndex) => (
                                <Button
                                  key={subIndex}
                                  text={subItem.text}
                                  asLink={true}
                                  href={subItem.href}
                                  className="block text-left text-base text-[#00008B] hover:text-white hover:bg-blue-700 font-medium p-1 rounded-sm"
                                />
                              ))}
                            </div>
                          </details>
                        ) : (
                          <div key={index} className="pb-1">
                            <div className="flex items-center w-full">
                              <Button
                                text={item.text}
                                asLink={!!item.href}
                                href={item.href}
                                className={`flex-1 text-left font-medium py-2 px-3 rounded-md ${item.href ? 'hover:text-white hover:bg-[#00008B]' : 'cursor-pointer hover:text-white hover:bg-[#00008B]'}`}
                              />
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
             </nav>
          );
}
export default NavBar;

        
