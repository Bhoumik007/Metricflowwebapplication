import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Metric {
  id?: string;
  metric_name: string;
  current_value: number;
  target_value: number;
  unit: string;
  category: string;
}

interface MetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (metric: Metric) => void;
  metric?: Metric | null;
  isLoading?: boolean;
}

export function MetricModal({ isOpen, onClose, onSave, metric, isLoading = false }: MetricModalProps) {
  const [formData, setFormData] = useState<Metric>({
    metric_name: '',
    current_value: 0,
    target_value: 0,
    unit: '',
    category: 'Sales'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
  }, [metric, isOpen]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.metric_name.trim()) {
      newErrors.metric_name = 'Metric name is required';
    }
    
    if (formData.current_value < 0) {
      newErrors.current_value = 'Current value must be 0 or greater';
    }
    
    if (formData.target_value <= 0) {
      newErrors.target_value = 'Target value must be greater than 0';
    }
    
    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSave(formData);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">{metric ? 'Edit Metric' : 'Add New Metric'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Metric Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.metric_name}
              onChange={(e) => setFormData({ ...formData, metric_name: e.target.value })}
              placeholder="e.g., Monthly Revenue"
              className={`w-full px-3 py-2 border ${errors.metric_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isLoading}
              maxLength={100}
            />
            {errors.metric_name && (
              <p className="text-red-500 text-sm mt-1">{errors.metric_name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Current Value <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.current_value}
              onChange={(e) => setFormData({ ...formData, current_value: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className={`w-full px-3 py-2 border ${errors.current_value ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isLoading}
              step="0.01"
            />
            {errors.current_value && (
              <p className="text-red-500 text-sm mt-1">{errors.current_value}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Target Value <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.target_value}
              onChange={(e) => setFormData({ ...formData, target_value: parseFloat(e.target.value) || 0 })}
              placeholder="0"
              className={`w-full px-3 py-2 border ${errors.target_value ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isLoading}
              step="0.01"
            />
            {errors.target_value && (
              <p className="text-red-500 text-sm mt-1">{errors.target_value}</p>
            )}
            {formData.target_value > 0 && formData.current_value > formData.target_value && (
              <p className="text-yellow-600 text-sm mt-1">⚠️ Your current value exceeds the target</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Unit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="$, customers, %, units"
              className={`w-full px-3 py-2 border ${errors.unit ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={isLoading}
              maxLength={20}
            />
            {errors.unit && (
              <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Examples: $, customers, %, views</p>
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Metric'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
