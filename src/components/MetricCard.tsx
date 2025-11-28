import { Pencil, Trash2, Clock } from 'lucide-react';

interface MetricCardProps {
  metric: {
    id: string;
    metric_name: string;
    current_value: number;
    target_value: number;
    unit: string;
    category: 'Sales' | 'Marketing' | 'Operations' | 'Finance';
    last_updated: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function MetricCard({ metric, onEdit, onDelete }: MetricCardProps) {
  const progress = Math.min((metric.current_value / metric.target_value) * 100, 100);
  
  const getProgressColor = () => {
    if (progress >= 80) return '#10B981';
    if (progress >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const getCategoryStyle = () => {
    switch (metric.category) {
      case 'Sales':
        return { backgroundColor: '#EFF6FF', color: '#2563EB' };
      case 'Marketing':
        return { backgroundColor: '#F3E8FF', color: '#7C3AED' };
      case 'Operations':
        return { backgroundColor: '#FFF7ED', color: '#EA580C' };
      case 'Finance':
        return { backgroundColor: '#D1FAE5', color: '#059669' };
      default:
        return { backgroundColor: '#F1F5F9', color: '#64748B' };
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div 
      className="bg-white transition-all duration-300 cursor-default flex flex-col"
      style={{
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        minHeight: '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
        e.currentTarget.style.borderColor = '#2563EB';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
        e.currentTarget.style.borderColor = '#E2E8F0';
      }}
    >
      {/* Top Section */}
      <div>
        {/* Category Badge */}
        <div 
          className="inline-block mb-4"
          style={{
            ...getCategoryStyle(),
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            padding: '6px 12px',
            borderRadius: '6px'
          }}
        >
          {metric.category}
        </div>

        {/* Metric Name */}
        <h3 
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#0F172A',
            lineHeight: 1.3,
            marginBottom: '24px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {metric.metric_name}
        </h3>

        {/* Values Section */}
        <div className="space-y-3 mb-5">
          {/* Current Value */}
          <div>
            <p style={{
              fontSize: '12px',
              color: '#94A3B8',
              textTransform: 'uppercase',
              marginBottom: '4px',
              fontWeight: 600
            }}>
              Current
            </p>
            <p style={{
              fontSize: '36px',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1
            }}>
              {metric.unit}{metric.current_value.toLocaleString()}
            </p>
          </div>

          {/* Target Value */}
          <div>
            <p style={{
              fontSize: '12px',
              color: '#94A3B8',
              textTransform: 'uppercase',
              marginBottom: '4px',
              fontWeight: 600
            }}>
              Target
            </p>
            <p style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#64748B',
              lineHeight: 1
            }}>
              {metric.unit}{metric.target_value.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-3">
            <span style={{
              fontSize: '14px',
              color: '#64748B',
              fontWeight: 600
            }}>
              Progress
            </span>
            <span style={{
              fontSize: '16px',
              fontWeight: 600,
              color: getProgressColor()
            }}>
              {progress.toFixed(0)}%
            </span>
          </div>
          <div 
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#F1F5F9',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                height: '100%',
                width: `${progress}%`,
                backgroundColor: getProgressColor(),
                borderRadius: '4px',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div>
        {/* Last Updated */}
        <div 
          className="flex items-center gap-2 mb-4"
          style={{
            fontSize: '13px',
            color: '#94A3B8'
          }}
        >
          <Clock size={14} />
          <span>Last updated {getTimeAgo(metric.last_updated)}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: 'transparent',
              border: '2px solid #E2E8F0',
              color: '#475569',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#2563EB';
              e.currentTarget.style.color = '#2563EB';
              e.currentTarget.style.backgroundColor = '#EFF6FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Pencil size={16} />
            Edit
          </button>
          
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-2 transition-all duration-200"
            style={{
              background: 'transparent',
              border: '2px solid #E2E8F0',
              color: '#475569',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#EF4444';
              e.currentTarget.style.color = '#EF4444';
              e.currentTarget.style.backgroundColor = '#FEF2F2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
