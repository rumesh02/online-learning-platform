import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageHeader = ({ title, icon: Icon, backTo }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(backTo)} 
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          {Icon && <Icon className="w-6 h-6 text-yellow-600" />}
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
