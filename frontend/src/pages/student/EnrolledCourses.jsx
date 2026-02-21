import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import StudentHeader from '../../components/common/StudentHeader';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';

const EnrolledCourses = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/enrollments/my-enrollments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setEnrollments(data.data);
      } else {
        setError(data.message || 'Failed to fetch enrolled courses');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentHeader />
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      <PageHeader title="My Enrolled Courses" icon={BookOpen} backTo="/student/dashboard" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && !error && enrollments.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Enrolled Courses Yet</h3>
            <p className="text-gray-600 mb-4">Start your learning journey by browsing available courses</p>
            <Button onClick={() => navigate('/student/browse-courses')}>
              Browse Courses
            </Button>
          </div>
        )}

        {!loading && !error && enrollments.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <div 
                key={enrollment._id} 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    {enrollment.course?.category || 'General'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {enrollment.course?.title || 'Untitled Course'}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {enrollment.course?.description || 'No description available'}
                </p>
                
                <div className="text-xs text-gray-500">
                  Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EnrolledCourses;
