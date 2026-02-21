import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">📚 LearnHub</h1>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/login')} variant="outline">
              Login
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Learn Without Limits
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students and instructors in the ultimate online learning platform. 
            Discover courses, share knowledge, and grow together.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/signup')} className="px-8 py-4 text-lg">
              Get Started Free
            </Button>
            <Button onClick={() => navigate('/login')} variant="outline" className="px-8 py-4 text-lg">
              Explore Courses
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">For Students</h3>
            <ul className="text-gray-600 space-y-2">
              <li>✓ Access thousands of courses</li>
              <li>✓ Learn at your own pace</li>
              <li>✓ Track your progress</li>
              <li>✓ Get personalized recommendations</li>
            </ul>
            <Button onClick={() => navigate('/signup')} className="mt-6 w-full">
              Start Learning
            </Button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-5xl mb-4">👨‍🏫</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">For Instructors</h3>
            <ul className="text-gray-600 space-y-2">
              <li>✓ Create and sell courses</li>
              <li>✓ Reach global audience</li>
              <li>✓ Track student progress</li>
              <li>✓ Build your brand</li>
            </ul>
            <Button onClick={() => navigate('/signup')} className="mt-6 w-full">
              Start Teaching
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">10,000+</div>
            <p className="text-gray-600">Active Students</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">500+</div>
            <p className="text-gray-600">Expert Instructors</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">1,000+</div>
            <p className="text-gray-600">Quality Courses</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 LearnHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
