import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
  onLogout?: () => void;
}

export function Header({ isAuthenticated = false, userName, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white sticky top-0 z-40" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-10 lg:px-20">
        <div className="flex items-center justify-between h-20">
          <button 
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl" style={{ 
              color: '#2563EB',
              fontWeight: 700,
              letterSpacing: '-0.5px'
            }}>
              MetricFlow
            </span>
          </button>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {userName && (
                <span className="text-sm hidden sm:block" style={{ color: '#475569' }}>
                  Welcome, <span style={{ fontWeight: 600, color: '#0F172A' }}>{userName}</span>!
                </span>
              )}
              <button
                onClick={onLogout}
                className="px-7 py-3 rounded-lg text-sm transition-all duration-300"
                style={{
                  backgroundColor: '#F8FAFC',
                  color: '#475569',
                  fontWeight: 600,
                  border: '1px solid #E2E8F0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F1F5F9';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-3 rounded-lg text-sm transition-colors"
                style={{
                  color: '#475569',
                  fontWeight: 600
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#2563EB'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-7 py-3 rounded-lg text-sm text-white transition-all duration-300"
                style={{
                  backgroundColor: '#2563EB',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1D4ED8';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.2)';
                }}
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
