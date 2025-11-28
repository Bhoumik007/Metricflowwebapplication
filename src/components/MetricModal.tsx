import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { getSupabaseClient } from '../utils/supabase/client';

const supabase = getSupabaseClient();

interface Metric {
  id?: string;
  metric_name: string;
  current_value: number;
  target_value: number;
  unit: string;
  category: string;
}

interface MetricModalProps {
  metric?: Metric | null;
  onClose: () => void;
  onSave: () => void | Promise<void>;
}

export function MetricModal({ metric, onClose, onSave }: MetricModalProps) {
  const [formData, setFormData] = useState<Metric>({
    metric_name: '',
    current_value: 0,
    target_value: 0,
    unit: '',
    category: 'Sales'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  useEffect(() => {
    if (metric) {
      setFormData(metric);
    } else {
      setFormData({
        metric_name: '',
        current_value: 0,
        target_value: 0,
        unit: '',
        category: 'Sales'
      });
    }
    setErrors({});
    setServerError('');
  }, [metric]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    // Only validate that negative values aren't entered
    if (formData.current_value < 0) {
      newErrors.current_value = 'Current value must be 0 or greater';
    }
    
    if (formData.target_value < 0) {
      newErrors.target_value = 'Target value must be 0 or greater';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setServerError('');

    try {
      // Get fresh session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setServerError('Session expired. Please log in again.');
        setIsLoading(false);
        return;
      }
      
      const token = session.access_token;
      const url = metric?.id
        ? `https://${projectId}.supabase.co/functions/v1/make-server-716cadf3/metrics/${metric.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-716cadf3/metrics`;
      
      const response = await fetch(url, {
        method: metric?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          metric_name: formData.metric_name,
          current_value: formData.current_value,
          target_value: formData.target_value,
          unit: formData.unit,
          category: formData.category,
        }),
      });

      if (response.status === 401) {
        setServerError('Session expired. Please log in again.');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Server error:', errorData);
        throw new Error(errorData.error || 'Failed to save metric');
      }

      const result = await response.json();
      console.log('✅ Metric saved successfully:', result);
      console.log('🔄 Calling onSave to trigger dashboard refresh...');

      // Success - trigger refresh and close modal
      await onSave();
      
    } catch (error) {
      console.error('❌ Error saving metric:', error);
      setServerError(error instanceof Error ? error.message : 'Failed to save metric. Please try again.');
      setIsLoading(false);
    }
  };
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          maxWidth: '500px',
          width: '100%',
          padding: '48px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#0F172A'
          }}>
            {metric ? 'Edit Metric' : 'Add New Metric'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#475569';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            <X size={24} />
          </button>
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
          {/* Metric Name */}
          <div>
            <label 
              htmlFor="metric_name"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F172A',
                marginBottom: '8px'
              }}
            >
              Metric Name
            </label>
            <input
              id="metric_name"
              type="text"
              value={formData.metric_name}
              onChange={(e) => {
                setFormData({ ...formData, metric_name: e.target.value });
                if (errors.metric_name) setErrors({ ...errors, metric_name: '' });
              }}
              placeholder="e.g., Monthly Revenue"
              disabled={isLoading}
              maxLength={100}
              style={{
                width: '100%',
                height: '48px',
                padding: '14px 16px',
                border: `2px solid ${errors.metric_name ? '#EF4444' : '#E2E8F0'}`,
                borderRadius: '10px',
                fontSize: '16px',
                color: '#0F172A',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                if (!errors.metric_name) {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.metric_name ? '#EF4444' : '#E2E8F0';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.metric_name && (
              <p style={{ fontSize: '13px', color: '#EF4444', marginTop: '6px' }}>
                {errors.metric_name}
              </p>
            )}
          </div>
          
          {/* Current Value */}
          <div>
            <label 
              htmlFor="current_value"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F172A',
                marginBottom: '8px'
              }}
            >
              Current Value
            </label>
            <input
              id="current_value"
              type="number"
              value={formData.current_value}
              onChange={(e) => {
                setFormData({ ...formData, current_value: parseFloat(e.target.value) || 0 });
                if (errors.current_value) setErrors({ ...errors, current_value: '' });
              }}
              placeholder="0"
              disabled={isLoading}
              step="0.01"
              style={{
                width: '100%',
                height: '48px',
                padding: '14px 16px',
                border: `2px solid ${errors.current_value ? '#EF4444' : '#E2E8F0'}`,
                borderRadius: '10px',
                fontSize: '16px',
                color: '#0F172A',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                if (!errors.current_value) {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.current_value ? '#EF4444' : '#E2E8F0';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.current_value && (
              <p style={{ fontSize: '13px', color: '#EF4444', marginTop: '6px' }}>
                {errors.current_value}
              </p>
            )}
          </div>
          
          {/* Target Value */}
          <div>
            <label 
              htmlFor="target_value"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F172A',
                marginBottom: '8px'
              }}
            >
              Target Value
            </label>
            <input
              id="target_value"
              type="number"
              value={formData.target_value}
              onChange={(e) => {
                setFormData({ ...formData, target_value: parseFloat(e.target.value) || 0 });
                if (errors.target_value) setErrors({ ...errors, target_value: '' });
              }}
              placeholder="0"
              disabled={isLoading}
              step="0.01"
              style={{
                width: '100%',
                height: '48px',
                padding: '14px 16px',
                border: `2px solid ${errors.target_value ? '#EF4444' : '#E2E8F0'}`,
                borderRadius: '10px',
                fontSize: '16px',
                color: '#0F172A',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                if (!errors.target_value) {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.target_value ? '#EF4444' : '#E2E8F0';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.target_value && (
              <p style={{ fontSize: '13px', color: '#EF4444', marginTop: '6px' }}>
                {errors.target_value}
              </p>
            )}
            {formData.target_value > 0 && formData.current_value > formData.target_value && (
              <p style={{ fontSize: '13px', color: '#F59E0B', marginTop: '6px' }}>
                ⚠️ Your current value exceeds the target
              </p>
            )}
          </div>
          
          {/* Unit */}
          <div>
            <label 
              htmlFor="unit"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F172A',
                marginBottom: '8px'
              }}
            >
              Unit
            </label>
            <input
              id="unit"
              type="text"
              value={formData.unit}
              onChange={(e) => {
                setFormData({ ...formData, unit: e.target.value });
                if (errors.unit) setErrors({ ...errors, unit: '' });
              }}
              placeholder="$, customers, %, units"
              disabled={isLoading}
              maxLength={20}
              style={{
                width: '100%',
                height: '48px',
                padding: '14px 16px',
                border: `2px solid ${errors.unit ? '#EF4444' : '#E2E8F0'}`,
                borderRadius: '10px',
                fontSize: '16px',
                color: '#0F172A',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => {
                if (!errors.unit) {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.unit ? '#EF4444' : '#E2E8F0';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.unit && (
              <p style={{ fontSize: '13px', color: '#EF4444', marginTop: '6px' }}>
                {errors.unit}
              </p>
            )}
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
              Examples: $, customers, %, views
            </p>
          </div>
          
          {/* Category */}
          <div>
            <label 
              htmlFor="category"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F172A',
                marginBottom: '8px'
              }}
            >
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              disabled={isLoading}
              style={{
                width: '100%',
                height: '48px',
                padding: '14px 16px',
                border: '2px solid #E2E8F0',
                borderRadius: '10px',
                fontSize: '16px',
                color: '#0F172A',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563EB';
                e.target.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E2E8F0';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                flex: 1,
                height: '48px',
                backgroundColor: 'transparent',
                border: '2px solid #E2E8F0',
                color: '#475569',
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: '10px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                height: '48px',
                backgroundColor: isLoading ? '#94A3B8' : '#2563EB',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: '10px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: isLoading ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#1D4ED8';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#2563EB';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                }
              }}
            >
              {isLoading ? 'Saving...' : 'Save Metric'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
