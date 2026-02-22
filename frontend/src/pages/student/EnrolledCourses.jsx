import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Trash2, X } from 'lucide-react';
import StudentHeader from '../../components/common/StudentHeader';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';

const EnrolledCourses = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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

  const handleMarkComplete = async (enrollmentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/enrollments/${enrollmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'completed' })
      });

      const data = await response.json();

      if (data.success) {
        setEnrollments(enrollments.map(e => 
          e._id === enrollmentId ? { ...e, status: 'completed' } : e
        ));
      } else {
        setError(data.message || 'Failed to update status');
      }
    } catch (err) {
      setError('Error updating status');
    }
  };

  const confirmDelete = async () => {
    const enrollmentId = deleteConfirm;
    setDeleteConfirm(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/enrollments/${enrollmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setEnrollments(enrollments.filter(e => e._id !== enrollmentId));
        setSelectedEnrollment(null);
      } else {
        setError(data.message || 'Failed to delete enrollment');
      }
    } catch (err) {
      setError('Error deleting enrollment');
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
                onClick={() => setSelectedEnrollment(enrollment)}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
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
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </div>
                  {enrollment.status === 'completed' && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Detail Modal */}
        {selectedEnrollment && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-3 rounded-xl">
                      <BookOpen className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {selectedEnrollment.course?.title || 'Untitled Course'}
                      </h2>
                      <span className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                        {selectedEnrollment.course?.category || 'General'}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedEnrollment(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {selectedEnrollment.course?.instructor && (
                  <div className="mb-6 bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Instructor</p>
                    <p className="text-gray-900 font-semibold">{selectedEnrollment.course.instructor.name}</p>
                    <p className="text-gray-600 text-sm">{selectedEnrollment.course.instructor.email}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedEnrollment.course?.description || 'No description available'}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Content</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedEnrollment.course?.content || 'No content available'}
                  </p>
                </div>

                <div className="mb-6 flex items-center justify-between bg-gray-50 rounded-lg p-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Enrolled on</p>
                    <p className="text-gray-900 font-semibold">
                      {new Date(selectedEnrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedEnrollment.status === 'completed' && (
                    <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      Completed
                    </span>
                  )}
                </div>

                <div className="flex gap-3 border-t pt-6">
                  {selectedEnrollment.status !== 'completed' && (
                    <button
                      onClick={() => {
                        handleMarkComplete(selectedEnrollment._id);
                        setSelectedEnrollment(null);
                      }}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark as Complete
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteConfirm(selectedEnrollment._id)}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-3 rounded-lg font-medium transition-all shadow-sm hover:shadow flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Enrollment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-rose-100 p-2 rounded-lg">
                  <Trash2 className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Enrollment</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this enrollment? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EnrolledCourses;
