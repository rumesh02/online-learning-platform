import { useNavigate } from 'react-router-dom';
import { UserRoundPen } from 'lucide-react';
import { logout } from '../../utils/auth';
import Button from './Button';

const InstructorHeader = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Instructor';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <UserRoundPen className="w-6 h-6 text-yellow-600" />
          <h1 className="text-2xl font-bold text-gray-800">Instructor Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, <strong>{userName}</strong></span>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default InstructorHeader;
