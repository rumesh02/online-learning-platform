import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2, ArrowLeft, BookOpen, Target } from 'lucide-react';
import StudentHeader from '../../components/common/StudentHeader';
import Button from '../../components/common/Button';

const AICourseSuggestions = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState('');

  const examplePrompts = [
    "I want to become a full-stack web developer",
    "Help me learn data science and machine learning",
    "I'm interested in mobile app development",
    "I want to start a career in cybersecurity"
  ];

  const handleGetRecommendations = async () => {
    if (!prompt.trim()) {
      setError('Please enter your learning goal or interest');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendations(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/recommendations/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get recommendations');
      }

      setRecommendations(data.data);
    } catch (err) {
      setError(err.message || 'Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setPrompt(example);
    setRecommendations(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50">
      <StudentHeader />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center text-gray-600 hover:text-yellow-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-lg">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">AI Course Suggestions</h2>
          </div>
          <p className="text-gray-600 text-lg">
            Tell us your learning goals and get personalized course recommendations powered by AI
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-600" />
              What are your learning goals or interests?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., I want to become a software engineer and learn frontend development..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-yellow-500 focus:outline-none transition-colors resize-none"
              rows="4"
              disabled={loading}
            />
          </div>

          {/* Example Prompts */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Try these examples:</p>
            <div className="grid md:grid-cols-2 gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  disabled={loading}
                  className="text-left px-4 py-2 text-sm bg-yellow-50 hover:bg-yellow-100 text-gray-700 rounded-lg border border-yellow-200 transition-colors disabled:opacity-50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Get Recommendations Button */}
          <Button
            onClick={handleGetRecommendations}
            disabled={loading || !prompt.trim()}
            className="w-full flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Getting Recommendations...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </div>

        {/* Recommendations Results */}
        {recommendations && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-yellow-600" />
              Recommended Courses for You
            </h3>

            {/* AI Response */}
            {recommendations.recommendations && (
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">AI Analysis:</p>
                <div className="text-gray-700 whitespace-pre-line">
                  {recommendations.recommendations}
                </div>
              </div>
            )}

            {/* Course Cards */}
            {recommendations.recommendedCourses && recommendations.recommendedCourses.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Found {recommendations.recommendedCourses.length} course{recommendations.recommendedCourses.length !== 1 ? 's' : ''} matching your goals:
                </p>
                {recommendations.recommendedCourses.map((course) => (
                  <div
                    key={course._id}
                    className="p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-400 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-xl font-bold text-gray-800">{course.title}</h4>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                        {course.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{course.description}</p>
                    {course.instructor && (
                      <p className="text-sm text-gray-500">
                        Instructor: <span className="font-semibold">{course.instructor.name}</span>
                      </p>
                    )}
                  </div>
                ))}
                
                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={() => navigate('/student/browse-courses')}
                    className="flex-1"
                  >
                    Browse All Courses
                  </Button>
                  <Button
                    onClick={() => {
                      setPrompt('');
                      setRecommendations(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Try Another Search
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No matching courses found. Try browsing all available courses.</p>
                <Button
                  onClick={() => navigate('/student/browse-courses')}
                  className="mt-4"
                >
                  Browse All Courses
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AICourseSuggestions;
