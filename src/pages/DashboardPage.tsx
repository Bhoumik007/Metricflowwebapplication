import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { MetricCard } from '../components/MetricCard';
import { MetricModal } from '../components/MetricModal';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { Toast } from '../components/Toast';
import { Plus, BarChart3 } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId } from '../utils/supabase/info';

interface Metric {
  id: string;
  user_id: string;
  metric_name: string;
  current_value: number;
  target_value: number;
  unit: string;
  category: string;
  last_updated: string;
  created_at: string;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [filteredMetrics, setFilteredMetrics] = useState<Metric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; metric: Metric | null }>({
    isOpen: false,
    metric: null
  });
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  useEffect(() => {
    if (user && accessToken) {
      fetchMetrics();
    }
  }, [user, accessToken]);
  
  useEffect(() => {
    applyFiltersAndSort();
  }, [metrics, filterCategory, sortBy]);
  
  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        navigate('/login');
        return;
      }
      
      setUser(session.user);
      setAccessToken(session.access_token);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/login');
    }
  };
  
  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-716cadf3/metrics`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }
      
      const data = await response.json();
      setMetrics(data.metrics || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      showToast('Failed to load metrics', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFiltersAndSort = () => {
    let filtered = [...metrics];
    
    // Apply category filter
    if (filterCategory !== 'All') {
      filtered = filtered.filter(m => m.category === filterCategory);
    }
    
    // Apply sorting
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.metric_name.localeCompare(b.metric_name));
    } else if (sortBy === 'progress') {
      filtered.sort((a, b) => {
        const progressA = (a.current_value / a.target_value) * 100;
        const progressB = (b.current_value / b.target_value) * 100;
        return progressB - progressA;
      });
    }
    
    setFilteredMetrics(filtered);
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('session');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };
  
  const handleSaveMetric = async (metric: any) => {
    setIsSaving(true);
    
    try {
      if (editingMetric) {
        // Update existing metric
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-716cadf3/metrics/${editingMetric.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(metric)
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to update metric');
        }
        
        showToast('Metric updated successfully!', 'success');
      } else {
        // Create new metric
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-716cadf3/metrics`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(metric)
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to create metric');
        }
        
        showToast('Metric added successfully!', 'success');
      }
      
      setIsModalOpen(false);
      setEditingMetric(null);
      fetchMetrics();
    } catch (error) {
      console.error('Error saving metric:', error);
      showToast('Failed to save metric', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteMetric = async () => {
    if (!deleteDialog.metric) return;
    
    setIsSaving(true);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-716cadf3/metrics/${deleteDialog.metric.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to delete metric');
      }
      
      showToast('Metric deleted successfully!', 'success');
      setDeleteDialog({ isOpen: false, metric: null });
      fetchMetrics();
    } catch (error) {
      console.error('Error deleting metric:', error);
      showToast('Failed to delete metric', 'error');
    } finally {
      setIsSaving(false);
    }
  };
  
  const openEditModal = (metric: Metric) => {
    setEditingMetric(metric);
    setIsModalOpen(true);
  };
  
  const openAddModal = () => {
    setEditingMetric(null);
    setIsModalOpen(true);
  };
  
  const getMetricStats = () => {
    const total = metrics.length;
    const onTrack = metrics.filter(m => (m.current_value / m.target_value) >= 0.8).length;
    const needsAttention = total - onTrack;
    
    return { total, onTrack, needsAttention };
  };
  
  const stats = getMetricStats();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isAuthenticated userName={user?.user_metadata?.full_name} onLogout={handleLogout} />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your metrics...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAuthenticated userName={user?.user_metadata?.full_name} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl mb-4 sm:mb-0">My Metrics Dashboard</h1>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add New Metric
          </button>
        </div>
        
        {/* Summary Stats */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-gray-600 text-sm">Total Metrics</p>
              <p className="text-3xl mt-1">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg border border-green-200 p-4">
              <p className="text-green-700 text-sm">On Track</p>
              <p className="text-green-600 text-3xl mt-1">{stats.onTrack}</p>
            </div>
            <div className="bg-red-50 rounded-lg border border-red-200 p-4">
              <p className="text-red-700 text-sm">Needs Attention</p>
              <p className="text-red-600 text-3xl mt-1">{stats.needsAttention}</p>
            </div>
          </div>
        )}
        
        {/* Filters and Sort */}
        {metrics.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Filter by Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Recent</option>
                <option value="name">Name A-Z</option>
                <option value="progress">Progress</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Metrics Grid */}
        {filteredMetrics.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <BarChart3 className="text-blue-600" size={48} />
            </div>
            <h2 className="text-2xl mb-2">
              {metrics.length === 0 ? 'No metrics yet!' : 'No metrics match your filter'}
            </h2>
            <p className="text-gray-600 mb-6">
              {metrics.length === 0 
                ? 'Start tracking your business KPIs by adding your first metric'
                : 'Try adjusting your filters to see more metrics'
              }
            </p>
            {metrics.length === 0 && (
              <button
                onClick={openAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Add Your First Metric
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMetrics.map((metric) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                onEdit={() => openEditModal(metric)}
                onDelete={() => setDeleteDialog({ isOpen: true, metric })}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Modals */}
      <MetricModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMetric(null);
        }}
        onSave={handleSaveMetric}
        metric={editingMetric}
        isLoading={isSaving}
      />
      
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        metricName={deleteDialog.metric?.metric_name || ''}
        onConfirm={handleDeleteMetric}
        onCancel={() => setDeleteDialog({ isOpen: false, metric: null })}
        isLoading={isSaving}
      />
      
      {/* Toast */}
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
