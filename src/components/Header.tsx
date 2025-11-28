import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
  onLogout?: () => void;
}

export function Header({ isAuthenticated = false, userName, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <span className="text-blue-600 text-xl sm:text-2xl">MetricFlow</span>
          </button>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-3 sm:gap-4">
              {userName && (
                <span className="text-gray-700 text-sm hidden sm:block">Welcome, {userName}!</span>
              )}
              <button
                onClick={onLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-blue-600 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
