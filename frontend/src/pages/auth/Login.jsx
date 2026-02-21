import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, UserRoundPen } from 'lucide-react';
import RoleCard from '../../components/common/RoleCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: selectedRole
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.user.name);
        navigate(selectedRole === 'student' ? '/student/dashboard' : '/instructor/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {step === 1 ? (
          <div>
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-3">Welcome Back</h1>
            <p className="text-center text-gray-600 mb-10">Select your role to continue</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <RoleCard
                role="Student"
                icon={GraduationCap}
                description="Access your courses and continue learning"
                onClick={() => handleRoleSelect('student')}
              />
              <RoleCard
                role="Instructor"
                icon={UserRoundPen}
                description="Manage your courses and students"
                onClick={() => handleRoleSelect('instructor')}
              />
            </div>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button onClick={() => navigate('/signup')} className="text-yellow-600 font-semibold hover:underline">
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
            <button
              onClick={() => setStep(1)}
              className="text-gray-600 hover:text-gray-800 mb-4 flex items-center"
            >
              ← Back to role selection
            </button>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Login as {selectedRole}</h2>
            <p className="text-gray-600 mb-6">Enter your credentials to access your account</p>

            <form onSubmit={handleSubmit}>
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
              />
              
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />

              <Button type="submit" className="w-full mt-6">
                Login
              </Button>
            </form>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
              <button onClick={() => navigate('/signup')} className="text-yellow-600 font-semibold hover:underline">
                Sign up here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
