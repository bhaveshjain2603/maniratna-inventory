import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  QrCode as QrCodeIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const Layout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(window.innerWidth >= 1024); // always open when width >= 768 (desktop/tablet)
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // run once on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { label: 'Products', icon: <ShoppingCartIcon />, path: '/products' },
    // { label: 'Scanner', icon: <QrCodeIcon />, path: '/scanner' },
    { label: 'Transactions', icon: <ReceiptIcon />, path: '/transactions' },
    { label: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  ];

  return (
    <div className="flex h-screen bg-off-white">
      {window.innerWidth < 768 && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed md:relative z-50 md:z-auto top-0 left-0 h-screen ${
          sidebarOpen ? 'w-56' : 'w-0 lg:w-20'
        } bg-matte-black text-white transition-all duration-300 flex flex-col overflow-hidden`}
      >
        <div className="p-3 md:p-4 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="text-sm md:text-lg">
                Welcome,
              </span>

              <span className="text-lg md:text-2xl font-semibold">
                {user?.name}
              </span>
            </div>            
          )}
          {sidebarOpen && isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-gray-700 rounded-lg transition ml-auto"
            >
              <CloseIcon className="text-sm md:text-base" />
            </button>
          )}
        </div>

        <nav className="flex-1 p-2 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setSidebarOpen(false)}
              className="flex items-center space-x-3 md:space-x-4 p-2 md:p-3 rounded-lg hover:bg-gray-700 transition text-xs md:text-sm"
            >
              <span className="text-gold text-sm md:text-lg flex-shrink-0">
                {item.icon}
              </span>
              {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-2 md:p-4 border-t border-gray-700 flex-shrink-0">
          {/* {sidebarOpen && (
            <div className="text-xs mb-3 pb-3 border-b border-gray-700">
              <p className="text-sm md:text-md text-gray-400">Logged in as</p>
              <p className="text-lg md:text-md font-semibold text-gold truncate">{user?.name}</p>
            </div>
          )} */}
          <button
            onClick={() => navigate('/setup-2fa')}
            className="w-full flex items-center justify-center space-x-2 p-2 md:p-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition text-xs md:text-sm mb-2"
          >
            <SecurityIcon className="text-sm md:text-lg" />
            {sidebarOpen && <span>Enable 2FA</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-2 md:p-3 bg-red-600 hover:bg-red-700 rounded-lg transition text-xs md:text-sm"
          >
            <LogoutIcon className="text-sm md:text-lg" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <div className="bg-white border-b border-gray-200 p-3 md:p-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1 md:p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <MenuIcon />
              </button>
            )}
            <h1 className="text-md md:text-xl font-semibold text-matte-black truncate">
              MANIRATNA JEWELS
            </h1>
          </div>
          <div className="text-xs md:text-sm text-gray-600 whitespace-nowrap ml-2">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-3 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;