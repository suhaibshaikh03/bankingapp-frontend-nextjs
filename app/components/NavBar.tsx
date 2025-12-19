import Link from "next/link"
import Image from "next/image"

function NavBar(){
    return(
             <nav className="flex items-center justify-between w-full px-3 py-2 shadow-md">
             {/* LOGO */}
              <div>
              <Image src="/logo.png" alt="logo" width={100} height={300}/>
              </div>
            {/* MIDDLE SECTION */}
              <div className="flex-grow flex items-center justify-center">
                <ul className="flex items-center justify-center space-x-8">
                    <li className="text-lg"><Link href="/" className="px-4 py-2 rounded-md hover:text-white hover:bg-[#00008B] transition-colors duration-200">Home</Link></li>
                    <li className="text-lg relative group py-2 px-1">
                      <div className="relative">
                        <span className="cursor-pointer px-4 py-2 rounded-md hover:text-white hover:bg-[#00008B] transition-colors duration-200">Banking</span>

                        <ul className="absolute hidden group-hover:block mt-2 w-48 bg-[#00008B] border rounded shadow-lg z-10">
                          <li><Link href="/deposit" className="block px-4 py-2 text-white hover:bg-blue-700">Deposit</Link></li>
                          <li><Link href="/withdraw" className="block px-4 py-2 text-white hover:bg-blue-700">Withdraw</Link></li>
                          <li><Link href="/loan" className="block px-4 py-2 text-white hover:bg-blue-700">Loan</Link></li>
                        </ul>
                      </div>
                    </li>
                    <li className="text-lg relative group py-2 px-1">
                      <div className="relative">
                        <span className="cursor-pointer px-4 py-2 rounded-md hover:text-white hover:bg-[#00008B] transition-colors duration-200">Transfers</span>

                        <ul className="absolute hidden group-hover:block mt-2 w-48 bg-[#00008B] border rounded shadow-lg z-10">
                          <li><Link href="/transfer" className="block px-4 py-2 text-white hover:bg-blue-700">Transfer</Link></li>
                          <li><Link href="/beneficiary" className="block px-4 py-2 text-white hover:bg-blue-700">Beneficiary</Link></li>
                        </ul>
                      </div>
                    </li>
                    <li className="text-lg relative group py-2 px-1">
                      <div className="relative">
                        <span className="cursor-pointer px-4 py-2 rounded-md hover:text-white hover:bg-[#00008B] transition-colors duration-200">Payments</span>

                        <ul className="absolute hidden group-hover:block mt-2 w-48 bg-[#00008B] border rounded shadow-lg z-10">
                          <li><Link href="/bill-payment" className="block px-4 py-2 text-white hover:bg-blue-700">Bill Payment</Link></li>
                          <li><Link href="/top-ups" className="block px-4 py-2 text-white hover:bg-blue-700">Top-Ups</Link></li>
                        </ul>
                      </div>
                    </li>
                </ul>
              </div>
              <div className="w-24"></div> {/* Spacer for balance */}
             </nav>
          );
}
export default NavBar;

        
