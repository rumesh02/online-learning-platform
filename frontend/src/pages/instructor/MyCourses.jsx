import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Edit2, X } from 'lucide-react';
import InstructorHeader from '../../components/common/InstructorHeader';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingStudents, setViewingStudents] = useState(null);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    content: ''
  });

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/courses/my-courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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

  const handleEditClick = (course) => {
    setEditingCourse(course._id);
    setFormData({
      title: course.title,
      category: course.category,
      description: course.description,
      content: course.content
    });
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/courses/${editingCourse}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success) {
        setEditingCourse(null);
        fetchMyCourses();
        alert('Course updated successfully!');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    }
  };

  const handleViewStudents = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/enrollments/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setStudents(result.data);
        setViewingStudents(courseId);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InstructorHeader />
      <PageHeader title="My Courses" icon={BookOpen} backTo="/instructor/dashboard" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-4">You haven't created any courses yet.</p>
            <Button onClick={() => navigate('/instructor/create-course')}>
              Create Your First Course
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-xl shadow-lg p-6">
                {editingCourse === course._id ? (
                  <form onSubmit={handleUpdateCourse} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        rows="3"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        rows="6"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Save Changes</Button>
                      <Button variant="outline" onClick={() => setEditingCourse(null)}>Cancel</Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{course.title}</h2>
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          {course.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleEditClick(course)}
                        className="text-gray-600 hover:text-yellow-600 transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{course.content}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => handleViewStudents(course._id)}
                      className="flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      View Enrolled Students
                    </Button>

                    {viewingStudents === course._id && (
                      <div className="mt-4 border-t pt-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-gray-800">Enrolled Students ({students.length})</h3>
                          <button onClick={() => setViewingStudents(null)} className="text-gray-600 hover:text-gray-800">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        {students.length === 0 ? (
                          <p className="text-gray-500 text-sm">No students enrolled yet.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Enrolled Date</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {students.map((enrollment) => (
                                  <tr key={enrollment._id}>
                                    <td className="px-4 py-3 text-sm text-gray-800">{enrollment.student.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{enrollment.student.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyCourses;
