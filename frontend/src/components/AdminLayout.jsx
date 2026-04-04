import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 bg-indigo-900 px-4 py-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-1 rounded hover:bg-indigo-800 transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          <img
            src="/Assest/sadak1.jpg"
            alt="App Logo"
            loading="lazy"
            className="h-8 w-8 rounded-full object-cover border border-white"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="text-white font-semibold text-sm truncate">
            Sadakathullah Appa College
          </span>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
