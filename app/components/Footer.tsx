import Link from "next/link";
import Image from "next/image";
import { FaYoutube, FaLinkedinIn, FaInstagram, FaFacebookF, FaApple, FaGooglePlay } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-white text-gray-800 pt-16 pb-8 px-6 md:px-12 lg:px-20 overflow-hidden shadow-[0_-8px_30px_rgb(0,0,0,0.06)] border-t border-gray-100">
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Left Section: Brand & Support Button */}
        <div className="relative">
          {/* Vertical "Support" Button - Blue Hover Effect */}
          <div className="absolute -left-16 top-0 hidden xl:block">
            <button className="origin-top-left -rotate-90 translate-y-32 px-6 py-2 border border-[#00008B] text-[#00008B] text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-[#00008B] hover:text-white transition-all duration-300 rounded-b-md">
              Help Desk
            </button>
          </div>

          <div className="space-y-6">
            <Image src="/logo.png" alt="S2Pay Logo" width={110} height={40} className="object-contain" />
            <p className="text-sm text-gray-500 leading-relaxed">
              Your trusted partner in digital finance. Secure, fast, and transparent banking for the modern world.
            </p>
            
            <div className="space-y-3 pt-2">
              <h4 className="text-[#00008B] font-bold uppercase text-[10px] tracking-widest">Download S2Pay App</h4>
              <div className="flex flex-col gap-2">
                <button className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors w-44">
                  <FaApple className="text-xl" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px]">Download on the</p>
                    <p className="text-xs font-semibold">App Store</p>
                  </div>
                </button>
                <button className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors w-44">
                  <FaGooglePlay className="text-lg" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px]">Get it on</p>
                    <p className="text-xs font-semibold">Google Play</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Banking Products */}
        <div>
          <h3 className="text-lg font-bold text-[#00008B] mb-6">Banking</h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li><Link href="#" className="hover:text-[#00008B] transition-colors">Personal Accounts</Link></li>
            <li><Link href="#" className="hover:text-[#00008B] transition-colors">Business Banking</Link></li>
            <li><Link href="#" className="hover:text-[#00008B] transition-colors">Savings & Vaults</Link></li>
            <li><Link href="#" className="hover:text-[#00008B] transition-colors">Credit Cards</Link></li>
            <li><Link href="#" className="hover:text-[#00008B] transition-colors">Currency Exchange</Link></li>
          </ul>
        </div>

        {/* Security & Support */}
        <div>
          <h3 className="text-lg font-bold text-[#00008B] mb-6">Support</h3>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li><Link href="#" className="hover:text-[#00008B] transition-colors">Security Center</Link></li>
            <li><Link href="#" className="hover:text-[#00008B] transition-colors">Fraud Prevention</Link></li>
            <li><Link href="#" className="hover:text-[#00008B] transition-colors">Contact Us</Link></li>
            <li><Link href="#" className="hover:text-[#00008B] transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-[#00008B] transition-colors">FAQs</Link></li>
          </ul>
        </div>

        {/* Contact/Offices */}
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-[#00008B] mb-4">Global HQ</h3>
            <div className="text-gray-600 text-sm space-y-1">
              <p>999 Infinite Plaza, Level 42</p>
              <p>Neo-Skies District, Digital City 00101</p>
              <p className="text-[#00008B] font-bold pt-2">Phone: +92 3110087645</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-2">Connect</h4>
            <div className="flex space-x-5 text-xl text-gray-400">
              <FaYoutube className="hover:text-[#00008B] cursor-pointer transition-colors" />
              <FaLinkedinIn className="hover:text-[#00008B] cursor-pointer transition-colors" />
              <FaInstagram className="hover:text-[#00008B] cursor-pointer transition-colors" />
              <FaFacebookF className="hover:text-[#00008B] cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Developer Credit */}
      <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[12px] text-gray-500 tracking-wide">
          Copyright 2025 - S2Pay Banking System, All Rights Reserved.
        </p>
        <p className="text-[13px] text-gray-800">
          Developed by <span className="text-[#00008B] font-black uppercase">Muhammad Suhaib Shaikh</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;