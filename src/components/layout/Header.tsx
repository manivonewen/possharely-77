
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown, LogOut } from 'lucide-react';
import TelegramLogin from '../auth/TelegramLogin';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Point of Sale';
      case '/dashboard':
        return 'Dashboard';
      case '/inventory':
        return 'Inventory';
      case '/sales':
        return 'Sales History';
      default:
        return 'Loyverse POS';
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <header className="h-16 border-b border-pos-border bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-pos-dark hover:bg-pos-gray button-transition"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-semibold text-pos-dark">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg py-2 px-3 hover:bg-pos-gray button-transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pos-blue text-white">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium">
                  {user.user_metadata?.first_name || 'User'}
                </span>
                <ChevronDown size={16} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 w-48 animate-fade-in rounded-lg border border-pos-border bg-white py-1 shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-500 hover:bg-pos-gray"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={isLoading ? "opacity-50" : ""}>
              <TelegramLogin 
                buttonSize="medium"
                showUserPic={true}
                cornerRadius={8}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
