import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import logoImage from "../Assets/Images/Prepsmartly_logo.png";
import logoWithName from "../Assets/Images/Prepsmartly_logo_name_2.jpg";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "About", href: "#about" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#000000]/50 backdrop-blur-xl border-b border-[#9333EA]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-0 group">

            <div className="hidden sm:block">
              <img
                src={logoWithName}
                alt="PrepSmartly"
                className="h-12 object-left"
              />
            </div>
            <span className="sm:hidden text-2xl font-bold bg-gradient-to-r from-[#D8B4FE] via-[#A855F7] to-[#9333EA] bg-clip-text text-transparent">
              PrepSmartly
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-[#94A3B8] hover:text-[#D8B4FE] transition-colors font-medium text-sm tracking-wide relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#9333EA] to-[#7E22CE] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Auth Buttons - Desktop */}
            <div className="hidden sm:flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className="text-[#94A3B8] text-sm hidden lg:block">
                    {currentUser.user_metadata?.full_name || currentUser.email}
                  </span>
                  <Link
                    to="/dashboard"
                    className="px-5 py-2.5 bg-gradient-to-r from-[#9333EA] to-[#7E22CE] text-white rounded-xl font-medium hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all transform hover:scale-105"
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="px-5 py-2.5 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#9333EA]/10 transition-all font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 bg-gradient-to-r from-[#9333EA] to-[#7E22CE] text-white rounded-xl font-medium hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#9333EA]/10 transition-all"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#000000]/95 backdrop-blur-xl border-b border-[#9333EA]/20 py-4">
            <div className="px-4 space-y-4">
              {/* Mobile Navigation Links */}
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#94A3B8] hover:text-[#D8B4FE] transition-colors font-medium py-2"
                >
                  {item.name}
                </a>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-[#9333EA]/20">
                {currentUser ? (
                  <div className="space-y-3">
                    <span className="block text-[#94A3B8] text-sm">
                      {currentUser.user_metadata?.full_name || currentUser.email}
                    </span>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-5 py-3 bg-gradient-to-r from-[#9333EA] to-[#7E22CE] text-white rounded-xl font-medium hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all"
                    >
                      Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-5 py-3 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#9333EA]/10 transition-all font-medium border border-[#9333EA]/20"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center px-5 py-3 bg-gradient-to-r from-[#9333EA] to-[#7E22CE] text-white rounded-xl font-medium hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
