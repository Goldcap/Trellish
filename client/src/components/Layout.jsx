import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Board' },
  { to: '/messages', label: 'Messages' },
  { to: '/crew', label: 'Crew' },
];

export default function Layout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-navy text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold tracking-tight">Das Boot</span>
          <div className="hidden sm:flex gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/20' : 'hover:bg-white/10'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          Logout
        </button>
      </nav>
      {/* Mobile nav */}
      <div className="sm:hidden bg-navy-light flex border-t border-white/10">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `flex-1 text-center py-2 text-xs font-medium transition-colors ${
                isActive ? 'text-white bg-white/10' : 'text-white/60'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
