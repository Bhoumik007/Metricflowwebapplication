import { Pencil, Trash2 } from 'lucide-react';

interface Metric {
  id: string;
  metric_name: string;
  current_value: number;
  target_value: number;
  unit: string;
  category: string;
  last_updated: string;
}

interface MetricCardProps {
  metric: Metric;
  onEdit: () => void;
  onDelete: () => void;
}

export function MetricCard({ metric, onEdit, onDelete }: MetricCardProps) {
  const progress = Math.min((metric.current_value / metric.target_value) * 100, 100);
  
  const getProgressColor = () => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getCategoryColor = () => {
    switch (metric.category) {
      case 'Sales': return 'bg-blue-500';
      case 'Marketing': return 'bg-purple-500';
      case 'Operations': return 'bg-orange-500';
      case 'Finance': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className={`${getCategoryColor()} text-white text-xs px-3 py-1 rounded-full`}>
          {metric.category}
        </span>
      </div>
      
      <h3 className="text-xl mb-4">{metric.metric_name}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Current:</span>
          <span className="font-semibold text-lg">
            {metric.unit}{metric.current_value.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Target:</span>
          <span className="font-semibold text-lg">
            {metric.unit}{metric.target_value.toLocaleString()}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-semibold">{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`${getProgressColor()} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mb-4">
        Last updated: {getTimeAgo(metric.last_updated)}
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg transition-colors"
        >
          <Pencil size={16} />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
