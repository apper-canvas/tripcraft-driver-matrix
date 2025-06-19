import { NavLink, Outlet, useLocation } from "react-router-dom";
import React, { useContext, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { routeArray } from "@/config/routes";
import { AuthContext } from "./App";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#FAFAF8]">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-surface-200 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Compass" className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl text-primary">TripCraft</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-primary bg-primary/10 border-b-2 border-primary'
                        : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} className="w-4 h-4" />
                  <span>{route.label}</span>
</NavLink>
              ))}
              <button
                onClick={() => {
                  const authContext = React.useContext(AuthContext);
                  if (authContext) authContext.logout();
                }}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:text-primary hover:bg-primary/5"
              >
                <ApperIcon name="LogOut" className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100"
            >
              <ApperIcon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                className="w-5 h-5 text-gray-600" 
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Navigation Menu */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 z-50 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <span className="font-display font-bold text-xl text-primary">Menu</span>
            <button
              onClick={closeMobileMenu}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <nav className="space-y-2">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                  }`
                }
              >
                <ApperIcon name={route.icon} className="w-5 h-5" />
                <span>{route.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 z-40">
        <nav className="flex items-center justify-around h-16">
          {routeArray.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center space-y-1 px-2 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-gray-600'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-5 h-5" />
              <span className="text-xs font-medium">{route.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;