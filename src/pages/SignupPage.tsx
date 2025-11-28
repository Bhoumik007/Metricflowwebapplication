import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Eye, EyeOff } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { getSupabaseClient } from '../utils/supabase/client';

const supabase = getSupabaseClient();

export function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  const validatePassword = (password: string) => {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name';
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      console.log('📝 Signing up with:', formData.email);
      console.log('📡 Request URL:', `https://${projectId}.supabase.co/functions/v1/make-server-716cadf3/auth/signup`);
      console.log('📦 Request payload:', {
        email: formData.email,
        fullName: formData.fullName,
        businessName: formData.businessName
      });
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-716cadf3/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            businessName: formData.businessName
          }),
        }
      );

      console.log('📥 Response status:', response.status);
      
      const data = await response.json();
      console.log('📥 Response data:', data);

      if (!response.ok) {
        console.error('❌ Signup error response:', data.error);
        setServerError(data.error || 'Failed to create account');
        setIsLoading(false);
        return;
      }

      console.log('✅ Signup successful');
      if (data.session?.access_token) {
        console.log('🔐 Setting session in Supabase client...');
        // Set the session in Supabase client for proper persistence
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });
        console.log('✅ Session set successfully');
        console.log('🚀 Navigating to dashboard');
        navigate('/dashboard');
      } else {
        console.error('❌ No session token in response');
        setServerError('Account created but login failed. Please try logging in.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Signup exception:', error);
      console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
      setServerError(`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`);
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
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
          className="w-full max-w-[480px] bg-white"
          style={{
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            padding: '64px 48px'
          }}
        >
          {/* Heading Section */}
          <div className="text-center mb-12">
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
              Create Account
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#64748B'
            }}>
              Start tracking your metrics today
            </p>
          </div>

          {/* Server Error */}
          {serverError && (
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
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Full Name */}
            <div>
              <label 
                htmlFor="fullName"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0F172A',
                  marginBottom: '8px'
                }}
              >
                Full Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="John Doe"
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '14px 16px',
                  border: `2px solid ${errors.fullName ? '#EF4444' : '#E2E8F0'}`,
                  borderRadius: '10px',
                  fontSize: '16px',
                  color: '#0F172A',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  if (!errors.fullName) {
                    e.target.style.borderColor = '#2563EB';
                    e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.fullName ? '#EF4444' : '#E2E8F0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.fullName && (
                <p style={{ fontSize: '13px', color: '#EF4444', marginTop: '6px' }}>
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
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
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '14px 16px',
                  border: `2px solid ${errors.email ? '#EF4444' : '#E2E8F0'}`,
                  borderRadius: '10px',
                  fontSize: '16px',
                  color: '#0F172A',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  if (!errors.email) {
                    e.target.style.borderColor = '#2563EB';
                    e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#EF4444' : '#E2E8F0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.email && (
                <p style={{ fontSize: '13px', color: '#EF4444', marginTop: '6px' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Business Name (Optional) */}
            <div>
              <label 
                htmlFor="businessName"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0F172A',
                  marginBottom: '8px'
                }}
              >
                Business Name <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                id="businessName"
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="Acme Inc."
                style={{
                  width: '100%',
                  height: '48px',
                  padding: '14px 16px',
                  border: '2px solid #E2E8F0',
                  borderRadius: '10px',
                  fontSize: '16px',
                  color: '#0F172A',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0F172A',
                  marginBottom: '8px'
                }}
              >
                Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '14px 48px 14px 16px',
                    border: `2px solid ${errors.password ? '#EF4444' : '#E2E8F0'}`,
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#0F172A',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    if (!errors.password) {
                      e.target.style.borderColor = '#2563EB';
                      e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? '#EF4444' : '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    padding: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#2563EB'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p style={{ fontSize: '13px', color: '#EF4444', marginTop: '6px' }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label 
                htmlFor="confirmPassword"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0F172A',
                  marginBottom: '8px'
                }}
              >
                Confirm Password <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '14px 48px 14px 16px',
                    border: `2px solid ${errors.confirmPassword ? '#EF4444' : '#E2E8F0'}`,
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#0F172A',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    if (!errors.confirmPassword) {
                      e.target.style.borderColor = '#2563EB';
                      e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.confirmPassword ? '#EF4444' : '#E2E8F0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    padding: '4px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#2563EB'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p style={{ fontSize: '13px', color: '#EF4444', marginTop: '6px' }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <p style={{ fontSize: '15px', color: '#64748B' }}>
              Already have an account?{' '}
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
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
