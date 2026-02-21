import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getUserRole, isAuthenticated } from './utils/auth';
import Home from './pages/Home';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import BrowseCourses from './pages/student/BrowseCourses';
import EnrolledCourses from './pages/student/EnrolledCourses';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import MyCourses from './pages/instructor/MyCourses';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole();
  
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/browse-courses"
          element={
            <ProtectedRoute allowedRole="student">
              <BrowseCourses />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/student/enrolled-courses"
          element={
            <ProtectedRoute allowedRole="student">
              <EnrolledCourses />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/instructor/dashboard"
          element={
            <ProtectedRoute allowedRole="instructor">
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/instructor/create-course"
          element={
            <ProtectedRoute allowedRole="instructor">
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/instructor/my-courses"
          element={
            <ProtectedRoute allowedRole="instructor">
              <MyCourses />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
