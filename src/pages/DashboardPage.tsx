import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { MetricCard } from '../components/MetricCard';
import { MetricModal } from '../components/MetricModal';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { Toast } from '../components/Toast';
import { Plus, BarChart3 } from 'lucide-react';
import { getSupabaseClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabase = getSupabaseClient();

interface Metric {
  id: string;
  metric_name: string;
  current_value: number;
  target_value: number;
  unit: string;
  category: 'Sales' | 'Marketing' | 'Operations' | 'Finance';
  last_updated: string;
  user_id: string;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [filteredMetrics, setFilteredMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);
  const [deleteConfirmMetric, setDeleteConfirmMetric] = useState<Metric | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        localStorage.removeItem('supabase.auth.token');
        navigate('/login');
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('Token refreshed successfully');
        localStorage.setItem('supabase.auth.token', session.access_token);
      } else if (event === 'SIGNED_IN' && session) {
        localStorage.setItem('supabase.auth.token', session.access_token);
        setUser(session.user);
      }
    });
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      loadMetrics();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortMetrics();
  }, [metrics, filterCategory, sortBy]);

  const checkAuth = async () => {
    try {
      // First, try to get the current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        // Clear invalid tokens
        localStorage.removeItem('supabase.auth.token');
        navigate('/login');
        return;
      }
      
      if (!session) {
        console.log('No session found, redirecting to login');
        localStorage.removeItem('supabase.auth.token');
        navigate('/login');
        return;
      }
      
      // Store the access token
      localStorage.setItem('supabase.auth.token', session.access_token);
      setUser(session.user);
      
      console.log('✅ Authentication successful');
      console.log('   👤 User:', session.user.email);
      console.log('   🔑 Session valid until:', new Date(session.expires_at! * 1000).toLocaleString());
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('supabase.auth.token');
      navigate('/login');
    }
  };

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      // Get fresh token from session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('❌ No active session');
        navigate('/login');
        return;
      }
      
      const token = session.access_token;
      console.log('📡 Fetching metrics from server...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-716cadf3/metrics`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        console.error('❌ Unauthorized - session expired');
        localStorage.removeItem('supabase.auth.token');
        setToast({ message: 'Session expired. Please log in again.', type: 'error' });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Received data from server:', data);
        // Filter out any null or invalid metrics from the API response
        const validMetrics = (data.metrics || []).filter((m: any) => 
          m != null && 
          m.metric_name != null && 
          m.current_value != null && 
          m.target_value != null
        );
        console.log('✅ Valid metrics count:', validMetrics.length);
        setMetrics(validMetrics);
      } else {
        console.error('❌ Failed to fetch metrics. Status:', response.status);
        const errorData = await response.text();
        console.error('Error details:', errorData);
        setToast({ message: 'Failed to load metrics', type: 'error' });
      }
    } catch (error) {
      console.error('❌ Error loading metrics:', error);
      setMetrics([]); // Set to empty array on error
      setToast({ message: 'Error loading metrics', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortMetrics = () => {
    // Filter out null/undefined metrics first
    let filtered = metrics.filter(m => m != null && m.metric_name != null);
    console.log('🔍 Filtering metrics. Total:', metrics.length, 'After null filter:', filtered.length);

    if (filterCategory !== 'All') {
      filtered = filtered.filter(m => m.category === filterCategory);
      console.log('🔍 After category filter:', filtered.length);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.metric_name.localeCompare(b.metric_name);
        case 'progress':
          const progressA = a.target_value > 0 ? (a.current_value / a.target_value) * 100 : 0;
          const progressB = b.target_value > 0 ? (b.current_value / b.target_value) * 100 : 0;
          return progressB - progressA;
        case 'recent':
        default:
          return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime();
      }
    });

    console.log('✅ Setting filtered metrics:', filtered.length);
    setFilteredMetrics(filtered);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('supabase.auth.token');
    navigate('/login');
  };

  const openAddModal = () => {
    console.log('🔵 Add Metric button clicked - Opening modal');
    setEditingMetric(null);
    setIsModalOpen(true);
  };

  const openEditModal = (metric: Metric) => {
    setEditingMetric(metric);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMetric(null);
  };

  const handleMetricSaved = async () => {
    console.log('🟢 Metric saved! Reloading metrics...');
    
    // Close modal first for better UX
    closeModal();
    
    // Show loading state while refreshing
    setIsLoading(true);
    
    // Small delay to ensure server has processed the save
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Reload metrics
    await loadMetrics();
    
    console.log('✅ Metrics reloaded. New count:', metrics.length);
    
    // Show success toast
    setToast({ message: 'Metric saved successfully!', type: 'success' });
  };

  const handleDeleteClick = (metric: Metric) => {
    setDeleteConfirmMetric(metric);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmMetric) return;

    try {
      // Get fresh session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setToast({ message: 'Session expired. Please log in again.', type: 'error' });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      const token = session.access_token;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-716cadf3/metrics/${deleteConfirmMetric.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setDeleteConfirmMetric(null);
        setIsLoading(true);
        await loadMetrics();
        setToast({ message: 'Metric deleted successfully', type: 'success' });
      } else {
        setToast({ message: 'Failed to delete metric', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting metric:', error);
      setToast({ message: 'Error deleting metric', type: 'error' });
    }
  };

  const stats = {
    total: metrics.filter(m => m != null).length,
    onTrack: metrics.filter(m => m != null && m.current_value != null && m.target_value != null && (m.current_value / m.target_value) >= 0.8).length,
    needsAttention: metrics.filter(m => m != null && m.current_value != null && m.target_value != null && (m.current_value / m.target_value) < 0.8).length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="text-center">
          <div 
            className="inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent h-12 w-12 mb-4"
            style={{ color: '#2563EB' }}
          />
          <p style={{ color: '#64748B', fontSize: '16px' }}>Loading your metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Header isAuthenticated userName={user?.user_metadata?.full_name} onLogout={handleLogout} />
      
      <main className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-20" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
        {/* Dashboard Header */}
        <div 
          style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
            marginBottom: '48px',
            gap: '32px',
            flexWrap: 'wrap'
          }}
        >
          {/* Left Section - Title Area */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h1 
              style={{
                fontSize: '48px',
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.2,
                marginBottom: '8px',
                letterSpacing: '-1px'
              }}
            >
              My Metrics Dashboard
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#64748B',
              fontWeight: 400,
              lineHeight: 1.5
            }}>
              Track and manage your business KPIs
            </p>
          </div>
          
          {/* Right Section - Button Area */}
          <div style={{ 
            flexShrink: 0,
            paddingTop: '8px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            {/* DEBUG TEST BUTTON - Remove after testing */}
            <button
              type="button"
              onClick={async () => {
                console.log('🧪 DEBUG TEST - Current State:');
                console.log('  - User:', user);
                console.log('  - Metrics count:', metrics.length);
                console.log('  - Filtered metrics count:', filteredMetrics.length);
                const { data: { session } } = await supabase.auth.getSession();
                console.log('  - Session:', session ? 'VALID' : 'INVALID');
                console.log('  - Token in localStorage:', localStorage.getItem('supabase.auth.token') ? 'EXISTS' : 'MISSING');
                console.log('🔄 Force reloading metrics...');
                await loadMetrics();
                console.log('✅ After reload - Metrics count:', metrics.length);
              }}
              style={{
                padding: '12px 16px',
                backgroundColor: '#F59E0B',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              🧪 Test
            </button>
            
            <button
              type="button"
              onClick={openAddModal}
              aria-label="Add new metric"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#2563EB',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                padding: '16px 32px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease',
                pointerEvents: 'auto',
                position: 'relative',
                zIndex: 10,
                minHeight: '52px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1D4ED8';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2563EB';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.25)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
              }}
            >
              <Plus size={20} />
              <span>Add New Metric</span>
            </button>
          </div>
        </div>

        {/* Refresh Indicator */}
        {isLoading && !isModalOpen && (
          <div 
            style={{
              position: 'fixed',
              top: '100px',
              right: '20px',
              backgroundColor: '#2563EB',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              zIndex: 100,
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            <div 
              className="inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent h-4 w-4"
            />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Refreshing metrics...</span>
          </div>
        )}

        {/* Summary Stats */}
        {metrics.length > 0 && (
          <div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"
            style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="text-center p-5">
              <p 
                style={{
                  fontSize: '40px',
                  fontWeight: 800,
                  color: '#2563EB',
                  marginBottom: '8px',
                  lineHeight: 1
                }}
              >
                {stats.total}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Total Metrics
              </p>
            </div>
            
            <div className="text-center p-5">
              <p 
                style={{
                  fontSize: '40px',
                  fontWeight: 800,
                  color: '#10B981',
                  marginBottom: '8px',
                  lineHeight: 1
                }}
              >
                {stats.onTrack}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                On Track (≥80%)
              </p>
            </div>
            
            <div className="text-center p-5">
              <p 
                style={{
                  fontSize: '40px',
                  fontWeight: 800,
                  color: '#EF4444',
                  marginBottom: '8px',
                  lineHeight: 1
                }}
              >
                {stats.needsAttention}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Needs Attention
              </p>
            </div>
          </div>
        )}

        {/* Filter & Sort Controls */}
        {metrics.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <label 
                htmlFor="filter"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#475569',
                  marginBottom: '8px'
                }}
              >
                Filter by Category
              </label>
              <select
                id="filter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '12px 16px',
                  border: '2px solid #E2E8F0',
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  fontSize: '15px',
                  color: '#475569',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="All">All Categories</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label 
                htmlFor="sort"
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#475569',
                  marginBottom: '8px'
                }}
              >
                Sort by
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  height: '44px',
                  padding: '12px 16px',
                  border: '2px solid #E2E8F0',
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  fontSize: '15px',
                  color: '#475569',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="recent">Recent</option>
                <option value="name">Name A-Z</option>
                <option value="progress">Progress High-Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Metrics Grid or Empty State */}
        {(() => {
          console.log('🎨 Rendering decision - Filtered metrics:', filteredMetrics.length, 'Total metrics:', metrics.length);
          return filteredMetrics.length > 0;
        })() ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMetrics.map((metric) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                onEdit={() => openEditModal(metric)}
                onDelete={() => handleDeleteClick(metric)}
              />
            ))}
          </div>
        ) : (
          <div 
            className="flex flex-col items-center justify-center text-center"
            style={{
              minHeight: '400px',
              padding: '80px 40px',
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '2px dashed #E2E8F0'
            }}
          >
            <div 
              className="inline-flex items-center justify-center mb-8"
              style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                backgroundColor: '#EFF6FF'
              }}
            >
              <BarChart3 size={64} style={{ color: '#2563EB' }} />
            </div>
            
            <h2 
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: '12px'
              }}
            >
              {metrics.length === 0 ? 'No metrics yet!' : 'No metrics match your filter'}
            </h2>
            
            <p 
              style={{
                fontSize: '18px',
                color: '#64748B',
                maxWidth: '500px',
                marginBottom: '32px',
                lineHeight: 1.6
              }}
            >
              {metrics.length === 0 
                ? 'Start tracking your business KPIs by adding your first metric'
                : 'Try adjusting your filters to see more metrics'
              }
            </p>
            
            {metrics.length === 0 && (
              <button
                onClick={openAddModal}
                className="text-white transition-all duration-300"
                style={{
                  backgroundColor: '#2563EB',
                  fontSize: '16px',
                  fontWeight: 600,
                  padding: '16px 40px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1D4ED8';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.25)';
                }}
              >
                Add Your First Metric
              </button>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {isModalOpen && (
        <MetricModal
          metric={editingMetric}
          onClose={closeModal}
          onSave={handleMetricSaved}
        />
      )}

      {deleteConfirmMetric && (
        <DeleteConfirmDialog
          metricName={deleteConfirmMetric.metric_name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirmMetric(null)}
        />
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
