import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Mail } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase/client';

const supabase = getSupabaseClient();

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const validate = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (resetError) {
        setError('Unable to send reset email. Please try again.');
        setIsLoading(false);
        return;
      }
      
      setSuccess(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Password reset error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div 
          className="w-full bg-white"
          style={{
            maxWidth: '480px',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            padding: '64px 48px'
          }}
        >
          <div className="text-center" style={{ marginBottom: '48px' }}>
            <div 
              className="inline-flex items-center justify-center"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                marginBottom: '24px'
              }}
            >
              <Mail size={40} style={{ color: '#2563EB' }} />
            </div>
            <h1 
              style={{
                fontSize: '48px',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: '12px',
                letterSpacing: '-1px',
                lineHeight: '1.1'
              }}
            >
              Reset Password
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#64748B'
            }}>
              Enter your email and we'll send you a reset link
            </p>
          </div>
          
          {success ? (
            <div className="text-center">
              <div 
                style={{
                  backgroundColor: '#D1FAE5',
                  border: '2px solid #6EE7B7',
                  color: '#059669',
                  padding: '16px',
                  borderRadius: '10px',
                  marginBottom: '32px',
                  fontSize: '15px',
                  fontWeight: 500
                }}
              >
                ✓ Check your email for password reset instructions
              </div>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '15px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div 
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '2px solid #FCA5A5',
                    color: '#DC2626',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    marginBottom: '24px',
                    fontSize: '14px'
                  }}
                >
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label 
                    htmlFor="email"
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0F172A',
                      marginBottom: '8px'
                    }}
                  >
                    Email <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      height: '48px',
                      padding: '14px 16px',
                      border: `2px solid ${error ? '#EF4444' : '#E2E8F0'}`,
                      borderRadius: '10px',
                      fontSize: '16px',
                      color: '#0F172A',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      if (!error) {
                        e.target.style.borderColor = '#2563EB';
                        e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = error ? '#EF4444' : '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full text-white transition-all duration-300"
                  style={{
                    height: '52px',
                    backgroundColor: isLoading ? '#94A3B8' : '#2563EB',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '10px',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    boxShadow: isLoading ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.3)',
                    marginTop: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = '#1D4ED8';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = '#2563EB';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                    }
                  }}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              
              <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <p style={{ fontSize: '15px', color: '#64748B' }}>
                  Remember your password?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563EB',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: '15px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    Back to Login
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
