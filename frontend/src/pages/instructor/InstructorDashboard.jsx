import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, BookOpenCheck, Plus, FileEdit } from 'lucide-react';
import InstructorHeader from '../../components/common/InstructorHeader';
import Button from '../../components/common/Button';

const InstructorDashboard = () => {
  const navigate = useNavigate();

  const handleCreateCourse = () => {
    navigate('/instructor/create-course');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <InstructorHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Teaching Dashboard</h2>
          <p className="text-gray-600">Manage your courses and engage with students</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-gray-800">0</p>
              </div>
              <BookOpen className="w-10 h-10 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-800">0</p>
              </div>
              <Users className="w-10 h-10 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active Courses</p>
                <p className="text-3xl font-bold text-gray-800">0</p>
              </div>
              <BookOpenCheck className="w-10 h-10 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Instructor Actions</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button onClick={handleCreateCourse} className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all text-left">
              <Plus className="w-8 h-8 mb-2 text-yellow-600" />
              <h4 className="font-semibold text-gray-800">Create New Course</h4>
              <p className="text-sm text-gray-600">Start building your next course</p>
            </button>
            
            <button onClick={() => navigate('/instructor/my-courses')} className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all text-left">
              <FileEdit className="w-8 h-8 mb-2 text-yellow-600" />
              <h4 className="font-semibold text-gray-800">My Courses</h4>
              <p className="text-sm text-gray-600">View and manage your courses</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
