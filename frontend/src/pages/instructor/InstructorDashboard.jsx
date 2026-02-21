import { useNavigate } from 'react-router-dom';
import { logout } from '../../utils/auth';
import Button from '../../components/common/Button';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Instructor';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateCourse = () => {
    navigate('/instructor/create-course');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">👨‍🏫 Instructor Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, <strong>{userName}</strong></span>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Teaching Dashboard</h2>
          <p className="text-gray-600">Manage your courses and engage with students</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Courses</p>
                <p className="text-3xl font-bold text-gray-800">0</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Students</p>
                <p className="text-3xl font-bold text-gray-800">0</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active Courses</p>
                <p className="text-3xl font-bold text-gray-800">0</p>
              </div>
              <div className="text-4xl">📖</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Reviews</p>
                <p className="text-3xl font-bold text-gray-800">0</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button onClick={handleCreateCourse} className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all text-left">
              <div className="text-2xl mb-2">➕</div>
              <h4 className="font-semibold text-gray-800">Create New Course</h4>
              <p className="text-sm text-gray-600">Start building your next course</p>
            </button>
            
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all text-left">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-800">View Analytics</h4>
              <p className="text-sm text-gray-600">Track course performance</p>
            </button>
            
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-all text-left">
              <div className="text-2xl mb-2">💬</div>
              <h4 className="font-semibold text-gray-800">Messages</h4>
              <p className="text-sm text-gray-600">Connect with your students</p>
            </button>
          </div>
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">My Courses</h3>
          <div className="text-center py-8 text-gray-500">
            <p>No courses created yet. Create your first course to get started!</p>
            <Button onClick={handleCreateCourse} className="mt-4">Create Your First Course</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;
