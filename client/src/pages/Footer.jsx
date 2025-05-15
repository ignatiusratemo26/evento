import { FaCopyright, FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { MdOutlineEmail, MdLocationOn } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Evento EMS</h3>
            <p className="text-gray-300 mb-4">
              Your all-in-one event management solution for creating, 
              sharing and managing memorable events.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="bg-white bg-opacity-10 p-2 rounded-full hover:bg-primary transition-all">
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white bg-opacity-10 p-2 rounded-full hover:bg-primary transition-all">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white bg-opacity-10 p-2 rounded-full hover:bg-primary transition-all">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white bg-opacity-10 p-2 rounded-full hover:bg-primary transition-all">
                <FaLinkedinIn className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-all">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary transition-all">About Us</Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-primary transition-all">Events</Link>
              </li>
              <li>
                <Link to="/calendar" className="text-gray-300 hover:text-primary transition-all">Calendar</Link>
              </li>
              <li>
                <Link to="/account" className="text-gray-300 hover:text-primary transition-all">My Account</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <MdLocationOn className="h-5 w-5 mr-3 text-primary" />
                <span className="text-gray-300">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center">
                <BsTelephone className="h-5 w-5 mr-3 text-primary" />
                <span className="text-gray-300">+254 700 123 456</span>
              </div>
              <div className="flex items-center">
                <MdOutlineEmail className="h-5 w-5 mr-3 text-primary" />
                <span className="text-gray-300">info@eventoems.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <FaCopyright className="h-4 w-4 mr-2" />
            <span>{currentYear} Evento EMS. All rights reserved.</span>
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-300 text-sm hover:text-primary transition-all">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-300 text-sm hover:text-primary transition-all">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}