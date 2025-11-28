import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  metricName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({ 
  isOpen, 
  metricName, 
  onConfirm, 
  onCancel, 
  isLoading = false 
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-scale-in border border-gray-100">
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 rounded-full p-4 mb-5 shadow-md">
            <AlertTriangle className="text-red-600" size={36} />
          </div>
          
          <h2 className="text-2xl mb-3 font-bold text-gray-900">Delete Metric?</h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-gray-900">'{metricName}'</span>? 
            This action cannot be undone.
          </p>
          
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-5 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-gray-700 hover:shadow-md"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
