import Link from "next/link"
import Image from "next/image"

function NavBar(){
    return(
             <nav className="flex items-center justify-between w-full px-4 py-1 shadow-md">
             {/* LOGO */}
              <div>
              <Image src="/logo.png" alt="logo" width={100} height={300}/>
              </div>
            {/* MIDDLE SECTION */}
              <div className="flex-grow flex items-center justify-center">
                <ul className="flex items-center justify-center space-x-8">
                    <li className="text-lg"><Link href="/" className="px-4 py-1 rounded-md hover:text-white hover:bg-[#00008B] transition-colors duration-200">Home</Link></li>
                    <li className="text-base relative group py-1 px-1">
                      <div className="relative">
                        <span className="cursor-pointer px-4 py-1 rounded-md text-lg hover:text-white hover:bg-[#00008B] transition-colors duration-200">Banking</span>

                        <ul className="absolute hidden group-hover:block mt-2 w-48 bg-[#00008B] border rounded shadow-lg z-10">
                          <li><a href="#" className="block px-4 py-2 text-lg text-white hover:bg-blue-700">Deposit</a></li>
                          <li><a href="#" className="block px-4 py-2 text-lg text-white hover:bg-blue-700">Withdraw</a></li>
                          <li><a href="#" className="block px-4 py-2 text-lg text-white hover:bg-blue-700">Loan</a></li>
                        </ul>
                      </div>
                    </li>
                    <li className="text-lg relative group py-1 px-1">
                      <div className="relative">
                        <span className="cursor-pointer px-4 py-1 rounded-md text-lg hover:text-white hover:bg-[#00008B] transition-colors duration-200">Transfers</span>

                        <ul className="absolute hidden group-hover:block mt-2 w-48 bg-[#00008B] border rounded shadow-lg z-10">
                          <li><a href="#" className="block px-4 py-2 text-lg text-white hover:bg-blue-700">Transfer</a></li>
                          <li><a href="#" className="block px-4 py-2 text-lg text-white hover:bg-blue-700">Beneficiary</a></li>
                        </ul>
                      </div>
                    </li>
                    <li className="text-lg relative group py-1 px-1">
                      <div className="relative">
                        <span className="cursor-pointer px-4 py-1 rounded-md text-lg hover:text-white hover:bg-[#00008B] transition-colors duration-200">Payments</span>

                        <ul className="absolute hidden group-hover:block mt-2 w-48 bg-[#00008B] border rounded shadow-lg z-10">
                          <li><a href="#" className="block px-4 py-2 text-lg text-white hover:bg-blue-700">Bill Payment</a></li>
                          <li><a href="#" className="block px-4 py-2 text-lg text-white hover:bg-blue-700">Top-Ups</a></li>
                        </ul>
                      </div>
                    </li>
                </ul>
              </div>
              <div>
                <button className="px-4 py-1 rounded-md text-white bg-[#00008B] hover:bg-blue-700 transition-colors duration-200">
                  Login
                </button>
              </div>
             </nav>
          );
}
export default NavBar;

        
