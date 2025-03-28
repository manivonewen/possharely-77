
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ShoppingCart, 
  BarChart2, 
  Package, 
  ListCheck, 
  ClipboardList, 
  Users,
  ShoppingBag,
  DollarSign,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const navItems = [
    {
      name: 'PICOpos',
      path: '/',
      icon: <ShoppingCart size={20} />,
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <BarChart2 size={20} />,
    },
    {
      name: 'Products',
      path: '/products',
      icon: <Package size={20} />,
    },
    {
      name: 'Inventory',
      path: '/inventory',
      icon: <ListCheck size={20} />,
    },
    {
      name: 'Orders',
      path: '/sales',
      icon: <ClipboardList size={20} />,
    },
    {
      name: 'Open Tickets',
      path: '/tickets',
      icon: <ShoppingBag size={20} />,
    },
    {
      name: 'Transactions',
      path: '/transactions',
      icon: <DollarSign size={20} />,
    },
    {
      name: 'Contacts',
      path: '/contacts',
      icon: <Users size={20} />,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings size={20} />,
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-30 w-64 transform border-r border-pos-border bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:translate-x-0`}
    >
      <div className="flex h-full flex-col">
        <div className="p-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isDarkMode ? (
                <Moon size={18} className="text-pos-blue dark:text-blue-400" />
              ) : (
                <Sun size={18} className="text-pos-blue" />
              )}
              <span className="text-sm font-medium">Dark Mode</span>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium button-transition ${
                    isActive
                      ? 'bg-pos-blue text-white dark:bg-blue-700'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-pos-gray hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50'
                  }`
                }
                end
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-lg bg-pos-lightBlue dark:bg-blue-900/30 p-4">
            <h3 className="text-sm font-medium text-pos-dark dark:text-gray-200">Need Help?</h3>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Check our documentation or contact support for assistance.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
