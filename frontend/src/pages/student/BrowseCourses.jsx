import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, ChevronLeft, ChevronRight, X } from 'lucide-react';
import StudentHeader from '../../components/common/StudentHeader';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';

const BrowseCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const coursesPerPage = 10;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses');
      const result = await response.json();
      if (result.success) {
        setCourses(result.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/enrollments/${courseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        alert('Successfully enrolled in the course!');
        setSelectedCourse(null);
      } else {
        alert(result.message || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      alert('Failed to enroll in the course');
    }
  };

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

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
      <PageHeader title="Browse Courses" icon={BookOpen} backTo="/student/dashboard" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600">No courses available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {currentCourses.map((course) => (
                <div key={course._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-bold text-gray-800">{course.title}</h2>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                      {course.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <User className="w-4 h-4 mr-1" />
                    <span>{course.instructor?.name || 'Instructor'}</span>
                  </div>
                  <Button 
                    onClick={() => setSelectedCourse(course)} 
                    variant="outline"
                    className="w-full"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedCourse.title}</h2>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  {selectedCourse.category}
                </span>
              </div>
              <button onClick={() => setSelectedCourse(null)} className="text-gray-600 hover:text-gray-800">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Instructor</h3>
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{selectedCourse.instructor?.name || 'Instructor'}</span>
                  {selectedCourse.instructor?.email && (
                    <span className="ml-2 text-sm">({selectedCourse.instructor.email})</span>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">{selectedCourse.description}</p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Course Content</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedCourse.content}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => handleEnroll(selectedCourse._id)} className="flex-1">
                  Enroll Now
                </Button>
                <Button onClick={() => setSelectedCourse(null)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseCourses;
