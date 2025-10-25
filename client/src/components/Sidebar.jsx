import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  Users, 
  HelpCircle, 
  CreditCard 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'FAQs', href: '/faqs', icon: HelpCircle },
  { name: 'Pricing', href: '/pricing', icon: CreditCard },
];

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 bg-primary-600 text-white">
          <h1 className="text-xl font-bold">OfficeMoM Admin</h1>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-primary-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-700' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}