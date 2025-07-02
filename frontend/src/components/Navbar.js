import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isSalonOwner } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.jpg"
              alt="Salonease Logo"
              className="w-10 h-10 rounded-lg object-cover shadow"
            />
            <span className="text-2xl font-bold text-gray-800">
              <span className="text-pink-500">Salon</span>
              <span className="text-purple-500">ease</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link 
              to="/salons" 
              className="text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
            >
              Find Salons
            </Link>
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {isSalonOwner() ? (
                  <Link 
                    to="/salon-dashboard" 
                    className="text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
                  >
                    Salon Dashboard
                  </Link>
                ) : (
                  <Link 
                    to="/dashboard" 
                    className="text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-pink-500 focus:outline-none focus:text-pink-500"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-pink-100">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/salons" 
                className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Salons
              </Link>
              <Link 
                to="/about" 
                className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 pb-3 border-t border-pink-100">
                {!isAuthenticated ? (
                  <div className="space-y-2">
                    <Link 
                      to="/login" 
                      className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="block px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 font-medium text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {isSalonOwner() ? (
                      <Link 
                        to="/salon-dashboard" 
                        className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Salon Dashboard
                      </Link>
                    ) : (
                      <Link 
                        to="/dashboard" 
                        className="block px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-600 hover:text-pink-500 transition-colors duration-200 font-medium"
                    >
                      Logout
                    </button>
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