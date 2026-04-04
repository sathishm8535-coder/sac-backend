import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileQuestion, ClipboardList, BarChart3, LogOut } from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Derive base path from the current user's role
  const base = user?.role === 'staff' ? '/staff-dashboard' : '/admin-dashboard';

  const links = [
    { to: base,              icon: LayoutDashboard, label: 'Dashboard' },
    { to: `${base}/subjects`, icon: BookOpen,        label: 'Subjects'  },
    { to: `${base}/questions`,icon: FileQuestion,    label: 'Questions' },
    { to: `${base}/exams`,    icon: ClipboardList,   label: 'Exams'     },
    { to: `${base}/results`,  icon: BarChart3,       label: 'Results'   }
  ];

  const isActive = (to) =>
    to === base
      ? location.pathname === base
      : location.pathname.startsWith(to);

  return (
    <div className="w-64 bg-indigo-900 text-white min-h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-2">Exam System</h1>
      <p className="text-indigo-300 text-xs capitalize mb-8">{user?.role} Panel</p>

      <nav className="space-y-2 flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive(to) ? 'bg-indigo-700' : 'hover:bg-indigo-800'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-600 transition w-full mt-4 text-red-300 hover:text-white"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-80">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Logout</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
