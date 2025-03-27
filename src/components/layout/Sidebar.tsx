
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, BarChart2, Package, ClipboardList, Users, ListCheck } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
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
      name: 'Contacts',
      path: '/contacts',
      icon: <Users size={20} />,
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-30 w-64 transform border-r border-pos-border bg-white transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:translate-x-0`}
    >
      <div className="flex h-full flex-col">
        <div className="p-4">
          <div className="mb-6 flex items-center justify-center">
            <h2 className="text-xl font-bold text-pos-blue">Loyverse POS</h2>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium button-transition ${
                    isActive
                      ? 'bg-pos-blue text-white'
                      : 'text-gray-700 hover:bg-pos-gray hover:text-gray-900'
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
          <div className="rounded-lg bg-pos-lightBlue p-4">
            <h3 className="text-sm font-medium text-pos-dark">Need Help?</h3>
            <p className="mt-1 text-xs text-gray-600">
              Check our documentation or contact support for assistance.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
